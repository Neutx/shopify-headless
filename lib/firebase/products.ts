import { Timestamp } from 'firebase/firestore';
import { COLLECTIONS, ProductTemplate } from '@/types/firebase';
import type { SectionOverrides } from '@/types/sections';
import {
  getDocument,
  getAllDocuments,
  setDocument,
  queryDocuments,
  updateDocument,
} from './firestore';
import { sanitizeShopifyId } from '@/lib/utils/shopify-id';

/**
 * Get product template assignment by product ID
 */
export async function getProductTemplate(productId: string): Promise<ProductTemplate | null> {
  try {
    // Sanitize the product ID to remove // which Firestore doesn't allow
    const sanitizedId = sanitizeShopifyId(productId);
    return await getDocument<ProductTemplate>(COLLECTIONS.PRODUCTS, sanitizedId);
  } catch (error) {
    console.error('Error fetching product template:', error);
    return null;
  }
}

/**
 * Set or update product template assignment
 */
export async function setProductTemplate(
  productId: string,
  templateId: string,
  shopifyId: string,
  customFields?: Record<string, any>
): Promise<void> {
  try {
    // Sanitize the product ID for Firestore
    const sanitizedId = sanitizeShopifyId(productId);
    const productTemplate: Omit<ProductTemplate, 'updatedAt'> = {
      productId,
      shopifyId,
      templateId,
      customFields: customFields || {},
    };

    await setDocument(COLLECTIONS.PRODUCTS, sanitizedId, {
      ...productTemplate,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error setting product template:', error);
    throw error;
  }
}

/**
 * Get all product template assignments
 */
export async function getAllProductTemplates(): Promise<ProductTemplate[]> {
  try {
    return await getAllDocuments<ProductTemplate>(COLLECTIONS.PRODUCTS);
  } catch (error) {
    console.error('Error fetching all product templates:', error);
    return [];
  }
}

/**
 * Get products by template ID
 */
export async function getProductsByTemplate(templateId: string): Promise<ProductTemplate[]> {
  try {
    return await queryDocuments<ProductTemplate>(
      COLLECTIONS.PRODUCTS,
      'templateId',
      '==',
      templateId
    );
  } catch (error) {
    console.error('Error fetching products by template:', error);
    return [];
  }
}

/**
 * Remove product template assignment
 */
export async function removeProductTemplate(productId: string): Promise<void> {
  try {
    const { deleteDocument } = await import('./firestore');
    const sanitizedId = sanitizeShopifyId(productId);
    await deleteDocument(COLLECTIONS.PRODUCTS, sanitizedId);
  } catch (error) {
    console.error('Error removing product template:', error);
    throw error;
  }
}

/**
 * Set or update product section overrides
 */
export async function setProductSectionOverrides(
  productId: string,
  overrides: SectionOverrides
): Promise<void> {
  try {
    const sanitizedId = sanitizeShopifyId(productId);
    await updateDocument(COLLECTIONS.PRODUCTS, sanitizedId, {
      sectionOverrides: overrides,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error setting product section overrides:', error);
    throw error;
  }
}

/**
 * Get product with template and overrides
 */
export async function getProductWithOverrides(productId: string): Promise<ProductTemplate | null> {
  try {
    const sanitizedId = sanitizeShopifyId(productId);
    return await getDocument<ProductTemplate>(COLLECTIONS.PRODUCTS, sanitizedId);
  } catch (error) {
    console.error('Error getting product with overrides:', error);
    return null;
  }
}

