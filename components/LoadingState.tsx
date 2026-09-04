'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Processing request...',
  subtext,
}) => {
  return (
    <div
      role="status"
      className="w-full flex flex-col items-center justify-center p-8 text-center bg-white/70 backdrop-blur-sm border border-stone-200 rounded-2xl shadow-sm my-4"
    >
      <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-3" aria-hidden="true" />
      <p className="text-stone-800 font-semibold text-base">{message}</p>
      {subtext && <p className="text-stone-500 text-xs mt-1 max-w-sm">{subtext}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
