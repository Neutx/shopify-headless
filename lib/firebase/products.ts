import { Timestamp } from 'firebase/firestore';
import { COLLECTIONS, ProductTemplate, SetProductTemplateInput } from '@/types/firebase';
import {
  getDocument,
  getAllDocuments,
  setDocument,
  queryDocuments,
} from './firestore';

/**
 * Get product template assignment by product ID
 */
export async function getProductTemplate(productId: string): Promise<ProductTemplate | null> {
  try {
    return await getDocument<ProductTemplate>(COLLECTIONS.PRODUCTS, productId);
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
    const productTemplate: Omit<ProductTemplate, 'updatedAt'> = {
      productId,
      shopifyId,
      templateId,
      customFields: customFields || {},
    };

    await setDocument(COLLECTIONS.PRODUCTS, productId, {
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
    await deleteDocument(COLLECTIONS.PRODUCTS, productId);
  } catch (error) {
    console.error('Error removing product template:', error);
    throw error;
  }
}

