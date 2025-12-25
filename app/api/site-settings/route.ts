import { NextRequest, NextResponse } from 'next/server';
import {
  getSiteSettings,
  updateColors,
  updateSiteInfo,
} from '@/lib/firebase/site-settings';
import { formatErrorResponse, logError } from '@/lib/utils/errors';
import type { UpdateColorsInput } from '@/types/site-settings';

// GET /api/site-settings - Get site settings
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/site-settings');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// PUT /api/site-settings - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { colors, siteName, siteDescription } = body;

    // Update colors if provided
    if (colors) {
      await updateColors(colors as UpdateColorsInput);
    }

    // Update site info if provided
    if (siteName !== undefined || siteDescription !== undefined) {
      await updateSiteInfo(siteName, siteDescription);
    }

    // Return updated settings
    const settings = await getSiteSettings();

    return NextResponse.json(
      { message: 'Site settings updated successfully', settings },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'PUT /api/site-settings');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

