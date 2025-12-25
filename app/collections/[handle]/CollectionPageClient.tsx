'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductCard from '@/components/product/ProductCard';
import type { CleanCollection } from '@/types/shopify';

interface CollectionPageClientProps {
  collection: CleanCollection;
}

const sortOptions = [
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title-asc', label: 'A-Z' },
  { value: 'title-desc', label: 'Z-A' },
  { value: 'created-desc', label: 'Newest' },
];

export default function CollectionPageClient({
  collection,
}: CollectionPageClientProps) {
  const [sortBy, setSortBy] = useState('best-selling');
  const [showFilters, setShowFilters] = useState(false);

  // Sort products based on selected option
  const sortedProducts = [...(collection.products || [])].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (
          parseFloat(a.minPrice.amount) -
          parseFloat(b.minPrice.amount)
        );
      case 'price-desc':
        return (
          parseFloat(b.minPrice.amount) -
          parseFloat(a.minPrice.amount)
        );
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'created-desc':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0; // best-selling - keep original order
    }
  });

  return (
    <div>
      {/* Hero Banner */}
      {collection.image && (
        <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {collection.title}
            </h1>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Description */}
        {collection.description && (
          <div className="mb-8 text-center max-w-3xl mx-auto">
            <p className="text-muted-foreground">{collection.description}</p>
          </div>
        )}

        {/* Filters & Sort Bar */}
        <div className="flex items-center justify-between py-6 border-b border-border mb-8">
          {/* Filter Button */}
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
            <span className="font-medium">Show Filter</span>
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Sidebar (if needed in future) */}
        {showFilters && (
          <div className="mb-8 p-6 border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <p className="text-sm text-muted-foreground">
              Filter options will be available here
            </p>
          </div>
        )}

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No products found in this collection.
            </p>
          </div>
        )}

        {/* Pagination Placeholder */}
        {/* TODO: Implement pagination when collection has many products */}
      </div>
    </div>
  );
}

