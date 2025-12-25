import { NextRequest, NextResponse } from 'next/server';
import {
  getTemplate,
  updateTemplate,
  deleteTemplate,
} from '@/lib/firebase/templates';
import {
  formatErrorResponse,
  NotFoundError,
  ValidationError,
  logError,
} from '@/lib/utils/errors';
import {
  updateTemplateSchema,
  safeValidateData,
  formatZodErrors,
} from '@/lib/utils/validation';

// GET /api/templates/[id] - Get a single template
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await getTemplate(id);

    if (!template) {
      throw new NotFoundError('Template');
    }

    return NextResponse.json({ template }, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/templates/[id]');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// PUT /api/templates/[id] - Update a template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if template exists
    const existingTemplate = await getTemplate(id);
    if (!existingTemplate) {
      throw new NotFoundError('Template');
    }

    // Validate request body
    const validation = safeValidateData(updateTemplateSchema, body);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid template data',
        formatZodErrors(validation.errors)
      );
    }

    // Update template
    await updateTemplate(id, validation.data);

    // Fetch updated template
    const updatedTemplate = await getTemplate(id);

    return NextResponse.json({ template: updatedTemplate }, { status: 200 });
  } catch (error) {
    logError(error, 'PUT /api/templates/[id]');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if template exists
    const existingTemplate = await getTemplate(id);
    if (!existingTemplate) {
      throw new NotFoundError('Template');
    }

    // Delete template
    await deleteTemplate(id);

    return NextResponse.json(
      { message: 'Template deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    logError(error, 'DELETE /api/templates/[id]');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

