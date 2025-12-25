import { NextRequest, NextResponse } from 'next/server';
import { fetchCollectionByHandle } from '@/lib/shopify/collections';
import { formatErrorResponse, NotFoundError, logError } from '@/lib/utils/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    const { searchParams } = new URL(request.url);
    const productLimit = parseInt(searchParams.get('limit') || '50', 10);

    // Fetch collection from Shopify
    const collection = await fetchCollectionByHandle(handle, productLimit);

    if (!collection) {
      throw new NotFoundError('Collection');
    }

    return NextResponse.json({ collection }, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/collections/[handle]');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

