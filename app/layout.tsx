import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GiveTrace — Transparent Micro-Giving Powered by AI & Solana',
  description:
    'A transparent micro-giving platform where donors are AI-matched to causes, give real devnet crypto donations with an on-chain receipt, and receive personalized narrated thank-yous.',
  keywords: ['Solana', 'Devnet', 'Google AI', 'Gemini', 'ElevenLabs', 'Micro-giving', 'Charity', 'Transparency'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 flex flex-col min-h-screen antialiased">
        <WalletProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
