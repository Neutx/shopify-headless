import { NextRequest, NextResponse } from 'next/server';
import { uploadLogo, validateLogoFile } from '@/lib/firebase/storage';
import { updateLogo } from '@/lib/firebase/site-settings';
import { formatErrorResponse, logError } from '@/lib/utils/errors';

// POST /api/logo/upload - Upload logo file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('altText') as string;
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;

    if (!file) {
      return NextResponse.json(
        { error: { message: 'No file provided', statusCode: 400 } },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateLogoFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: { message: validation.error, statusCode: 400 } },
        { status: 400 }
      );
    }

    // Upload to Firebase Storage
    const fileUrl = await uploadLogo(file);

    // Update site settings with new logo
    await updateLogo({
      type: 'file',
      fileUrl,
      altText,
      width,
      height,
    });

    return NextResponse.json(
      {
        message: 'Logo uploaded successfully',
        logo: { type: 'file', fileUrl, altText, width, height },
      },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'POST /api/logo/upload');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

