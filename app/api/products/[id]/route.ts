import { NextRequest, NextResponse } from 'next/server';
import { fetchProductByHandle } from '@/lib/shopify/products';
import { getProductTemplate } from '@/lib/firebase/products';
import { getTemplate } from '@/lib/firebase/templates';
import { formatErrorResponse, NotFoundError, logError } from '@/lib/utils/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch product from Shopify
    const product = await fetchProductByHandle(id);

    if (!product) {
      throw new NotFoundError('Product');
    }

    // Fetch template assignment from Firebase
    const productTemplate = await getProductTemplate(id);

    // If there's a template assigned, fetch template details
    let template = null;
    if (productTemplate) {
      template = await getTemplate(productTemplate.templateId);
    }

    // Combine product data with template info
    const response = {
      product,
      template: template || undefined,
      customFields: productTemplate?.customFields || undefined,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/products/[id]');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

