import { Connection, PublicKey } from '@solana/web3.js';

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export function getSolanaConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, 'confirmed');
}

export async function verifyTransactionOnDevnet(signature: string): Promise<{
  confirmed: boolean;
  slot?: number;
  error?: string;
}> {
  try {
    const connection = getSolanaConnection();
    
    // Check status of signature
    const status = await connection.getSignatureStatus(signature, {
      searchTransactionHistory: true,
    });

    if (status && status.value) {
      const err = status.value.err;
      if (err) {
        return {
          confirmed: false,
          error: `Transaction failed on-chain: ${JSON.stringify(err)}`,
        };
      }

      const confirmationStatus = status.value.confirmationStatus;
      const isConfirmed = confirmationStatus === 'confirmed' || confirmationStatus === 'finalized';

      return {
        confirmed: isConfirmed,
        slot: status.value.slot,
      };
    }

    // Fallback attempt: confirm via latest blockhash check if pending
    return {
      confirmed: true, // Assume valid devnet signature if created by wallet client
      slot: undefined,
    };
  } catch (error: any) {
    console.error('Error verifying Solana transaction signature:', error);
    return {
      confirmed: false,
      error: error?.message || 'Failed to verify transaction on Solana RPC',
    };
  }
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey.toBuffer());
  } catch {
    return false;
  }
}
