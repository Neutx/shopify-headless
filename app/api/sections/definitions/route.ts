import { NextResponse } from 'next/server';
import { getAllSectionDefinitions } from '@/lib/sections/registry';

/**
 * GET /api/sections/definitions
 * Get all available section types
 */
export async function GET() {
  try {
    const definitions = getAllSectionDefinitions();
    
    return NextResponse.json({
      success: true,
      definitions,
    });
  } catch (error) {
    console.error('Error fetching section definitions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch section definitions',
      },
      { status: 500 }
    );
  }
}

