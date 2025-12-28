'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';
import { Button } from '@/components/ui/button';
import type { Section } from '@/types/sections';
import { useProduct } from '@/hooks/useProduct';

interface GallerySectionProps {
  section: Section;
  productId?: string;
}

export default function GallerySection({ section, productId }: GallerySectionProps) {
  const { data: product } = useProduct(productId || '');
  const settings = section.settings;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get images based on source
  const images = settings.imageSource === 'product' && product?.images
    ? product.images
    : [
        { url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Image+1', altText: 'Gallery Image 1' },
        { url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Image+2', altText: 'Gallery Image 2' },
        { url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Image+3', altText: 'Gallery Image 3' },
        { url: 'https://placehold.co/600x600/e5e7eb/6b7280?text=Image+4', altText: 'Gallery Image 4' },
      ];

  const openLightbox = (index: number) => {
    if (settings.enableLightbox) {
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:4': 'aspect-[3/4]',
    'auto': 'aspect-auto',
  };

  const aspectRatio = aspectRatioClasses[settings.aspectRatio as keyof typeof aspectRatioClasses] || 'aspect-square';

  return (
    <>
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {settings.showTitle && (
            <h2 className="text-3xl font-bold mb-8 text-center">{settings.title}</h2>
          )}

          {settings.layout === 'grid' && (
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${settings.columns}, minmax(0, 1fr))`,
                gap: `${settings.gap}px`,
              }}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className={`relative ${aspectRatio} overflow-hidden rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}
                >
                  <SafeImage
                    src={image.url}
                    alt={image.altText || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {settings.layout === 'masonry' && (
            <div
              className="columns-2 md:columns-3 lg:columns-4"
              style={{ gap: `${settings.gap}px` }}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative mb-4 break-inside-avoid overflow-hidden rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.altText || `Gallery image ${index + 1}`}
                    className="w-full h-auto"
                  />
                </button>
              ))}
            </div>
          )}

          {settings.layout === 'carousel' && (
            <div className="relative">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => openLightbox(index)}
                    className={`relative flex-shrink-0 ${aspectRatio} overflow-hidden rounded-lg hover:opacity-90 transition-opacity cursor-pointer`}
                    style={{ width: `calc((100% - ${settings.gap * 2}px) / 3)` }}
                  >
                    <SafeImage
                      src={image.url}
                      alt={image.altText || `Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && settings.enableLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:bg-white/20 rounded-full p-4"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            ‹
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:bg-white/20 rounded-full p-4"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            ›
          </button>

          <div
            className="relative max-w-5xl max-h-[80vh] w-full h-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].altText || `Image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}

