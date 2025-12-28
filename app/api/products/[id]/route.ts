import { NextRequest, NextResponse } from 'next/server';
import { fetchProductByHandle } from '@/lib/shopify/products';
import { getProductTemplate, setProductTemplate } from '@/lib/firebase/products';
import { getTemplate } from '@/lib/firebase/templates';
import { formatErrorResponse, NotFoundError, logError } from '@/lib/utils/errors';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

// PUT /api/products/[id] - Assign template to product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // This is the handle
    const body = await request.json();
    const { templateId, shopifyId } = body;
    
    if (!templateId || !shopifyId) {
      return NextResponse.json(
        { error: { message: 'templateId and shopifyId are required' } },
        { status: 400 }
      );
    }
    
    // Set product template assignment
    await setProductTemplate(id, templateId, shopifyId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Template assigned successfully' 
    }, { status: 200 });
  } catch (error) {
    logError(error, 'PUT /api/products/[id]');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
