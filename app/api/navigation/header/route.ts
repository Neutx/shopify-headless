import { NextRequest, NextResponse } from 'next/server';
import {
  getHeaderNavigation,
  updateHeaderNavigation,
} from '@/lib/firebase/navigation';
import { formatErrorResponse, logError } from '@/lib/utils/errors';
import type { NavigationItem } from '@/types/navigation';

// GET /api/navigation/header - Get header navigation
export async function GET() {
  try {
    const navigation = await getHeaderNavigation();
    return NextResponse.json({ navigation }, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/navigation/header');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// PUT /api/navigation/header - Update header navigation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items: NavigationItem[] };

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: { message: 'Invalid items array', statusCode: 400 } },
        { status: 400 }
      );
    }

    await updateHeaderNavigation(items);

    return NextResponse.json(
      { message: 'Header navigation updated successfully', items },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'PUT /api/navigation/header');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

