'use client';

import { useEffect, useRef, useState } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Section } from '@/types/sections';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShopifyProduct } from '@/types/shopify';

interface PreviewFrameProps {
  sections: Section[];
  selectedSectionId: string | null;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceSizes: Record<DeviceType, { width: string; height: string }> = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '667px' },
};

export default function PreviewFrame({ sections, selectedSectionId }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isReady, setIsReady] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [selectedProductHandle, setSelectedProductHandle] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch real products for preview
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?limit=10');
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          // Auto-select first product's HANDLE
          setSelectedProductHandle(data.products[0].handle);
        }
      } catch (error) {
        console.error('Error fetching preview products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Listen for ready message from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PREVIEW_READY') {
        setIsReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    // Send updated sections and product to iframe when ready
    // Only send if we have a valid productHandle to avoid race condition
    if (isReady && iframeRef.current?.contentWindow && selectedProductHandle) {
      // Find the product data from the products list
      const selectedProduct = products.find(p => p.handle === selectedProductHandle);
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'UPDATE_SECTIONS',
          sections,
          selectedSectionId,
          product: selectedProduct, // Pass full product data
          productHandle: selectedProductHandle, // Keep for backwards compatibility
        },
        '*'
      );
    }
  }, [sections, selectedSectionId, selectedProductHandle, isReady, products]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsReady(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="bg-muted p-2 flex items-center justify-between border-b gap-2 flex-wrap">
        <div className="flex gap-1">
          <Button
            variant={device === 'desktop' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDevice('desktop')}
            title="Desktop"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={device === 'tablet' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDevice('tablet')}
            title="Tablet"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={device === 'mobile' ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDevice('mobile')}
            title="Mobile"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        {/* Product Selector */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <Package className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedProductHandle} onValueChange={setSelectedProductHandle} disabled={loading}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={loading ? "Loading products..." : "Select product for preview"} />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.handle}>
                  {p.title.substring(0, 30)}{p.title.length > 30 ? '...' : ''}
                </SelectItem>
              ))}
              {products.length === 0 && !loading && (
                <SelectItem value="no-products" disabled>No products available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            {sections.length} section{sections.length !== 1 ? 's' : ''}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
            title="Refresh Preview"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-muted/30 overflow-auto p-4 flex items-start justify-center">
        <div
          className="bg-white shadow-lg transition-all duration-300 origin-top"
          style={{
            width: deviceSizes[device].width,
            height: device === 'desktop' ? '100%' : deviceSizes[device].height,
            maxWidth: '100%',
          }}
        >
          <iframe
            ref={iframeRef}
            src="/preview/template"
            className="w-full h-full border-0"
            title="Template Preview"
          />
        </div>
      </div>

      {/* Loading Indicator */}
      {!isReady && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      )}
    </div>
  );
}
