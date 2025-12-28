'use client';

import { useEffect, useState } from 'react';
import SectionRenderer from '@/components/sections/SectionRenderer';
import ProductPageClient from '@/app/products/[handle]/ProductPageClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Section } from '@/types/sections';
import type { CleanProduct } from '@/types/shopify';

// Wrapper component to provide product context if needed
function PreviewContent({ 
  sections, 
  selectedSectionId, 
  productHandle,
  product,
  onSectionClick 
}: { 
  sections: Section[], 
  selectedSectionId: string | null,
  productHandle: string,
  product: CleanProduct | null,
  onSectionClick: (id: string) => void
}) {
  // Show message if no product is selected
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground p-8">
          <p className="text-xl mb-2 font-medium">No Product Selected</p>
          <p className="text-sm">Select a product from the preview toolbar to see the product page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Default Product Page Content */}
        <ProductPageClient product={product} template={null} />
        
        {/* Template Sections - Rendered Below Product Content */}
        {sections.length > 0 && sections.map((section) => (
        <div
          key={section.id}
          className={`relative group transition-all duration-200 cursor-pointer ${
            selectedSectionId === section.id 
              ? 'ring-2 ring-blue-500 ring-inset z-10' 
              : 'hover:ring-1 hover:ring-blue-300 hover:ring-inset'
          }`}
          style={{
            scrollMarginTop: '100px',
          }}
          onClick={() => {
            // Send message to select this section (single click)
            window.parent.postMessage({ 
              type: 'SELECT_SECTION', 
              sectionId: section.id 
            }, '*');
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onSectionClick(section.id);
          }}
        >
          {selectedSectionId === section.id && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 z-20 rounded-bl font-medium">
              Editing
            </div>
          )}
          
          {/* Overlay to intercept clicks but allow scrolling - pointer-events-none on content would break interactive elements */}
          <div className="relative">
             <SectionRenderer 
              section={section} 
              productId={productHandle} // This is actually a handle, prop name is legacy
            />
          </div>
        </div>
      ))}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function TemplatePreviewPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [productHandle, setProductHandle] = useState<string>('');
  const [product, setProduct] = useState<CleanProduct | null>(null);

  useEffect(() => {
    // Listen for messages from parent window (template builder)
    const handleMessage = (event: MessageEvent) => {
      // In production, validate event.origin for security
      if (event.data.type === 'UPDATE_SECTIONS') {
        setSections(event.data.sections || []);
        setSelectedSectionId(event.data.selectedSectionId || null);
        // Receive product data from parent
        if (event.data.product) {
          setProduct(event.data.product);
          setProductHandle(event.data.product.handle);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Send ready message to parent
    window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSectionDoubleClick = (sectionId: string) => {
    // Send message to open settings
    window.parent.postMessage({ 
      type: 'OPEN_SETTINGS', 
      sectionId 
    }, '*');
  };

  return (
    <PreviewContent 
      sections={sections}
      selectedSectionId={selectedSectionId}
      productHandle={productHandle}
      product={product}
      onSectionClick={handleSectionDoubleClick}
    />
  );
}
