'use client';

import { Suspense, lazy } from 'react';
import type { Section } from '@/types/sections';

// Section component map
const sectionComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  reviews: lazy<React.ComponentType<any>>(() => import('./ReviewsSection')),
  hero: lazy<React.ComponentType<any>>(() => import('./HeroSection')),
  gallery: lazy<React.ComponentType<any>>(() => import('./GallerySection')),
  specs: lazy<React.ComponentType<any>>(() => import('./SpecsSection')),
  relatedProducts: lazy<React.ComponentType<any>>(() => import('./RelatedProductsSection')),
};

interface SectionRendererProps {
  section: Section;
  productId?: string;
}

/**
 * Dynamically renders a section based on its type
 */
export default function SectionRenderer({ section, productId }: SectionRendererProps) {
  // Skip disabled sections
  if (!section.enabled) {
    return null;
  }

  const SectionComponent = sectionComponents[section.type];

  // If section type is not found, render a placeholder
  if (!SectionComponent) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="border-2 border-dashed border-red-500 p-8 text-center bg-red-50">
          <p className="text-red-600 font-semibold">
            Unknown section type: &quot;{section.type}&quot;
          </p>
          <p className="text-sm text-red-500 mt-2">
            Section ID: {section.id}
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <Suspense fallback={<SectionSkeleton />}>
      <SectionComponent section={section} productId={productId} />
    </Suspense>
  );
}

/**
 * Loading skeleton while section is being loaded
 */
function SectionSkeleton() {
  return (
    <div className="py-12 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}

