import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCauseById, MOCK_CAUSES } from '@/lib/causes';
import { MapPin, Heart, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CauseDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return MOCK_CAUSES.map((cause) => ({
    id: cause.id,
  }));
}

export default function CauseDetailPage({ params }: CauseDetailPageProps) {
  const cause = getCauseById(params.id);

  if (!cause) {
    notFound();
  }

  const percentage = Math.min(100, Math.round((cause.fundedSol / cause.fundingGoalSol) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Back Button */}
      <Link
        href="/causes"
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Causes</span>
      </Link>

      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="relative h-72 sm:h-96 w-full bg-stone-100">
          <img
            src={cause.imageUrl}
            alt={cause.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-stone-900 border border-stone-200">
              {cause.category.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-teal-700 font-medium">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{cause.location}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
              {cause.name}
            </h1>
          </div>

          <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
            {cause.description}
          </p>

          {/* Funding Status */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-stone-900">{cause.fundedSol} SOL Funded</span>
              <span className="text-stone-500">Goal: {cause.fundingGoalSol} SOL ({percentage}%)</span>
            </div>
            <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-600 to-brand-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified On-Chain Treasury: <code className="font-mono text-stone-700">{cause.treasuryAddress}</code></span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href={`/donate/${cause.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 bg-brand-500 hover:bg-brand-400 text-stone-950 font-bold text-base rounded-2xl transition-all shadow-md"
            >
              <Heart className="w-5 h-5 fill-current" />
              <span>Donate SOL to This Cause</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
