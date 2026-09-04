'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { WalletConnectButton } from './WalletConnectButton';
import { ErrorBanner } from './ErrorBanner';
import { LoadingState } from './LoadingState';
import { Cause } from '@/lib/types';
import { DEFAULT_DEMO_TREASURY } from '@/lib/causes';
import { Coins, Heart, Copy, Check, ExternalLink } from 'lucide-react';

interface DonationFormProps {
  cause: Cause;
}

export const DonationForm: React.FC<DonationFormProps> = ({ cause }) => {
  const router = Router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [amount, setAmount] = useState<string>('0.01');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorInfo, setErrorInfo] = useState<{
    message: string;
    actionUrl?: string;
    actionText?: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const quickAmounts = ['0.01', '0.05', '0.1'];

  const handleCopyWallet = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInfo(null);

    if (!connected || !publicKey) {
      setErrorInfo({
        message: 'Please connect your Phantom Solana wallet before attempting to donate.',
      });
      return;
    }

    const solAmount = parseFloat(amount);
    if (isNaN(solAmount) || solAmount <= 0) {
      setErrorInfo({
        message: 'Please enter a valid donation amount in SOL (greater than 0).',
      });
      return;
    }

    try {
      setLoading(true);
      setLoadingStep('Constructing Solana Devnet transaction...');

      // Treasury recipient address validation
      let recipientKeyStr = cause.treasuryAddress || DEFAULT_DEMO_TREASURY;
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipientKeyStr);
      } catch {
        recipientPubkey = new PublicKey(DEFAULT_DEMO_TREASURY);
      }

      // Check wallet balance
      const balanceLamports = await connection.getBalance(publicKey);
      const requiredLamports = Math.round(solAmount * LAMPORTS_PER_SOL);

      if (balanceLamports < requiredLamports) {
        setErrorInfo({
          message: `Insufficient Devnet SOL balance. You have ${(balanceLamports / LAMPORTS_PER_SOL).toFixed(4)} SOL, but need ${solAmount} SOL plus a tiny gas fee.`,
          actionUrl: `https://faucet.solana.com/`,
          actionText: 'Get Free Devnet SOL at Solana Faucet',
        });
        setLoading(false);
        return;
      }

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: requiredLamports,
        })
      );

      setLoadingStep('Awaiting wallet signature approval in Phantom...');
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);

      setLoadingStep(`Transaction broadcast! Confirming on Solana Devnet... (${signature.slice(0, 8)}...)`);

      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed'
      );

      if (confirmation.value.err) {
        throw new Error(`Transaction error: ${JSON.stringify(confirmation.value.err)}`);
      }

      // Redirect to receipt
      router.push(`/receipt/${signature}?causeId=${cause.id}&amount=${solAmount}`);
    } catch (err: any) {
      console.error('Donation error:', err);
      let msg = err?.message || 'Transaction submission failed.';

      if (msg.includes('User rejected')) {
        msg = 'Transaction was cancelled or rejected in your wallet.';
      } else if (msg.includes('Blockhash not found') || msg.includes('timeout')) {
        msg = 'Network RPC timed out. Please try again.';
      }

      setErrorInfo({
        message: msg,
      });
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-100">
        <div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 uppercase tracking-wider">
            Devnet Micro-Donation
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-2">Support {cause.name}</h2>
          <p className="text-xs text-stone-500 mt-0.5">Direct 100% on-chain micro-grant</p>
        </div>
        <WalletConnectButton />
      </div>

      {connected && publicKey && (
        <div className="mb-6 p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-semibold text-stone-800 shrink-0">Connected:</span>
            <span className="font-mono text-stone-600 truncate">{publicKey.toBase58()}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyWallet}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg shrink-0 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                <span className="text-teal-700 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Address</span>
              </>
            )}
          </button>
        </div>
      )}

      {errorInfo && (
        <ErrorBanner
          message={errorInfo.message}
          actionUrl={errorInfo.actionUrl}
          actionText={errorInfo.actionText}
        />
      )}

      {loading ? (
        <LoadingState message={loadingStep} subtext="Please keep your browser tab open." />
      ) : (
        <form onSubmit={handleDonate} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-stone-800 mb-2">
              Donation Amount (SOL)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Coins className="w-5 h-5 text-brand-600" aria-hidden="true" />
              </div>
              <input
                type="number"
                step="0.001"
                min="0.001"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-11 pr-16 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-stone-900 text-base font-semibold"
                placeholder="0.01"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-stone-500 text-xs font-bold">
                SOL
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-stone-500 font-medium mr-1">Quick Select:</span>
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    amount === amt
                      ? 'bg-brand-500 border-brand-600 text-white shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {amt} SOL
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-teal-900 leading-relaxed space-y-1">
            <p className="font-semibold text-teal-950">🛡️ Radical On-Chain Transparency:</p>
            <p>
              Your transaction is processed directly on Solana Devnet. Upon completion, an AI thank-you narrative and ElevenLabs custom audio receipt will be generated.
            </p>
          </div>

          <button
            type="submit"
            disabled={!connected}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 font-bold text-base rounded-xl transition-all shadow-sm ${
              connected
                ? 'bg-brand-500 hover:bg-brand-600 text-stone-950 focus:ring-2 focus:ring-brand-400'
                : 'bg-stone-200 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Heart className="w-5 h-5 fill-current" aria-hidden="true" />
            <span>{connected ? `Donate ${amount || '0.01'} SOL Now` : 'Connect Wallet to Donate'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
