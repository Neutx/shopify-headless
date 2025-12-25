'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageGallery from '@/components/product/ImageGallery';
import VariantSelector from '@/components/product/VariantSelector';
import QuantitySelector from '@/components/product/QuantitySelector';
import AddToCartButton from '@/components/product/AddToCartButton';
import ProductAccordion from '@/components/product/ProductAccordion';
import type { CleanProduct, ShopifyProductVariant } from '@/types/shopify';
import type { ProductTemplate } from '@/types/firebase';

interface ProductPageClientProps {
  product: CleanProduct;
  template: ProductTemplate | null;
}

export default function ProductPageClient({
  product,
  template: _template,
}: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Initialize with first variant's options
    const initial: Record<string, string> = {};
    if (product.variants?.[0]?.selectedOptions) {
      product.variants[0].selectedOptions.forEach((opt: { name: string; value: string }) => {
        initial[opt.name] = opt.value;
      });
    }
    return initial;
  });

  // Get available options from all variants
  const options = useMemo(() => {
    if (!product.variants) return [];

    const optionsMap = new Map<string, Set<string>>();

    product.variants.forEach((variant: ShopifyProductVariant) => {
      variant.selectedOptions.forEach((opt: { name: string; value: string }) => {
        if (!optionsMap.has(opt.name)) {
          optionsMap.set(opt.name, new Set());
        }
        optionsMap.get(opt.name)!.add(opt.value);
      });
    });

    return Array.from(optionsMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [product.variants]);

  // Find the currently selected variant
  const selectedVariant = useMemo(() => {
    return product.variants?.find((variant: ShopifyProductVariant) => {
      return variant.selectedOptions.every(
        (opt: { name: string; value: string }) => selectedOptions[opt.name] === opt.value
      );
    });
  }, [product.variants, selectedOptions]);

  const price = selectedVariant?.price || product.minPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;

  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  // Accordion sections
  const accordionSections = [
    {
      title: 'Dimension',
      content: product.description || 'No dimension information available.',
    },
    {
      title: 'Benefits',
      content: 'Key benefits and features of this product.',
    },
    {
      title: 'Sensor',
      content: 'Technical sensor specifications.',
    },
    {
      title: 'Requirement',
      content: 'System requirements and compatibility.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left: Image Gallery */}
        <div>
          <ImageGallery images={product.images || []} productTitle={product.title} />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </span>
              {hasDiscount && compareAtPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {compareAtPrice.currencyCode} {parseFloat(compareAtPrice.amount).toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    Save{' '}
                    {Math.round(
                      ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
                        parseFloat(compareAtPrice.amount)) *
                        100
                    )}
                    %
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {options.length > 0 && product.variants && (
            <VariantSelector
              options={options}
              selectedOptions={selectedOptions}
              onChange={(optionName, value) =>
                setSelectedOptions((prev) => ({ ...prev, [optionName]: value }))
              }
              variants={product.variants}
            />
          )}

          {/* Quantity Selector */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Quantity</label>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          {/* Add to Cart */}
          <AddToCartButton
            variantId={selectedVariant?.id || product.variants?.[0]?.id || ''}
            quantity={quantity}
            disabled={!selectedVariant?.availableForSale}
            className="w-full"
          />

          {!selectedVariant?.availableForSale && (
            <p className="text-sm text-destructive">
              This variant is currently out of stock
            </p>
          )}

          {/* Accordion Sections */}
          <div className="pt-8">
            <ProductAccordion sections={accordionSections} />
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="specs">Technical Specifications</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-8">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold mb-4">Product Details</h3>
              <div
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="specs" className="mt-8">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
              <p className="text-muted-foreground">
                Detailed technical specifications will be displayed here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="download" className="mt-8">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-bold mb-4">Downloads</h3>
              <p className="text-muted-foreground">
                Product manuals and software downloads will be available here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products - Placeholder */}
      {/* <div>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div> */}
    </div>
  );
}

