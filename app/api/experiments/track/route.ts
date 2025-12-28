import { NextRequest, NextResponse } from 'next/server';
import { trackConversion } from '@/lib/experiments/tracking';
import { formatErrorResponse, ValidationError } from '@/lib/utils/errors';

// POST /api/experiments/track - Track conversion event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, experimentId, variantId, eventType, metadata } = body;

    if (!sessionId || !experimentId || !variantId || !eventType) {
      throw new ValidationError('Missing required fields');
    }

    await trackConversion(sessionId, experimentId, variantId, eventType, metadata);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(formatErrorResponse(error), { status: 400 });
    }
    console.error('Error tracking conversion:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to track conversion')),
      { status: 500 }
    );
  }
}

