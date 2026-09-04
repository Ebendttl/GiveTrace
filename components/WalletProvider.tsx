'use client';

import React, { type FC, type ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

export const WalletProvider: FC<Props> = ({ children }) => {
  const network = (
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork | undefined)
    ?? WalletAdapterNetwork.Devnet
  );
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.devnet.solana.com';

  const wallets = useMemo(
    () => [],
    []
  );

  return (
    // @ts-ignore – wallet-adapter ships React 17 types; runtime is React 18
    <ConnectionProvider endpoint={endpoint}>
      {/* @ts-ignore */}
      <SolanaWalletProvider wallets={wallets} autoConnect>
        {/* @ts-ignore */}
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
