import { NextRequest, NextResponse } from 'next/server';
import { getDocument, updateDocument, deleteDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/types/firebase';
import type { Experiment } from '@/types/experiments';
import { Timestamp } from 'firebase/firestore';
import { formatErrorResponse } from '@/lib/utils/errors';

// GET /api/experiments/[id] - Get experiment details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const experiment = await getDocument<Experiment>(COLLECTIONS.EXPERIMENTS, id);

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ experiment }, { status: 200 });
  } catch (error) {
    console.error('Error fetching experiment:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to fetch experiment')),
      { status: 500 }
    );
  }
}

// PUT /api/experiments/[id] - Update experiment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await updateDocument(COLLECTIONS.EXPERIMENTS, id, {
      ...body,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating experiment:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to update experiment')),
      { status: 500 }
    );
  }
}

// DELETE /api/experiments/[id] - Delete experiment
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDocument(COLLECTIONS.EXPERIMENTS, id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting experiment:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to delete experiment')),
      { status: 500 }
    );
  }
}

