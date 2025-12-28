import type { Section, SectionDefinition, SectionOverrides } from '@/types/sections';
import { getSectionDefinition } from './registry';

/**
 * Merge section overrides into a section
 */
export function mergeSectionOverrides(
  section: Section,
  overrides?: SectionOverrides
): Section {
  if (!overrides || !overrides[section.id]) {
    return section;
  }

  const override = overrides[section.id];
  
  return {
    ...section,
    enabled: override.enabled !== undefined ? override.enabled : section.enabled,
    settings: override.settings
      ? { ...section.settings, ...override.settings }
      : section.settings,
  };
}

/**
 * Merge all section overrides into sections array
 */
export function mergeAllSectionOverrides(
  sections: Section[],
  overrides?: SectionOverrides
): Section[] {
  if (!overrides) {
    return sections;
  }

  return sections.map((section) => mergeSectionOverrides(section, overrides));
}

/**
 * Validate section structure
 */
export function validateSection(section: any): section is Section {
  return (
    typeof section === 'object' &&
    typeof section.id === 'string' &&
    typeof section.type === 'string' &&
    typeof section.order === 'number' &&
    typeof section.enabled === 'boolean' &&
    typeof section.settings === 'object'
  );
}

/**
 * Validate that a section's settings match its schema
 */
export function validateSectionSettings(
  section: Section,
  definition: SectionDefinition
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  definition.settingsSchema.forEach((schema) => {
    const value = section.settings[schema.key];
    
    // Check if required field is missing
    if (value === undefined && schema.default === undefined) {
      errors.push(`Missing required setting: ${schema.key}`);
      return;
    }
    
    // Type validation
    if (value !== undefined) {
      const valueType = typeof value;
      
      switch (schema.type) {
        case 'number':
        case 'range':
          if (valueType !== 'number') {
            errors.push(`${schema.key} must be a number`);
          }
          if (schema.min !== undefined && value < schema.min) {
            errors.push(`${schema.key} must be at least ${schema.min}`);
          }
          if (schema.max !== undefined && value > schema.max) {
            errors.push(`${schema.key} must be at most ${schema.max}`);
          }
          break;
          
        case 'toggle':
          if (valueType !== 'boolean') {
            errors.push(`${schema.key} must be a boolean`);
          }
          break;
          
        case 'text':
        case 'textarea':
        case 'color':
          if (valueType !== 'string') {
            errors.push(`${schema.key} must be a string`);
          }
          break;
          
        case 'select':
          if (schema.options && !schema.options.some((opt) => opt.value === value)) {
            errors.push(`${schema.key} has invalid value`);
          }
          break;
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get resolved settings for a section (with defaults filled in)
 */
export function getResolvedSettings(
  section: Section,
  definition: SectionDefinition
): Record<string, any> {
  const resolved = { ...definition.defaultSettings };
  
  // Override with section-specific settings
  Object.keys(section.settings).forEach((key) => {
    if (section.settings[key] !== undefined) {
      resolved[key] = section.settings[key];
    }
  });
  
  return resolved;
}

/**
 * Create a new section instance from a definition
 */
export function createSectionFromDefinition(
  type: string,
  order: number
): Section | null {
  const definition = getSectionDefinition(type);
  
  if (!definition) {
    return null;
  }
  
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    order,
    enabled: true,
    settings: { ...definition.defaultSettings },
  };
}

/**
 * Reorder sections array
 */
export function reorderSections(
  sections: Section[],
  fromIndex: number,
  toIndex: number
): Section[] {
  const result = Array.from(sections);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  
  // Update order property
  return result.map((section, index) => ({
    ...section,
    order: index,
  }));
}

