import { notFound } from 'next/navigation';
import { fetchProductByHandle } from '@/lib/shopify/products';
import { getProductTemplate } from '@/lib/firebase/products';
import ProductPageClient from './ProductPageClient';

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

    // Fetch template configuration from Firebase
    const template = await getProductTemplate(product.id);

    return <ProductPageClient product={product} template={template} />;
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
    };
  } catch {
    return {
      title: 'Product',
    };
  }
}

