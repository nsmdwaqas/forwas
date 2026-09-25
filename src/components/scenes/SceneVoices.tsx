import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  AudioLines, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2,
  Sun,
  Coffee
} from 'lucide-react';
import wAudio from '../../audio/W.mp3';
import mAudio from '../../audio/M.mp3';

interface SceneVoicesProps {
  onNext: () => void;
}

interface VoiceTrack {
  id: 'shajer' | 'waqas';
  speaker: string;
  heardBy: string;
  fileName: string;
  dateStr: string;
  timeStr: string;
  spokenWords: string;
  contextNote: string;
  iconType: 'morning' | 'afternoon';
}

const tracks: VoiceTrack[] = [
  {
    id: 'shajer',
    speaker: 'Shajer',
    heardBy: 'Waqas',
    fileName: 'File W',
    dateStr: '15 Sept',
    timeStr: '11:00 AM',
    spokenWords: 'Assalamu alaikum wa rahmatullahi wa barakatuhu',
    contextNote: 'The very first thing he listened to after waking up — a morning blessed with peace.',
    iconType: 'morning'
  },
  {
    id: 'waqas',
    speaker: 'Waqas',
    heardBy: 'Shajer',
    fileName: 'File M',
    dateStr: '24 Sept',
    timeStr: '4:30 PM',
    spokenWords: 'Assalamu alaikum',
    contextNote: 'Heard by Shajer that quiet afternoon — a tender voice reaching straight to her heart.',
    iconType: 'afternoon'
  }
];

export function SceneVoices({ onNext }: SceneVoicesProps) {
  const [playingId, setPlayingId] = useState<'shajer' | 'waqas' | null>(null);
  const [currentTime, setCurrentTime] = useState<{ shajer: number; waqas: number }>({
    shajer: 0,
    waqas: 0
  });
  const [durations, setDurations] = useState<{ shajer: number; waqas: number }>({
    shajer: 4.3,
    waqas: 6.0
  });

  const shajerAudioRef = useRef<HTMLAudioElement | null>(null);
  const waqasAudioRef = useRef<HTMLAudioElement | null>(null);

  const getAudioEl = (id: 'shajer' | 'waqas') => {
    return id === 'shajer' ? shajerAudioRef.current : waqasAudioRef.current;
  };

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const stopAllPlayback = () => {
    if (shajerAudioRef.current) {
      shajerAudioRef.current.pause();
    }
    if (waqasAudioRef.current) {
      waqasAudioRef.current.pause();
    }
    setPlayingId(null);
  };

  const handleTogglePlay = (track: VoiceTrack) => {
    hapticTap();
    const id = track.id;
    const isCurrentlyPlaying = playingId === id;

    if (isCurrentlyPlaying) {
      stopAllPlayback();
      return;
    }

    // Stop the other audio first so they don't overlap
    stopAllPlayback();

    const audioEl = getAudioEl(id);
    if (audioEl) {
      audioEl.play().then(() => {
        setPlayingId(id);
      }).catch(err => {
        console.warn('Playback error', err);
      });
    }
  };

  const handleTimeUpdate = (id: 'shajer' | 'waqas') => {
    const audioEl = getAudioEl(id);
    if (audioEl) {
      setCurrentTime(prev => ({ ...prev, [id]: audioEl.currentTime }));
    }
  };

  const handleLoadedMetadata = (id: 'shajer' | 'waqas') => {
    const audioEl = getAudioEl(id);
    if (audioEl && !isNaN(audioEl.duration) && audioEl.duration > 0) {
      setDurations(prev => ({ ...prev, [id]: audioEl.duration }));
    }
  };

  const handleEnded = (id: 'shajer' | 'waqas') => {
    setPlayingId(null);
    setCurrentTime(prev => ({ ...prev, [id]: durations[id] }));
  };

  const handleSeek = (id: 'shajer' | 'waqas', e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(prev => ({ ...prev, [id]: newTime }));
    const audioEl = getAudioEl(id);
    if (audioEl) {
      audioEl.currentTime = newTime;
    }
  };

  const formatTime = (secs: number) => {
    const s = Math.floor(secs || 0);
    const m = Math.floor(s / 60);
    const remainder = s % 60;
    return `${m}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 min-h-full my-auto">
      <motion.div 
        className="glass-panel w-full p-4 sm:p-6 md:p-8 relative flex flex-col h-[85vh] max-h-[85vh] min-h-[460px] sm:min-h-[560px]"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* Hidden Audio Elements */}
        <audio
          ref={shajerAudioRef}
          src={wAudio}
          preload="metadata"
          onTimeUpdate={() => handleTimeUpdate('shajer')}
          onLoadedMetadata={() => handleLoadedMetadata('shajer')}
          onEnded={() => handleEnded('shajer')}
        />
        <audio
          ref={waqasAudioRef}
          src={mAudio}
          preload="metadata"
          onTimeUpdate={() => handleTimeUpdate('waqas')}
          onLoadedMetadata={() => handleLoadedMetadata('waqas')}
          onEnded={() => handleEnded('waqas')}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-3 sm:mb-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <AudioLines className="w-6 h-6 sm:w-8 sm:h-8 text-gold-light drop-shadow-[0_0_10px_rgba(232,180,200,0.7)] animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE VOICES
          </h1>
          <p className="font-heading italic text-white/80 text-xs sm:text-sm md:text-base tracking-wide">
            the very first words we heard each other speak
          </p>
        </motion.div>

        {/* Scrollable Container with Unified Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-4 sm:gap-5 py-1">
          
          {/* Poetic Context Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-sm shadow-md"
          >
            <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-light">
              Before all the late-night laughter and countless hours on call, there were two short voice notes.
              A morning when sleep cleared into a prayer, and an afternoon when words became real.
            </p>
          </motion.div>

          {/* Tracks List */}
          {tracks.map((track, idx) => {
            const isPlaying = playingId === track.id;
            const current = currentTime[track.id];
            const total = durations[track.id] || 4;
            const progressPercent = Math.min(100, (current / total) * 100);

            // Shajer gets black glass, Waqas gets soft frosted glass
            const isShajer = track.id === 'shajer';

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.15, duration: 0.7 }}
                className={`w-full rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg border text-left transition-all ${
                  isShajer 
                    ? 'bg-black/35 border-white/20 hover:border-pink-300/40' 
                    : 'bg-gradient-to-br from-white/15 to-white/5 border-white/25 hover:border-white/40'
                }`}
              >
                {/* Top Details & Date Badge */}
                <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-heading font-bold text-xs sm:text-sm shadow-sm ${
                      isShajer ? 'bg-pink-500/25 text-pink-200 border border-pink-400/30' : 'bg-white/20 text-white border border-white/30'
                    }`}>
                      {isShajer ? 'S' : 'W'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="font-heading text-base sm:text-lg font-semibold text-white tracking-wide">
                          {track.speaker}&apos;s First Voice
                        </h2>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">
                          {track.fileName}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-white/60 font-sans flex items-center gap-1 mt-0.5">
                        {track.iconType === 'morning' ? <Coffee className="w-3 h-3 text-pink-300" /> : <Sun className="w-3 h-3 text-gold-light" />}
                        <span>Heard by {track.heardBy} on {track.dateStr} at {track.timeStr}</span>
                      </p>
                    </div>
                  </div>

                  {/* Elegant Voice Note Badge */}
                  <div className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-white/10 border border-white/15 text-white/80">
                    <Volume2 className="w-3 h-3 text-gold-light" />
                    <span>Voice Memo</span>
                  </div>
                </div>

                {/* Spoken Quote Message */}
                <div className="my-2.5 p-3 rounded-xl bg-black/25 border border-white/10 relative">
                  <p className="font-sans text-sm sm:text-base text-white/95 italic font-medium leading-relaxed">
                    &ldquo;{track.spokenWords}&rdquo;
                  </p>
                  <p className="text-[11px] text-white/60 font-sans mt-1">
                    {track.contextNote}
                  </p>
                </div>

                {/* Audio Waveform & Player Controls */}
                <div className="mt-3 pt-2 border-t border-white/10 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    
                    {/* Play/Pause Main Button */}
                    <button
                      onClick={() => handleTogglePlay(track)}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md ${
                        isPlaying 
                          ? 'bg-white text-wine scale-105 shadow-[0_0_15px_rgba(255,255,255,0.7)]' 
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                      aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Animated Visualizer Waves */}
                    <div className="flex-1 flex items-center gap-1 h-8 px-2 rounded-xl bg-black/20 border border-white/10 overflow-hidden">
                      {Array.from({ length: 24 }).map((_, barIdx) => {
                        const isBarActive = (barIdx / 24) * 100 <= progressPercent;
                        const randomHeight = isPlaying 
                          ? Math.sin(barIdx * 0.8 + current * 4) * 40 + 50 
                          : 20 + (barIdx % 5) * 8;

                        return (
                          <span
                            key={barIdx}
                            className={`w-1 rounded-full transition-all duration-150 ${
                              isBarActive 
                                ? (isShajer ? 'bg-pink-300' : 'bg-gold-light') 
                                : 'bg-white/25'
                            }`}
                            style={{
                              height: `${Math.max(15, Math.min(90, randomHeight))}%`
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Replay/Restart Button */}
                    <button
                      onClick={() => {
                        hapticTap();
                        setCurrentTime(prev => ({ ...prev, [track.id]: 0 }));
                        const el = getAudioEl(track.id);
                        if (el) {
                          el.currentTime = 0;
                        }
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all shrink-0 cursor-pointer"
                      title="Restart from beginning"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scrubber & Duration Numbers */}
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] font-mono text-white/70 w-8 text-left">
                      {formatTime(current)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={total}
                      step={0.05}
                      value={current}
                      onChange={(e) => handleSeek(track.id, e)}
                      className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <span className="text-[11px] font-mono text-white/70 w-8 text-right">
                      {formatTime(total)}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}

        </div>

        {/* Bottom Navigation */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              stopAllPlayback();
              hapticTap();
              onNext();
            }}
            className="px-6 py-2.5 sm:px-8 sm:py-3.5 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
