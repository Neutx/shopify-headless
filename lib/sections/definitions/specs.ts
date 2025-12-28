import type { SectionDefinition } from '@/types/sections';

export const specsSectionDefinition: SectionDefinition = {
  type: 'specs',
  name: 'Product Specifications',
  description: 'Display product features and specifications in a table or list',
  icon: 'ListTree',
  category: 'Product Info',
  defaultSettings: {
    title: 'Specifications',
    layout: 'table',
    showIcons: true,
    columns: 2,
    specs: JSON.stringify([
      { label: 'Material', value: 'Premium Fabric', icon: 'Package' },
      { label: 'Dimensions', value: '100 x 200 cm', icon: 'Ruler' },
      { label: 'Weight', value: '2.5 kg', icon: 'Weight' },
      { label: 'Color Options', value: 'Black, White, Gray', icon: 'Palette' },
      { label: 'Warranty', value: '2 Years', icon: 'Shield' },
      { label: 'Country of Origin', value: 'Made in USA', icon: 'MapPin' },
    ]),
  },
  settingsSchema: [
    {
      key: 'title',
      label: 'Section Title',
      type: 'text',
      default: 'Specifications',
      placeholder: 'Enter section title',
      description: 'Title displayed above specifications',
    },
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      default: 'table',
      options: [
        { value: 'table', label: 'Table' },
        { value: 'list', label: 'List' },
        { value: 'cards', label: 'Cards' },
      ],
      description: 'Display style for specifications',
    },
    {
      key: 'showIcons',
      label: 'Show Icons',
      type: 'toggle',
      default: true,
      description: 'Display icons next to specification labels',
    },
    {
      key: 'columns',
      label: 'Columns (Cards only)',
      type: 'range',
      default: 2,
      min: 1,
      max: 4,
      step: 1,
      description: 'Number of columns for card layout',
    },
    {
      key: 'specs',
      label: 'Specifications (JSON)',
      type: 'textarea',
      default: JSON.stringify([
        { label: 'Material', value: 'Premium Fabric', icon: 'Package' },
        { label: 'Dimensions', value: '100 x 200 cm', icon: 'Ruler' },
      ], null, 2),
      placeholder: 'Enter specs as JSON array',
      description: 'JSON array of specifications with label, value, and icon (Lucide icon name)',
    },
  ],
};

