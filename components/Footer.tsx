import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-stone-950 font-bold">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Give<span className="text-teal-400">Trace</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              A transparent micro-giving platform matching donors to causes with Google AI (Gemini 2.5 Flash), executing verifiable Solana devnet donations, and producing accessible ElevenLabs voice narration with visible transcripts.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-brand-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Google AI
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Solana Devnet
              </span>
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" /> ElevenLabs TTS
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home Landing</Link></li>
              <li><Link href="/match" className="hover:text-white transition-colors">AI Cause Matcher</Link></li>
              <li><Link href="/causes" className="hover:text-white transition-colors">Browse 6 Causes</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">Snowflake Transparency</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Hackathon Prize Alignment</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Best Use of Google AI</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span> Best Use of Solana</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Best Use of ElevenLabs</li>
              <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-stone-500"></span> Snowflake (Stretch Goal)</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} GiveTrace. Built for DEV Weekend Challenge &quot;Generosity Edition&quot;.</p>
          <p className="font-mono">Solana Devnet Cluster • Statelessly Accessible</p>
        </div>
      </div>
    </footer>
  );
};
