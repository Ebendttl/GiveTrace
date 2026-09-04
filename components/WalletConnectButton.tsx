'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AlertTriangle, Download } from 'lucide-react';

export const WalletConnectButton: React.FC = () => {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const isPhantom = !!(window as any).solana?.isPhantom;
      setIsPhantomInstalled(isPhantom);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-start gap-2">
        <div className="custom-wallet-btn-wrapper">
          <button
            type="button"
            className="!bg-brand-600 !text-white !font-semibold !rounded-xl !px-5 !py-2.5 !h-auto !text-sm shadow-sm cursor-wait opacity-90"
            disabled
          >
            Select Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="custom-wallet-btn-wrapper">
        <WalletMultiButton className="!bg-brand-600 hover:!bg-brand-700 !text-white !font-semibold !rounded-xl !px-5 !py-2.5 !h-auto !text-sm !transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      {!isPhantomInstalled && !connected && (
        <a
          href="https://phantom.app/download"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-medium underline mt-1"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Phantom Wallet not detected. Click here to install</span>
        </a>
      )}
    </div>
  );
};
