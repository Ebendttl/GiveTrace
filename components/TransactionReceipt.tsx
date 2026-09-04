'use client';

import React from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck, Clock, Layers } from 'lucide-react';
import { Cause } from '@/lib/types';

interface TransactionReceiptProps {
  signature: string;
  cause?: Cause;
  amountSol: number;
  confirmed: boolean;
  slot?: number;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  signature,
  cause,
  amountSol,
  confirmed,
  slot,
}) => {
  const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  const formattedTime = new Date().toLocaleString();

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">On-Chain Receipt</h2>
            <p className="text-xs text-stone-500">Publicly Verifiable Solana Devnet Transaction</p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            confirmed
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{confirmed ? 'Finalized on Devnet' : 'Processing Confirmation'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-xs font-medium text-stone-500 block">Recipient Cause</span>
          <span className="font-bold text-stone-900 text-base">{cause?.name || 'Verified Cause'}</span>
          <span className="text-xs text-stone-500 block mt-0.5">{cause?.location}</span>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-xs font-medium text-stone-500 block">Donation Amount</span>
          <span className="font-bold text-teal-800 text-xl">{amountSol} SOL</span>
          <span className="text-xs text-stone-500 block mt-0.5">Zero platform fee friction</span>
        </div>
      </div>

      <div className="space-y-3 text-xs border-t border-stone-100 pt-4">
        <div className="flex items-center justify-between text-stone-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
            <span>Timestamp</span>
          </span>
          <span className="font-mono text-stone-800">{formattedTime}</span>
        </div>

        {slot && (
          <div className="flex items-center justify-between text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
              <span>Solana Slot</span>
            </span>
            <span className="font-mono text-stone-800">#{slot}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-stone-600 gap-1 pt-1">
          <span className="font-medium shrink-0">Transaction Signature</span>
          <span className="font-mono text-stone-700 truncate max-w-xs">{signature}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-stone-700 focus:outline-none"
        >
          <span>Verify on Solana Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
