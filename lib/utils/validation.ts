import { z } from 'zod';

// Template validation schemas
export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().optional(),
  previewImage: z.string().optional(), // Made optional without URL validation for empty strings
  sections: z.array(z.any()).optional(), // Array of sections
});

export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  previewImage: z.string().optional(),
  sections: z.array(z.any()).optional(),
});

// Product template assignment schemas
export const setProductTemplateSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  shopifyId: z.string().min(1, 'Shopify ID is required'),
  templateId: z.string().min(1, 'Template ID is required'),
  customFields: z.record(z.any()).optional(),
});

// Sync request schema
export const syncRequestSchema = z.object({
  productIds: z.array(z.string()).optional(),
  defaultTemplateId: z.string().optional(),
  syncAll: z.boolean().optional(),
});

// Generic validation helper
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

// Safe validation that returns errors instead of throwing
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

// Format Zod errors for API responses
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  error.errors.forEach(err => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });
  
  return formatted;
}

