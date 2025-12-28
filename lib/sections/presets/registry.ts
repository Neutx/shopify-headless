import type { SectionPreset } from '@/types/sections';
import type { Section } from '@/types/sections';
import { HERO_STYLE_PRESETS, HERO_CONFIG_PRESETS } from './heroPresets';

// Central registry of all presets
const PRESET_REGISTRY: Record<string, SectionPreset[]> = {
  hero: [...HERO_STYLE_PRESETS, ...HERO_CONFIG_PRESETS],
  // Add more section presets here as they're created
};

/**
 * Get all presets for a specific section type
 */
export function getPresetsForSection(sectionType: string): SectionPreset[] {
  return PRESET_REGISTRY[sectionType] || [];
}

/**
 * Get style presets for a section type
 */
export function getStylePresets(sectionType: string): SectionPreset[] {
  return getPresetsForSection(sectionType).filter(p => p.presetType === 'style');
}

/**
 * Get config presets for a section type
 */
export function getConfigPresets(sectionType: string): SectionPreset[] {
  return getPresetsForSection(sectionType).filter(p => p.presetType === 'config');
}

/**
 * Apply a preset to a section
 */
export function applyPreset(section: Section, preset: SectionPreset): Section {
  return {
    ...section,
    settings: {
      ...section.settings,
      ...preset.settings,
    },
  };
}

/**
 * Get a specific preset by ID
 */
export function getPresetById(presetId: string): SectionPreset | null {
  for (const presets of Object.values(PRESET_REGISTRY)) {
    const preset = presets.find(p => p.id === presetId);
    if (preset) return preset;
  }
  return null;
}

