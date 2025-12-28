import { NextRequest, NextResponse } from 'next/server';
import {
  getProductWithOverrides,
  setProductSectionOverrides,
} from '@/lib/firebase/products';
import type { SectionOverrides } from '@/types/sections';
import {
  formatErrorResponse,
  ValidationError,
} from '@/lib/utils/errors';

/**
 * GET /api/products/[id]/sections
 * Get product section overrides
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const productTemplate = await getProductWithOverrides(productId);

    if (!productTemplate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product template not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      overrides: productTemplate.sectionOverrides || {},
    });
  } catch (error) {
    console.error('Error fetching product section overrides:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to fetch section overrides')),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]/sections
 * Set product section overrides
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body = await request.json();
    const overrides: SectionOverrides = body.overrides;

    if (!overrides || typeof overrides !== 'object') {
      throw new ValidationError('Invalid overrides data');
    }

    await setProductSectionOverrides(productId, overrides);

    return NextResponse.json({
      success: true,
      message: 'Section overrides updated successfully',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(formatErrorResponse(error), { status: 400 });
    }
    console.error('Error updating section overrides:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to update section overrides')),
      { status: 500 }
    );
  }
}

