import { NextRequest, NextResponse } from 'next/server';
import {
  updateTemplateSections,
  addTemplateSection,
  removeTemplateSection,
  updateTemplateSection,
} from '@/lib/firebase/templates';
import type { Section } from '@/types/sections';
import {
  formatErrorResponse,
  ValidationError,
} from '@/lib/utils/errors';

/**
 * PUT /api/templates/[id]/sections
 * Update all sections for a template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const body = await request.json();
    const { sections } = body;

    if (!Array.isArray(sections)) {
      throw new ValidationError('Sections must be an array');
    }

    await updateTemplateSections(templateId, sections);

    return NextResponse.json({
      success: true,
      message: 'Template sections updated successfully',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(formatErrorResponse(error), { status: 400 });
    }
    console.error('Error updating template sections:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to update template sections')),
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates/[id]/sections
 * Add a new section to a template
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const body = await request.json();
    const section: Section = body.section;

    if (!section || !section.id || !section.type) {
      throw new ValidationError('Invalid section data');
    }

    await addTemplateSection(templateId, section);

    return NextResponse.json({
      success: true,
      message: 'Section added successfully',
      section,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(formatErrorResponse(error), { status: 400 });
    }
    console.error('Error adding section:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to add section')),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/[id]/sections/[sectionId]
 * Remove a section from a template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');

    if (!sectionId) {
      throw new ValidationError('Section ID is required');
    }

    await removeTemplateSection(templateId, sectionId);

    return NextResponse.json({
      success: true,
      message: 'Section removed successfully',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(formatErrorResponse(error), { status: 400 });
    }
    console.error('Error removing section:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to remove section')),
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/templates/[id]/sections/[sectionId]
 * Update a specific section
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const body = await request.json();
    const { sectionId, updates } = body;

    if (!sectionId) {
      throw new ValidationError('Section ID is required');
    }

    await updateTemplateSection(templateId, sectionId, updates);

    return NextResponse.json({
      success: true,
      message: 'Section updated successfully',
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(formatErrorResponse(error), { status: 400 });
    }
    console.error('Error updating section:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to update section')),
      { status: 500 }
    );
  }
}

