// Section system types for template builder

export type SectionSettingType = 'text' | 'number' | 'color' | 'toggle' | 'select' | 'textarea' | 'range';

export interface SectionSettingOption {
  value: string;
  label: string;
}

export interface SectionSettingSchema {
  key: string;
  label: string;
  type: SectionSettingType;
  default: any;
  options?: SectionSettingOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  description?: string;
}

export interface Section {
  id: string;                    // Unique instance ID (e.g., 'section-1234567890')
  type: string;                  // Section type: 'reviews', 'hero', 'gallery', etc.
  order: number;                 // Position in template
  enabled: boolean;              // Visibility toggle
  settings: Record<string, any>; // Section-specific settings
}

export interface SectionPreset {
  id: string;
  name: string;
  description?: string;
  sectionType: string;
  presetType: 'style' | 'config';
  settings: Record<string, any>;
  thumbnail?: string;
  isBuiltIn: boolean;
  createdAt?: Date;
}

export interface SectionDefinition {
  type: string;                  // Unique type identifier (e.g., 'reviews')
  name: string;                  // Display name (e.g., 'Customer Reviews')
  description: string;           // Brief description for admin
  icon: string;                  // Lucide icon name
  category?: string;             // Category for grouping in library
  previewImage?: string;         // Preview thumbnail
  defaultSettings: Record<string, any>;
  settingsSchema: SectionSettingSchema[];
  builtInPresets?: SectionPreset[]; // Built-in presets for this section
}

export interface SectionOverride {
  enabled?: boolean;
  settings?: Record<string, any>;
}

export interface SectionOverrides {
  [sectionId: string]: SectionOverride;
}

// Helper type for rendering
export interface ResolvedSection extends Section {
  definition: SectionDefinition;
}

// Validation helpers
export function isValidSection(section: any): section is Section {
  return (
    typeof section === 'object' &&
    typeof section.id === 'string' &&
    typeof section.type === 'string' &&
    typeof section.order === 'number' &&
    typeof section.enabled === 'boolean' &&
    typeof section.settings === 'object'
  );
}

export function createDefaultSection(type: string, order: number, definition: SectionDefinition): Section {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    order,
    enabled: true,
    settings: { ...definition.defaultSettings },
  };
}

