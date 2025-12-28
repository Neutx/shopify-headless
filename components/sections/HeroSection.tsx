'use client';

import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { Button } from '@/components/ui/button';
import type { Section } from '@/types/sections';
import { useProduct } from '@/hooks/useProduct';

interface HeroSectionProps {
  section: Section;
  productId?: string;
}

export default function HeroSection({ section, productId }: HeroSectionProps) {
  const { data: product } = useProduct(productId || '');
  const settings = section.settings;

  const heightClasses = {
    small: 'min-h-[400px]',
    medium: 'min-h-[600px]',
    large: 'min-h-[800px]',
  };

  const height = heightClasses[settings.height as keyof typeof heightClasses] || heightClasses.large;

  const heroImage = settings.useProductImage && product?.images?.[0]
    ? product.images[0].url
    : 'https://placehold.co/1200x800/e5e7eb/6b7280?text=Hero+Image';

  if (settings.imagePosition === 'background') {
    return (
      <section
        className={`relative ${height} flex items-center justify-center overflow-hidden`}
        style={{ backgroundColor: settings.backgroundColor }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={heroImage}
            alt={settings.headline}
            fill
            className="object-cover"
            priority
          />
          {settings.overlayOpacity > 0 && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: settings.overlayOpacity }}
            />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ color: settings.textColor }}
          >
            {settings.headline}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            style={{ color: settings.textColor }}
          >
            {settings.subheading}
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href={settings.ctaLink}>{settings.ctaText}</Link>
          </Button>
        </div>
      </section>
    );
  }

  // Side-by-side layout
  const isImageLeft = settings.imagePosition === 'left';

  return (
    <section
      className={`${height} flex items-center`}
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div className="container mx-auto px-4">
        <div
          className={`grid md:grid-cols-2 gap-12 items-center ${
            isImageLeft ? 'md:flex-row-reverse' : ''
          }`}
        >
          {/* Text Content */}
          <div className={isImageLeft ? 'md:order-2' : ''}>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: settings.textColor }}
            >
              {settings.headline}
            </h1>
            <p
              className="text-lg md:text-xl mb-8"
              style={{ color: settings.textColor }}
            >
              {settings.subheading}
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href={settings.ctaLink}>{settings.ctaText}</Link>
            </Button>
          </div>

          {/* Image */}
          <div className={`relative h-full min-h-[400px] ${isImageLeft ? 'md:order-1' : ''}`}>
            <SafeImage
              src={heroImage}
              alt={settings.headline}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

