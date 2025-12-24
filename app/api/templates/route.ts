import { NextRequest, NextResponse } from 'next/server';
import {
  getAllTemplates,
  createTemplate,
} from '@/lib/firebase/templates';
import {
  formatErrorResponse,
  ValidationError,
  logError,
} from '@/lib/utils/errors';
import {
  createTemplateSchema,
  safeValidateData,
  formatZodErrors,
} from '@/lib/utils/validation';

// GET /api/templates - Get all templates
export async function GET() {
  try {
    const templates = await getAllTemplates();
    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    logError(error, 'GET /api/templates');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = safeValidateData(createTemplateSchema, body);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid template data',
        formatZodErrors(validation.errors)
      );
    }

    const { name, component, description, previewImage } = validation.data;

    // Generate template ID from component name
    const templateId = component.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Create template
    const template = await createTemplate(templateId, {
      name,
      component,
      description,
      previewImage,
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    logError(error, 'POST /api/templates');
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

