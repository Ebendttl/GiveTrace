'use client';

import React from 'react';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  title?: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Action Needed',
  message,
  actionUrl,
  actionText,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="w-full bg-amber-50 border border-amber-300 rounded-xl p-4 my-4 shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800 shrink-0">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-900">{title}</h4>
          <p className="text-sm text-amber-800 mt-0.5 leading-relaxed">{message}</p>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {actionUrl && actionText && (
              <a
                href={actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <span>{actionText}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}

            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-medium rounded-lg transition-colors focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
