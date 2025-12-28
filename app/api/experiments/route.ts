import { NextRequest, NextResponse } from 'next/server';
import { getAllDocuments, setDocument } from '@/lib/firebase/firestore';
import { COLLECTIONS } from '@/types/firebase';
import type { Experiment } from '@/types/experiments';
import { Timestamp } from 'firebase/firestore';
import { formatErrorResponse, ValidationError } from '@/lib/utils/errors';

// GET /api/experiments - List all experiments
export async function GET() {
  try {
    const experiments = await getAllDocuments<Experiment>(COLLECTIONS.EXPERIMENTS);
    return NextResponse.json({ experiments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching experiments:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to fetch experiments')),
      { status: 500 }
    );
  }
}

// POST /api/experiments - Create new experiment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, variants, productIds, goalMetric, minSampleSize, confidenceLevel } = body;

    if (!name || !variants || !Array.isArray(variants) || variants.length < 2) {
      throw new ValidationError('Name and at least 2 variants are required');
    }

    // Validate traffic allocation sums to 100
    const totalAllocation = variants.reduce((sum: number, v: any) => sum + (v.trafficAllocation || 0), 0);
    if (Math.abs(totalAllocation - 100) > 0.01) {
      throw new ValidationError('Traffic allocation must sum to 100%');
    }

    const experimentId = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const experiment: Experiment = {
      experimentId,
      name,
      description,
      status: 'draft',
      variants,
      productIds: productIds || [],
      goalMetric: goalMetric || 'conversion',
      minSampleSize: minSampleSize || 1000,
      confidenceLevel: confidenceLevel || 95,
      createdAt: Timestamp.now(),
    };

    await setDocument(COLLECTIONS.EXPERIMENTS, experimentId, experiment);

    return NextResponse.json({ experiment }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(formatErrorResponse(error), { status: 400 });
    }
    console.error('Error creating experiment:', error);
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to create experiment')),
      { status: 500 }
    );
  }
}

