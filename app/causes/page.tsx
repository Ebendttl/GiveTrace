import React from 'react';
import { MOCK_CAUSES } from '@/lib/causes';
import { CauseCard } from '@/components/CauseCard';
import { Grid, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CausesPage() {
  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <Grid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verified Cause Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900">Explore Active Causes</h1>
          <p className="text-sm text-stone-600 max-w-xl">
            Choose a high-impact initiative below to make a direct, transparent micro-donation on Solana Devnet.
          </p>
        </div>

        <Link
          href="/match"
          className="inline-flex items-center gap-2 py-3 px-5 bg-brand-500 hover:bg-brand-400 text-stone-950 font-bold text-sm rounded-2xl transition-all shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Match with AI Instead</span>
        </Link>
      </div>

      {/* Grid of Cause Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CAUSES.map((cause) => (
          <CauseCard key={cause.id} cause={cause} />
        ))}
      </div>
    </div>
  );
}
