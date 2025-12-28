import type { SectionDefinition } from '@/types/sections';
import { reviewsSectionDefinition } from './definitions/reviews';
import { heroSectionDefinition } from './definitions/hero';
import { gallerySectionDefinition } from './definitions/gallery';
import { specsSectionDefinition } from './definitions/specs';
import { relatedProductsSectionDefinition } from './definitions/relatedProducts';

// Central registry of all available sections
export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  reviews: reviewsSectionDefinition,
  hero: heroSectionDefinition,
  gallery: gallerySectionDefinition,
  specs: specsSectionDefinition,
  relatedProducts: relatedProductsSectionDefinition,
};

/**
 * Get a specific section definition by type
 */
export function getSectionDefinition(type: string): SectionDefinition | null {
  return SECTION_REGISTRY[type] || null;
}

/**
 * Get all available section types
 */
export function getAllSectionDefinitions(): SectionDefinition[] {
  return Object.values(SECTION_REGISTRY);
}

/**
 * Get sections grouped by category
 */
export function getSectionsByCategory(): Record<string, SectionDefinition[]> {
  const sections = getAllSectionDefinitions();
  const grouped: Record<string, SectionDefinition[]> = {};
  
  sections.forEach((section) => {
    const category = section.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(section);
  });
  
  return grouped;
}

/**
 * Check if a section type exists
 */
export function isSectionTypeValid(type: string): boolean {
  return type in SECTION_REGISTRY;
}

/**
 * Get default settings for a section type
 */
export function getDefaultSettings(type: string): Record<string, any> {
  const definition = getSectionDefinition(type);
  return definition ? { ...definition.defaultSettings } : {};
}

