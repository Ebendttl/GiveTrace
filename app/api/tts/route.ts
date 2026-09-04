import { NextRequest, NextResponse } from 'next/server';
import { generateElevenLabsAudioStream } from '@/lib/elevenlabs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body?.text;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "text" in request body' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key is not configured.' },
        { status: 503 }
      );
    }

    const elevenLabsRes = await generateElevenLabsAudioStream(text);

    return new NextResponse(elevenLabsRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    return NextResponse.json(
      { error: error?.message || 'Text-to-speech synthesis failed' },
      { status: 500 }
    );
  }
}
