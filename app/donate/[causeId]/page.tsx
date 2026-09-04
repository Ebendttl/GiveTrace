import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCauseById, MOCK_CAUSES } from '@/lib/causes';
import { DonationForm } from '@/components/DonationForm';
import { ArrowLeft, MapPin } from 'lucide-react';

interface DonatePageProps {
  params: {
    causeId: string;
  };
}

export function generateStaticParams() {
  return MOCK_CAUSES.map((cause) => ({
    causeId: cause.id,
  }));
}

export default function DonatePage({ params }: DonatePageProps) {
  const cause = getCauseById(params.causeId);

  if (!cause) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Back Link */}
      <Link
        href={`/causes/${cause.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {cause.name}</span>
      </Link>

      {/* Cause Summary Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <img
          src={cause.imageUrl}
          alt={cause.name}
          className="w-20 h-20 rounded-xl object-cover shrink-0"
        />
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{cause.location}</span>
          </div>
          <h1 className="text-lg font-bold text-stone-900 truncate">{cause.name}</h1>
          <p className="text-xs text-stone-500 line-clamp-1">{cause.description}</p>
        </div>
      </div>

      {/* Interactive Donation Form */}
      <DonationForm cause={cause} />
    </div>
  );
}
