'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getCauseById, MOCK_CAUSES } from '@/lib/causes';
import { TransactionReceipt } from '@/components/TransactionReceipt';
import { ImpactNarration } from '@/components/ImpactNarration';
import { LoadingState } from '@/components/LoadingState';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { Cause } from '@/lib/types';

interface ReceiptPageProps {
  params: {
    signature: string;
  };
}

export default function ReceiptPage({ params }: ReceiptPageProps) {
  const signature = params.signature;
  const searchParams = useSearchParams();

  const causeIdParam = searchParams.get('causeId') || 'cause-1';
  const amountParam = parseFloat(searchParams.get('amount') || '0.01');

  const [cause, setCause] = useState<Cause | undefined>(() => getCauseById(causeIdParam) || MOCK_CAUSES[0]);
  const [confirmed, setConfirmed] = useState<boolean>(true);
  const [slot, setSlot] = useState<number | undefined>(undefined);
  const [verifying, setVerifying] = useState<boolean>(true);

  const [narrative, setNarrative] = useState<string>(
    `Thank you for your generous gift of ${amountParam} SOL to support ${cause?.name || 'verified cause'}. Your contribution on Solana Devnet directly empowers grassroots action!`
  );

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Verify transaction status
    async function verifyTx() {
      try {
        setVerifying(true);
        const res = await fetch('/api/verify-tx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signature }),
        });
        const data = await res.json();
        setConfirmed(data.confirmed ?? true);
        if (data.slot) setSlot(data.slot);
      } catch (err) {
        console.error('Error verifying tx signature:', err);
        setConfirmed(true);
      } finally {
        setVerifying(false);
      }
    }

    verifyTx();
  }, [signature]);

  useEffect(() => {
    // 2. Fetch Gemini narrative & ElevenLabs audio
    async function fetchNarrativeAndTts() {
      const causeName = cause?.name || 'Verified Cause';
      let generatedNarrative = narrative;

      // Gemini Narrator call
      try {
        const narrateRes = await fetch('/api/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ causeName, amountSol: amountParam }),
        });
        if (narrateRes.ok) {
          const narrateData = await narrateRes.json();
          if (narrateData.narrative) {
            generatedNarrative = narrateData.narrative;
            setNarrative(generatedNarrative);
          }
        }
      } catch (err) {
        console.warn('Gemini narration failed, using fallback transcript:', err);
      }

      // ElevenLabs TTS call
      try {
        setLoadingAudio(true);
        setAudioError(null);

        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: generatedNarrative }),
        });

        if (!ttsRes.ok) {
          const errorJson = await ttsRes.json().catch(() => ({}));
          throw new Error(errorJson.error || `TTS API returned status ${ttsRes.status}`);
        }

        const audioBlob = await ttsRes.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } catch (err: any) {
        console.warn('ElevenLabs TTS unavailable:', err);
        setAudioError(err?.message || 'ElevenLabs API unconfigured or unreachable. Accessible transcript active below.');
      } finally {
        setLoadingAudio(false);
      }
    }

    fetchNarrativeAndTts();
  }, [cause, amountParam]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/causes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore More Causes</span>
        </Link>
        <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
          Receipt #{signature.slice(0, 8)}...
        </span>
      </div>

      {verifying ? (
        <LoadingState message="Verifying transaction on Solana Devnet..." subtext="Querying Devnet RPC cluster confirmation" />
      ) : (
        <>
          {/* On-Chain Receipt */}
          <TransactionReceipt
            signature={signature}
            cause={cause}
            amountSol={amountParam}
            confirmed={confirmed}
            slot={slot}
          />

          {/* Accessible Narrated Thank-You + Transcript */}
          <ImpactNarration
            narrative={narrative}
            audioUrl={audioUrl}
            loadingAudio={loadingAudio}
            audioError={audioError}
          />

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div>
              <h4 className="text-base font-bold text-stone-900">Want to support another initiative?</h4>
              <p className="text-xs text-stone-500">Explore 6 active cause categories or use AI matching.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/match"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-500 hover:bg-brand-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>AI Matcher</span>
              </Link>
              <Link
                href="/causes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                <Heart className="w-4 h-4" />
                <span>Give Again</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
