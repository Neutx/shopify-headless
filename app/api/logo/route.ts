import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateLogo } from '@/lib/firebase/site-settings';
import { deleteLogo } from '@/lib/firebase/storage';
import { formatErrorResponse, logError } from '@/lib/utils/errors';

// GET /api/logo - Get current logo settings
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ logo: settings?.logo }, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/logo');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// PUT /api/logo - Update logo settings (CDN URL)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cdnUrl, altText, width, height } = body;

    if (!cdnUrl) {
      return NextResponse.json(
        { error: { message: 'CDN URL is required', statusCode: 400 } },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(cdnUrl);
    } catch {
      return NextResponse.json(
        { error: { message: 'Invalid CDN URL', statusCode: 400 } },
        { status: 400 }
      );
    }

    // Update logo with CDN URL
    await updateLogo({
      type: 'cdn',
      cdnUrl,
      altText,
      width,
      height,
    });

    return NextResponse.json(
      {
        message: 'Logo updated successfully',
        logo: { type: 'cdn', cdnUrl, altText, width, height },
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'PUT /api/logo');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// DELETE /api/logo - Remove logo
export async function DELETE() {
  try {
    const settings = await getSiteSettings();
    const currentLogo = settings?.logo;

    // If it's a file upload, delete from storage
    if (currentLogo?.type === 'file' && currentLogo.fileUrl) {
      await deleteLogo(currentLogo.fileUrl);
    }

    // Clear logo settings
    await updateLogo({
      type: 'file',
    });

    return NextResponse.json(
      { message: 'Logo removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'DELETE /api/logo');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

