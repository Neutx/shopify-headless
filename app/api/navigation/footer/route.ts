import { NextRequest, NextResponse } from 'next/server';
import {
  getFooterNavigation,
  updateFooterNavigation,
} from '@/lib/firebase/navigation';
import { formatErrorResponse, logError } from '@/lib/utils/errors';
import type { FooterNavigation } from '@/types/navigation';

// GET /api/navigation/footer - Get footer navigation
export async function GET() {
  try {
    const navigation = await getFooterNavigation();
    return NextResponse.json({ navigation }, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/navigation/footer');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// PUT /api/navigation/footer - Update footer navigation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const footer = body as Omit<FooterNavigation, 'updatedAt'>;

    if (!footer.sections || !Array.isArray(footer.sections)) {
      return NextResponse.json(
        { error: { message: 'Invalid footer data', statusCode: 400 } },
        { status: 400 }
      );
    }

    await updateFooterNavigation(footer);

    return NextResponse.json(
      { message: 'Footer navigation updated successfully', footer },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'PUT /api/navigation/footer');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

