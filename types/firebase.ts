import { Timestamp } from 'firebase/firestore';

// Firestore Collection Names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  TEMPLATES: 'templates',
} as const;

// Product Template Type
export interface ProductTemplate {
  productId: string;
  shopifyId: string;
  templateId: string;
  customFields?: Record<string, any>;
  updatedAt: Timestamp;
}

// Template Type
export interface Template {
  templateId: string;
  name: string;
  component: string;
  description?: string;
  previewImage?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Input types for creating/updating
export interface CreateTemplateInput {
  name: string;
  component: string;
  description?: string;
  previewImage?: string;
}

export interface UpdateTemplateInput {
  name?: string;
  component?: string;
  description?: string;
  previewImage?: string;
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

