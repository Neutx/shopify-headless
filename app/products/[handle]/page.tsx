import { notFound } from 'next/navigation';
import { fetchProductByHandle } from '@/lib/shopify/products';
import { getProductTemplate } from '@/lib/firebase/products';
import { getTemplate } from '@/lib/firebase/templates';
import { mergeAllSectionOverrides } from '@/lib/sections/utils';
import ProductPageClient from './ProductPageClient';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  try {
    // Fetch product from Shopify
    const product = await fetchProductByHandle(handle);

    if (!product) {
      notFound();
    }

    // Fetch product template assignment using handle (not Shopify ID)
    const productTemplate = await getProductTemplate(product.handle);
    
    // Check if product has a template assigned with sections
    let templateSections = null;
    if (productTemplate && productTemplate.templateId) {
      const template = await getTemplate(productTemplate.templateId);
      
      if (template && template.sections && template.sections.length > 0) {
        // Merge product-specific overrides with template sections
        templateSections = mergeAllSectionOverrides(
          template.sections,
          productTemplate.sectionOverrides
        );
      }
    }

    // Always render default product page
    // If template sections exist, they'll be rendered below
    return (
      <div>
        <ProductPageClient product={product} template={productTemplate} />
        {templateSections && templateSections.length > 0 && (
          <TemplateRenderer sections={templateSections} productId={product.handle} />
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  
  try {
    const product = await fetchProductByHandle(handle);

    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.images?.[0]
          ? [
              {
                url: product.images[0].url,
                alt: product.images[0].altText || product.title,
              },
            ]
          : [],
      },
      other: {
        'link-preconnect': 'https://cdn.shopify.com',
        'link-dns-prefetch': 'https://cdn.shopify.com',
      },
    };
  } catch {
    return {
      title: 'Product',
    };
  }
}

