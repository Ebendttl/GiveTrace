'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, BarChart3, Database, AlertCircle, Sparkles } from 'lucide-react';
import { LoadingState } from '@/components/LoadingState';

export default function ImpactPage() {
  const [data, setData] = useState<{
    configured: boolean;
    summary: string;
    categoryTotals: Record<string, number>;
    source: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const res = await fetch('/api/impact-report');
        const json = await res.json();
        setData({
          configured: json.configured ?? false,
          summary: json.summary || 'Snowflake transparency dashboard placeholder.',
          categoryTotals: json.categoryTotals || {
            education: 9.4,
            health: 21.5,
            climate: 18.2,
            poverty: 23.0,
            'disability-support': 6.8,
          },
          source: json.source || 'mock',
        });
      } catch (err) {
        console.error('Error fetching impact report:', err);
        setData({
          configured: false,
          summary: 'Snowflake analytics connection unconfigured or offline.',
          categoryTotals: {
            education: 9.4,
            health: 21.5,
            climate: 18.2,
            poverty: 23.0,
            'disability-support': 6.8,
          },
          source: 'mock',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Snowflake Cortex Data Cloud</span>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              data?.configured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {data?.configured ? 'Snowflake Live Connected' : 'Coming Soon / Stretch Mode'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900">
          Radical Transparency Dashboard
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          GiveTrace uses Snowflake Cortex AI engine to audit on-chain micro-donations and verify zero-fee allocation across verified cause categories.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Fetching transparency audit from Snowflake Cortex API..." />
      ) : (
        <div className="space-y-6">
          {/* Status Alert Banner */}
          {!data?.configured && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm mb-0.5">Snowflake Cloud Integration Status</span>
                <span>
                  Snowflake environment variables (`SNOWFLAKE_ACCOUNT`, `SNOWFLAKE_USER`) are currently unconfigured. Rendering live demonstration metrics below.
                </span>
              </div>
            </div>
          )}

          {/* Natural Language Summary Card */}
          <div className="bg-gradient-to-r from-teal-900 to-stone-900 text-white rounded-2xl p-6 shadow-md border border-teal-800 space-y-3">
            <div className="flex items-center gap-2 text-brand-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Cortex AI Executive Summary</span>
            </div>
            <p className="text-base text-stone-100 leading-relaxed font-medium">
              &ldquo;{data?.summary}&rdquo;
            </p>
          </div>

          {/* Bar Chart Visualization */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-700" />
                <span>Donation Allocations by Category (SOL)</span>
              </h3>
              <span className="text-xs text-stone-500 font-mono">Devnet Verified</span>
            </div>

            <div className="space-y-4">
              {Object.entries(data?.categoryTotals || {}).map(([cat, total]) => {
                const maxVal = Math.max(...Object.values(data?.categoryTotals || { a: 1 }));
                const pct = Math.round((total / (maxVal * 1.2)) * 100);

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-stone-800 capitalize">
                      <span>{cat.replace('-', ' ')}</span>
                      <span>{total} SOL</span>
                    </div>
                    <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-600 to-brand-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
