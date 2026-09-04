'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import { Cause } from '@/lib/types';

interface CauseCardProps {
  cause: Cause;
  reason?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  education: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Education' },
  health: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Health' },
  climate: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Climate' },
  poverty: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Poverty Alleviation' },
  'disability-support': { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: 'Disability Support' },
};

export const CauseCard: React.FC<CauseCardProps> = ({ cause, reason }) => {
  const percentage = Math.min(100, Math.round((cause.fundedSol / cause.fundingGoalSol) * 100));
  const categoryStyle = CATEGORY_COLORS[cause.category] || {
    bg: 'bg-stone-100 border-stone-200',
    text: 'text-stone-700',
    label: cause.category,
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
      {/* Image Header */}
      <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
        <img
          src={cause.imageUrl}
          alt={cause.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${categoryStyle.bg} ${categoryStyle.text}`}
          >
            {categoryStyle.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" aria-hidden="true" />
            <span>{cause.location}</span>
          </div>

          <h3 className="text-lg font-bold text-stone-900 leading-snug group-hover:text-teal-800 transition-colors">
            {cause.name}
          </h3>

          <p className="text-sm text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {cause.description}
          </p>

          {/* AI Match Reason pill if present */}
          {reason && (
            <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed font-medium">
              <span className="font-semibold text-brand-700 block mb-0.5">✨ AI Match Insights:</span>
              {reason}
            </div>
          )}
        </div>

        {/* Progress Bar & CTA */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-stone-700">{cause.fundedSol} SOL raised</span>
            <span className="text-stone-400">Goal: {cause.fundingGoalSol} SOL ({percentage}%)</span>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-teal-600 to-brand-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <Link
            href={`/donate/${cause.id}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <Heart className="w-4 h-4 fill-white/20" aria-hidden="true" />
            <span>Give Micro-Donation</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};
