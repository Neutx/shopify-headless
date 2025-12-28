import { Timestamp } from 'firebase/firestore';
import type { Section, SectionOverrides } from './sections';

// Firestore Collection Names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  TEMPLATES: 'templates',
  EXPERIMENTS: 'experiments',
  EXPERIMENT_SESSIONS: 'experiment_sessions',
  CONVERSION_EVENTS: 'conversion_events',
} as const;

// Product Template Type (assignment of template to product)
export interface ProductTemplate {
  productId: string;
  shopifyId: string;
  templateId: string;
  sectionOverrides?: SectionOverrides; // Per-product section customization
  customFields?: Record<string, any>;
  updatedAt: Timestamp;
}

// Template Type (reusable template with sections)
export interface Template {
  templateId: string;
  name: string;
  description?: string;
  previewImage?: string;
  sections: Section[];           // Array of section instances
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  // Legacy field for backward compatibility
  component?: string;
}

// Input types for creating/updating
export interface CreateTemplateInput {
  name: string;
  description?: string;
  previewImage?: string;
  sections?: Section[];
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  previewImage?: string;
  sections?: Section[];
}

export interface SetProductTemplateInput {
  productId: string;
  shopifyId: string;
  templateId: string;
  customFields?: Record<string, any>;
}

// Response types for API
export interface ProductWithTemplate {
  product: any; // Will be ShopifyProduct
  template?: Template;
  customFields?: Record<string, any>;
}

