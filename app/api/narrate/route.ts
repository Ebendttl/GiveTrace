import { NextRequest, NextResponse } from 'next/server';
import { generateThankYouNarrative } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { causeName, amountSol } = body || {};

    if (!causeName || typeof amountSol !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body. Expected "causeName" (string) and "amountSol" (number).' },
        { status: 400 }
      );
    }

    const narrative = await generateThankYouNarrative(causeName, amountSol);
    return NextResponse.json({ narrative });
  } catch (error: any) {
    console.error('Error in /api/narrate:', error);
    return NextResponse.json(
      {
        narrative: 'Thank you so much for your generous micro-donation! Your contribution on Solana devnet is directly funding impactful community initiatives.',
      },
      { status: 200 }
    );
  }
}
