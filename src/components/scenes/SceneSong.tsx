import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Music, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Calendar, 
  Clock, 
  Heart, 
  Sparkles,
  Mic2,
  Disc3
} from 'lucide-react';
import wsAudio from '../../audio/WS.mp3';

interface SceneSongProps {
  onNext: () => void;
}

export function SceneSong({ onNext }: SceneSongProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; x: number; y: number } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hapticTap = (type: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heart') {
        navigator.vibrate([20, 40, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const handleTogglePlay = () => {
    hapticTap();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio playback error', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration) && audioRef.current.duration > 0) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      setCurrentTime(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    hapticTap();
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const triggerHeartEffect = (e: React.MouseEvent) => {
    hapticTap('heart');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFloatingHeart({ id: Date.now(), x, y });
    setLiked(prev => !prev);

    setTimeout(() => {
      setFloatingHeart(null);
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const s = Math.floor(secs || 0);
    const m = Math.floor(s / 60);
    const remainder = s % 60;
    return `${m}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Audio Element with Fallback Sources */}
        <audio
          ref={audioRef}
          src={wsAudio}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        >
          <source src={wsAudio} type="audio/mpeg" />
          <source src="/audio/WS.mp3" type="audio/mpeg" />
          <source src="/audio/ws.mp3" type="audio/mpeg" />
        </audio>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <Music className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE SONG
          </h1>
          <p className="font-heading italic text-white/80 text-xs sm:text-sm mt-0.5 tracking-wide">
            my favorite melody, sung from the soul for you
          </p>
        </motion.div>

        {/* Scrollable Container with Guaranteed Mobile Touch Scrolling */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-3 sm:gap-4 py-1 touch-pan-y overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* Poetic Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-sm shadow-md shrink-0"
          >
            <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-light">
              One month after our engagement, on a quiet Monday afternoon, I wanted to give you something unedited and real. My favorite song, sung for the first time just for you.
            </p>
            <p className="font-sans text-xs sm:text-sm text-white font-medium italic mt-1.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              No studio, no autotune. Just my heart finding its voice in yours.
            </p>
          </motion.div>

          {/* Main Music Player Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="w-full rounded-2xl p-3.5 sm:p-5 backdrop-blur-md shadow-xl border border-rose-300/25 bg-gradient-to-br from-[#240c21]/95 via-[#2f132c]/85 to-[#19061a]/95 text-left transition-all hover:border-rose-300/40 relative overflow-hidden shrink-0"
          >
            {/* Ambient Background Disc Glow */}
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

            {/* Top Row: Play Button, Track Name, Date & Heart Reaction */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Instant High-Visibility Play/Pause Button */}
                <button
                  onClick={handleTogglePlay}
                  className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xl ${
                    isPlaying 
                      ? 'bg-white text-wine scale-105 shadow-[0_0_22px_rgba(255,255,255,0.85)] ring-4 ring-rose-400/40' 
                      : 'bg-gradient-to-tr from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white hover:scale-105 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  }`}
                  aria-label={isPlaying ? 'Pause song' : 'Play song'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="font-heading text-base sm:text-lg font-semibold text-white tracking-wide truncate">
                      Waqas Singing For Shajer
                    </h2>
                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 font-mono shrink-0">
                      ws.mp3
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/70 font-sans mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-gold-light font-medium">
                      <Calendar className="w-3 h-3 text-gold-light shrink-0" /> 28 Sept 2026
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-light shrink-0" /> 01:11 PM IST
                    </span>
                  </div>
                </div>
              </div>

              {/* Heart Reaction Button */}
              <button
                onClick={triggerHeartEffect}
                className={`p-2.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                  liked 
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title="Treasure this song"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Audio Waveform & Scrubber */}
            <div className="my-3 pt-2 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {/* Animated Visualizer Waveform */}
                <div className="flex-1 flex items-center gap-1 sm:gap-1.5 h-9 px-2 rounded-xl bg-black/35 border border-white/10 overflow-hidden">
                  {Array.from({ length: 26 }).map((_, barIdx) => {
                    const isBarActive = (barIdx / 26) * 100 <= progressPercent;
                    const randomHeight = isPlaying 
                      ? Math.sin(barIdx * 0.7 + currentTime * 5) * 40 + 50 
                      : 20 + (barIdx % 6) * 7;

                    return (
                      <span
                        key={barIdx}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isBarActive 
                            ? 'bg-gradient-to-t from-rose-400 to-pink-200 shadow-[0_0_4px_rgba(244,114,182,0.8)]' 
                            : 'bg-white/20'
                        }`}
                        style={{
                          height: `${Math.max(15, Math.min(95, randomHeight))}%`
                        }}
                      />
                    );
                  })}
                </div>

                {/* Replay/Restart Button */}
                <button
                  onClick={handleRestart}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all shrink-0 cursor-pointer"
                  title="Restart song"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrubber & Duration */}
              <div className="flex items-center gap-2 px-0.5">
                <span className="text-[10px] sm:text-[11px] font-mono text-white/80 w-8 text-left">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-400 hover:bg-white/30 transition-all"
                />
                <span className="text-[10px] sm:text-[11px] font-mono text-white/80 w-8 text-right">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Song Milestone Context Banner */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-black/30 border border-white/10 relative">
              <div className="flex items-center gap-1.5 text-xs text-gold-light font-medium mb-1">
                <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                <span>1 Month After Engagement Milestone</span>
              </div>
              <p className="font-sans text-xs sm:text-[13px] text-white/95 italic leading-relaxed">
                &ldquo;I sang this for you with everything in my heart. When words fall short, melody remembers what the soul can never forget.&rdquo;
              </p>
            </div>

            {/* Bottom Audio Info Pill */}
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] text-white/60 font-sans">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-rose-300" />
                <span>Raw Voice Recording</span>
              </span>
              <span className="font-heading italic text-rose-200 font-medium">
                Forever your singer 🤍
              </span>
            </div>
          </motion.div>

          {/* Aesthetic Footnote Reflection */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-black/20 border border-white/10 text-center shrink-0 mb-1"
          >
            <p className="font-heading italic text-xs sm:text-sm text-white/80 leading-relaxed">
              Every melody has a meaning, but this one will always carry your name.
            </p>
          </motion.div>

        </div>

        {/* Floating Heart Effect */}
        {floatingHeart && (
          <motion.div
            key={floatingHeart.id}
            initial={{ opacity: 1, scale: 0.6, y: 0 }}
            animate={{ opacity: 0, scale: 1.6, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 text-rose-400"
            style={{ left: floatingHeart.x, top: floatingHeart.y }}
          >
            <Heart className="w-8 h-8" fill="currentColor" />
          </motion.div>
        )}

        {/* Bottom Navigation */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              if (audioRef.current) {
                audioRef.current.pause();
              }
              onNext();
            }}
            className="px-6 py-2.5 sm:px-8 sm:py-3.5 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
