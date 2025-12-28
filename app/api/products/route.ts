import { NextRequest, NextResponse } from 'next/server';
import { fetchAllProducts } from '@/lib/shopify/products';
import { getProductTemplate } from '@/lib/firebase/products';
import { formatErrorResponse, logError } from '@/lib/utils/errors';

// GET /api/products - List all products with template assignments
export async function GET(request: NextRequest) {
  try {
    // Parse query params for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const cursor = searchParams.get('cursor') || undefined;
    
    // Fetch products from Shopify
    const { products, hasNextPage, endCursor } = await fetchAllProducts(limit, cursor);
    
    // Fetch template assignments from Firebase for each product
    const productsWithTemplates = await Promise.all(
      products.map(async (product) => {
        const template = await getProductTemplate(product.handle);
        return {
          ...product,
          templateId: template?.templateId || null,
        };
      })
    );
    
    return NextResponse.json({
      products: productsWithTemplates,
      pagination: { hasNextPage, endCursor }
    }, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/products');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

