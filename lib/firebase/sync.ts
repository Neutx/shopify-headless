import { setProductTemplate, getProductTemplate } from './products';
import { CleanProduct } from '@/types/shopify';

/**
 * Sync a product from Shopify to Firebase
 * This creates or updates the product template assignment in Firebase
 */
export async function syncProductFromShopify(
  shopifyProduct: CleanProduct,
  templateId?: string
): Promise<void> {
  try {
    const productId = shopifyProduct.handle; // Using handle as the product ID
    const existingTemplate = await getProductTemplate(productId);

    // If no template is specified and product doesn't exist, skip
    if (!templateId && !existingTemplate) {
      console.log(`Product ${productId} has no template assignment, skipping sync`);
      return;
    }

    // Use existing template or the new one
    const finalTemplateId = templateId || existingTemplate?.templateId;

    if (!finalTemplateId) {
      console.log(`No template ID available for product ${productId}`);
      return;
    }

    // Set or update the product template
    await setProductTemplate(
      productId,
      finalTemplateId,
      shopifyProduct.id,
      existingTemplate?.customFields
    );

    console.log(`Successfully synced product ${productId} with template ${finalTemplateId}`);
  } catch (error) {
    console.error('Error syncing product from Shopify:', error);
    throw error;
  }
}

/**
 * Sync multiple products from Shopify
 */
export async function syncMultipleProducts(
  products: CleanProduct[],
  defaultTemplateId?: string
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const product of products) {
    try {
      await syncProductFromShopify(product, defaultTemplateId);
      success++;
    } catch (error) {
      console.error(`Failed to sync product ${product.handle}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Get sync status for a product
 */
export async function getSyncStatus(productId: string): Promise<{
  isSynced: boolean;
  lastSyncedAt?: Date;
}> {
  try {
    const template = await getProductTemplate(productId);
    
    if (!template) {
      return { isSynced: false };
    }

    return {
      isSynced: true,
      lastSyncedAt: template.updatedAt?.toDate(),
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return { isSynced: false };
  }
}

