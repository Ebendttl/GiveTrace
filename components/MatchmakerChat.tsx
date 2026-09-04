'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, ArrowRight, RefreshCw } from 'lucide-react';
import { CauseCard } from './CauseCard';
import { LoadingState } from './LoadingState';
import { ErrorBanner } from './ErrorBanner';
import { Cause, MatchResult } from '@/lib/types';
import { MOCK_CAUSES } from '@/lib/causes';

export const MatchmakerChat: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{ cause: Cause; reason: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    "Girls' education and digital literacy in rural areas",
    "Clean water and environmental conservation in Global South",
    "Assistive device mobility for low-vision and disabled youth",
    "Urban farming food security and community health",
  ];

  const handleMatch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        throw new Error(`Matching API request failed with status ${res.status}`);
      }

      const data = await res.json();
      const matchResults: MatchResult[] = data.results || [];

      // Map matchResults to mock causes
      const matchedItems = matchResults
        .map((m) => {
          const cause = MOCK_CAUSES.find((c) => c.id === m.causeId);
          return cause ? { cause, reason: m.reason } : null;
        })
        .filter((item): item is { cause: Cause; reason: string } => item !== null)
        .slice(0, 3); // Top 3

      // If no valid matches found, fallback top 3 causes
      if (matchedItems.length === 0) {
        setResults(
          MOCK_CAUSES.slice(0, 3).map((c) => ({
            cause: c,
            reason: `Matches your broad intent for high-impact ${c.category} initiatives.`,
          }))
        );
      } else {
        setResults(matchedItems);
      }
    } catch (err: any) {
      console.error('Matching error:', err);
      setError(err?.message || 'Failed to generate AI recommendations.');
      // Graceful fallback display
      setResults(
        MOCK_CAUSES.slice(0, 3).map((c) => ({
          cause: c,
          reason: `Recommended based on platform focus in ${c.category}.`,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleMatch(query);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input Box */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-brand-100 text-brand-700 rounded-2xl">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">AI Cause Matchmaker</h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Describe your passions — Gemini will analyze and rank causes aligned with your values.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="donor-interest-input" className="sr-only">
              Tell us what you care about
            </label>
            <input
              id="donor-interest-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tell us what you care about... (e.g., girls' education in rural Africa)"
              className="w-full pl-5 pr-36 py-4 border border-stone-300 rounded-2xl text-stone-900 text-base font-medium placeholder-stone-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`absolute right-2 top-2 bottom-2 px-5 font-bold text-sm rounded-xl inline-flex items-center gap-2 transition-all ${
                loading || !query.trim()
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600 text-stone-950 shadow-sm'
              }`}
            >
              <span>Match Causes</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-stone-400 font-medium mr-1">Try asking:</span>
            {samplePrompts.map((promptText) => (
              <button
                key={promptText}
                type="button"
                onClick={() => {
                  setQuery(promptText);
                  handleMatch(promptText);
                }}
                className="text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-medium px-3 py-1.5 rounded-full transition-colors text-left"
              >
                &ldquo;{promptText}&rdquo;
              </button>
            ))}
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>STATISTICS: 6 Verified Global Causes Active</span>
          <Link
            href="/causes"
            className="text-teal-700 font-semibold hover:text-teal-900 underline inline-flex items-center gap-1"
          >
            <span>Skip, show me everything</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && (
        <LoadingState
          message="Gemini 2.5 Flash is analyzing causes and formulating personalized matching insights..."
          subtext="Matching categories, geographical focus, and mission parameters"
        />
      )}

      {results && !loading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span>Top AI Recommended Matches</span>
              <span className="text-xs bg-brand-100 text-brand-800 font-semibold px-2.5 py-0.5 rounded-full">
                Ranked by Relevance
              </span>
            </h3>
            <button
              onClick={() => {
                setResults(null);
                setQuery('');
              }}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Search</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map(({ cause, reason }) => (
              <CauseCard key={cause.id} cause={cause} reason={reason} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
