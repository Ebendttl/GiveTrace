import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CAUSES } from '@/lib/causes';
import { matchCausesWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "query" parameter in request body' },
        { status: 400 }
      );
    }

    const results = await matchCausesWithGemini(query, MOCK_CAUSES);
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error in /api/match:', error);
    // Fallback response on error
    return NextResponse.json(
      {
        results: MOCK_CAUSES.map((c) => ({
          causeId: c.id,
          reason: `Recommended based on platform focus in ${c.category}.`,
        })),
        warning: error?.message || 'Gemini matcher temporary fallback',
      },
      { status: 200 }
    );
  }
}
