import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Volume2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_CAUSES } from '@/lib/causes';
import { CauseCard } from '@/components/CauseCard';

export default function HomePage() {
  const featuredCauses = MOCK_CAUSES.slice(0, 3);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-teal-800/60">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-teal-700/80 text-teal-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-400" aria-hidden="true" />
            <span>DEV Weekend Challenge &quot;Generosity Edition&quot;</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Transparent Micro-Giving Matching Donors with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">Radical Impact</span>.
          </h1>

          <p className="text-base sm:text-xl text-stone-300 font-normal leading-relaxed max-w-[60ch]">
            GiveTrace matches donors to causes via AI, enables verifiable Devnet Solana micro-donations, and delivers accessible audio thank-you narratives.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href="/match"
              className="inline-flex items-center justify-center gap-2 py-4 px-7 bg-brand-500 hover:bg-brand-400 text-stone-950 font-bold text-base rounded-2xl shadow-lg hover:shadow-brand-500/20 transition-all focus:ring-2 focus:ring-brand-300 focus:outline-none"
            >
              <Sparkles className="w-5 h-5 fill-current" aria-hidden="true" />
              <span>Find Matches with AI</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>

            <Link
              href="/causes"
              className="inline-flex items-center justify-center gap-2 py-4 px-7 bg-teal-800/70 hover:bg-teal-800 border border-teal-700 text-white font-semibold text-base rounded-2xl transition-all focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <span>Browse All Causes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Visual Workflow */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900">How GiveTrace Works</h2>
          <p className="text-base text-stone-600">
            From intuitive intent matching to immutable blockchain receipts and audio accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 bg-amber-500 text-stone-950 rounded-xl flex items-center justify-center font-extrabold text-base shadow-xs">
              1
            </div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>Match</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Describe your passions in natural language. Google Gemini analyzes registered causes and recommends personalized matches with clear reasoning.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-white border border-teal-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 bg-teal-700 text-white rounded-xl flex items-center justify-center font-extrabold text-base shadow-xs">
              2
            </div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>Give On-Chain</span>
              <ShieldCheck className="w-4 h-4 text-teal-700" />
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Send micro-donations directly on Solana Devnet via Phantom Wallet. Receive instant cryptographic verification with a zero-friction transaction receipt.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-white border border-purple-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 bg-purple-700 text-white rounded-xl flex items-center justify-center font-extrabold text-base shadow-xs">
              3
            </div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>Hear the Impact</span>
              <Volume2 className="w-4 h-4 text-purple-700" />
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Receive a warm, tailored thank-you narrative synthesized into audio by ElevenLabs alongside an accessible, visible on-screen transcript.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Causes Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Featured Active Causes</h2>
            <p className="text-sm text-stone-600">Empowering grassroots organizations with radical financial transparency.</p>
          </div>
          <Link
            href="/causes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            <span>View All 6 Causes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCauses.map((cause) => (
            <CauseCard key={cause.id} cause={cause} />
          ))}
        </div>
      </section>
    </div>
  );
}
