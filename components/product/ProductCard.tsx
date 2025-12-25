'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/ui/SafeImage';
import type { CleanProduct } from '@/types/shopify';

interface ProductCardProps {
  product: CleanProduct;
  priority?: boolean;
}

export default function ProductCard({ product, priority }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const price = product.variants?.[0]?.price || product.minPrice;
  const compareAtPrice = product.variants?.[0]?.compareAtPrice;
  
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  
  // Calculate discount percentage
  const discountPercentage = hasDiscount
    ? Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {/* Product Image */}
        {product.images?.[0] && (
          <SafeImage
            src={product.images[0].url}
            alt={product.images[0].altText || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            fetchPriority={priority ? 'high' : undefined}
          />
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}

        {/* Quick Add Button (shown on hover) */}
        {isHovered && (
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implement quick add to cart
                console.log('Quick add:', product.id);
              }}
            >
              Quick Add
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>
          
          {hasDiscount && compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {compareAtPrice.currencyCode} {parseFloat(compareAtPrice.amount).toFixed(2)}
            </span>
          )}
        </div>

        {/* Available variants count */}
        {product.variants && product.variants.length > 1 && (
          <p className="text-xs text-muted-foreground">
            {product.variants.length} variants available
          </p>
        )}
      </div>
    </Link>
  );
}

