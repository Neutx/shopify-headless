'use client';

import SectionRenderer from '@/components/sections/SectionRenderer';
import type { Section } from '@/types/sections';

interface TemplateRendererProps {
  sections: Section[];
  productId?: string;
}

/**
 * Renders all sections in a template
 */
export default function TemplateRenderer({ sections, productId }: TemplateRendererProps) {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="template-renderer">
      {sortedSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          productId={productId}
        />
      ))}
    </div>
  );
}

