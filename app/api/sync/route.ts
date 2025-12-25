import { NextRequest, NextResponse } from 'next/server';
import { fetchAllProductsRecursive, fetchProductByHandle } from '@/lib/shopify/products';
import { syncMultipleProducts } from '@/lib/firebase/sync';
import {
  formatErrorResponse,
  ValidationError,
  logError,
} from '@/lib/utils/errors';
import {
  syncRequestSchema,
  safeValidateData,
  formatZodErrors,
} from '@/lib/utils/validation';

// POST /api/sync - Trigger manual Shopify sync
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = safeValidateData(syncRequestSchema, body);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid sync request',
        formatZodErrors(validation.errors)
      );
    }

    const { productIds, defaultTemplateId, syncAll } = validation.data;

    let syncResult: { success: number; failed: number };

    if (syncAll) {
      // Sync all products from Shopify
      console.log('Starting full sync of all products...');
      const allProducts = await fetchAllProductsRecursive();
      syncResult = await syncMultipleProducts(allProducts, defaultTemplateId);
      console.log(`Full sync completed: ${syncResult.success} success, ${syncResult.failed} failed`);
    } else if (productIds && productIds.length > 0) {
      // Sync specific products
      console.log(`Starting sync of ${productIds.length} products...`);
      const products = [];
      
      for (const productId of productIds) {
        const product = await fetchProductByHandle(productId);
        if (product) {
          products.push(product);
        }
      }

      syncResult = await syncMultipleProducts(products, defaultTemplateId);
      console.log(`Sync completed: ${syncResult.success} success, ${syncResult.failed} failed`);
    } else {
      throw new ValidationError('Either syncAll or productIds must be provided');
    }

    return NextResponse.json(
      {
        message: 'Sync completed',
        result: syncResult,
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'POST /api/sync');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// GET /api/sync - Get sync status
export async function GET() {
  try {
    // In a production app, you'd track sync jobs in a database
    // For now, just return a basic status
    return NextResponse.json(
      {
        message: 'Sync endpoint is available',
        lastSync: null,
        status: 'ready',
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'GET /api/sync');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

