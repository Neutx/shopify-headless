import type { SectionPreset } from '@/types/sections';

export const HERO_STYLE_PRESETS: SectionPreset[] = [
  {
    id: 'hero-modern',
    name: 'Modern',
    description: 'Clean, minimal design with bold typography',
    sectionType: 'hero',
    presetType: 'style',
    settings: {
      backgroundColor: '#ffffff',
      textColor: '#111827',
      height: 'large',
      imagePosition: 'right',
      overlayOpacity: 0,
    },
    isBuiltIn: true,
  },
  {
    id: 'hero-bold',
    name: 'Bold',
    description: 'High contrast with vibrant colors',
    sectionType: 'hero',
    presetType: 'style',
    settings: {
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      height: 'large',
      overlayOpacity: 0.7,
      imagePosition: 'background',
    },
    isBuiltIn: true,
  },
  {
    id: 'hero-minimal',
    name: 'Minimal',
    description: 'Simple and elegant',
    sectionType: 'hero',
    presetType: 'style',
    settings: {
      backgroundColor: '#f9fafb',
      textColor: '#374151',
      height: 'medium',
      imagePosition: 'right',
      overlayOpacity: 0,
    },
    isBuiltIn: true,
  },
];

export const HERO_CONFIG_PRESETS: SectionPreset[] = [
  {
    id: 'hero-left-aligned',
    name: 'Left Aligned',
    sectionType: 'hero',
    presetType: 'config',
    settings: {
      imagePosition: 'right',
      height: 'medium',
      ctaText: 'Shop Now',
    },
    isBuiltIn: true,
  },
  {
    id: 'hero-centered',
    name: 'Centered',
    sectionType: 'hero',
    presetType: 'config',
    settings: {
      imagePosition: 'background',
      height: 'large',
      ctaText: 'Explore Collection',
    },
    isBuiltIn: true,
  },
];

