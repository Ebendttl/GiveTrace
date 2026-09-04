'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, FileText, Sparkles, AlertCircle } from 'lucide-react';

interface ImpactNarrationProps {
  narrative: string;
  audioUrl?: string | null;
  loadingAudio?: boolean;
  audioError?: string | null;
}

export const ImpactNarration: React.FC<ImpactNarrationProps> = ({
  narrative,
  audioUrl,
  loadingAudio = false,
  audioError,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio playback failed:', err));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-900 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-teal-800 my-6">
      <div className="flex items-center justify-between pb-4 border-b border-teal-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-500/20 text-brand-400 rounded-xl border border-brand-500/30">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Narrated Impact Thank-You</h3>
            <p className="text-xs text-teal-300">Powered by Gemini 2.5 Flash & ElevenLabs TTS</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 bg-teal-800/70 border border-teal-700 text-teal-200 rounded-full">
          Accessibility Mode
        </span>
      </div>

      {/* Audio Player Controls */}
      <div className="bg-teal-900/60 border border-teal-800 rounded-xl p-4 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {loadingAudio ? (
          <div className="flex items-center gap-3 text-xs text-teal-300 animate-pulse">
            <div className="w-4 h-4 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
            <span>Synthesizing voice narration with ElevenLabs...</span>
          </div>
        ) : audioUrl ? (
          <>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => console.error('Audio playback error', e)}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
                className="w-11 h-11 bg-brand-500 hover:bg-brand-400 text-stone-950 rounded-full flex items-center justify-center font-bold transition-all shadow-md focus:ring-2 focus:ring-brand-300 focus:outline-none"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
              <div>
                <p className="text-sm font-semibold text-white">Listen to Personal Audio</p>
                <p className="text-xs text-teal-300">High-fidelity neural voice synthesis</p>
              </div>
            </div>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="p-2 text-teal-300 hover:text-white rounded-lg hover:bg-teal-800/50 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-xs text-teal-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>{audioError || 'Audio player unconfigured or unavailable. Full text transcript active below.'}</span>
          </div>
        )}
      </div>

      {/* Accessible Full Visible Text Transcript (ALWAYS RENDERED) */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>Visually Accessible Transcript</span>
        </div>

        <blockquote className="text-base text-stone-100 italic leading-relaxed font-serif">
          &ldquo;{narrative}&rdquo;
        </blockquote>
      </div>
    </div>
  );
};
