'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { Button } from '@/components/ui/button';
import type { Section } from '@/types/sections';
import type { CleanProduct } from '@/types/shopify';

interface RelatedProductsSectionProps {
  section: Section;
  productId?: string;
}

export default function RelatedProductsSection({ section, productId }: RelatedProductsSectionProps) {
  const settings = section.settings;
  const [relatedProducts, setRelatedProducts] = useState<CleanProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        // In a real implementation, this would fetch related products from Shopify
        // based on the selectionMethod setting
        const response = await fetch(`/api/sync?action=list`);
        const data = await response.json();
        
        // For now, just use mock data or the first few products
        const products = data.products || [];
        const limited = products.slice(0, settings.limit);
        setRelatedProducts(limited);
      } catch (error) {
        console.error('Error fetching related products:', error);
        // Use mock products as fallback
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [settings.limit, settings.selectionMethod, productId]);

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{settings.title}</h2>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: settings.limit }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{settings.title}</h2>

        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))`,
          }}
        >
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/products/${product.handle}`}>
                <div className="relative aspect-square">
                  <SafeImage
                    src={product.images?.[0]?.url || 'https://placehold.co/600x600/e5e7eb/6b7280?text=Product'}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/products/${product.handle}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                </Link>

                {settings.showRating && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-sm text-muted-foreground">(4.5)</span>
                  </div>
                )}

                {settings.showPrice && (
                  <p className="text-lg font-bold mb-4">
                    $299.99
                  </p>
                )}

                <Button asChild className="w-full">
                  <Link href={`/products/${product.handle}`}>
                    {settings.ctaText}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

