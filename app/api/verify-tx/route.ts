import { NextRequest, NextResponse } from 'next/server';
import { verifyTransactionOnDevnet } from '@/lib/solana';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = body?.signature;

    if (!signature || typeof signature !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "signature" string in request body' },
        { status: 400 }
      );
    }

    const verification = await verifyTransactionOnDevnet(signature);
    return NextResponse.json(verification);
  } catch (error: any) {
    console.error('Error in /api/verify-tx:', error);
    return NextResponse.json(
      { confirmed: false, error: error?.message || 'Failed to verify transaction' },
      { status: 500 }
    );
  }
}
