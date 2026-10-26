import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Flame, 
  Heart, 
  Sparkles, 
  Maximize2, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Film,
  MessageCircleHeart
} from 'lucide-react';
import shScreenshot from '../../assets/SH.jpeg';
import sh1Video from '../../assets/SH1.mp4';
import sh2Video from '../../assets/SH2.mp4';

interface SceneShamelessProps {
  onNext: () => void;
}

export function SceneShameless({ onNext }: SceneShamelessProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; x: number; y: number } | null>(null);

  // Video 1 States
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isMuted1, setIsMuted1] = useState(false);

  // Video 2 States
  const video2Ref = useRef<HTMLVideoElement | null>(null);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isMuted2, setIsMuted2] = useState(false);

  const hapticTap = (type: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heart') {
        navigator.vibrate([20, 40, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
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

  const togglePlay1 = () => {
    hapticTap('light');
    if (video1Ref.current) {
      if (video1Ref.current.paused) {
        // Pause other video if playing
        if (video2Ref.current && !video2Ref.current.paused) {
          video2Ref.current.pause();
          setIsPlaying2(false);
        }
        video1Ref.current.play().catch(() => {});
        setIsPlaying1(true);
      } else {
        video1Ref.current.pause();
        setIsPlaying1(false);
      }
    }
  };

  const togglePlay2 = () => {
    hapticTap('light');
    if (video2Ref.current) {
      if (video2Ref.current.paused) {
        // Pause other video if playing
        if (video1Ref.current && !video1Ref.current.paused) {
          video1Ref.current.pause();
          setIsPlaying1(false);
        }
        video2Ref.current.play().catch(() => {});
        setIsPlaying2(true);
      } else {
        video2Ref.current.pause();
        setIsPlaying2(false);
      }
    }
  };

  const toggleMute1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticTap('light');
    if (video1Ref.current) {
      video1Ref.current.muted = !video1Ref.current.muted;
      setIsMuted1(video1Ref.current.muted);
    }
  };

  const toggleMute2 = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticTap('light');
    if (video2Ref.current) {
      video2Ref.current.muted = !video2Ref.current.muted;
      setIsMuted2(video2Ref.current.muted);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Flame className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <Flame className="w-7 h-7 sm:w-9 sm:h-9 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE SHAMELESS
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Our First Intimate Whispers &amp; Kiss Reels • &ldquo;could be us..?&rdquo;
          </p>
        </motion.div>

        {/* Scrollable Container with Smooth Mobile Scrolling */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-3.5 sm:gap-4 py-1 touch-pan-y overscroll-contain text-left relative z-10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* Context Badges Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center justify-between border-b border-white/15 pb-2.5 flex-wrap gap-2 shrink-0"
          >
            <div className="inline-flex items-center gap-2 bg-rose-500/25 px-3 py-1.5 rounded-full border border-rose-400/50 shadow-sm">
              <Flame className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Our First Shameless Talks &amp; Kiss Reels
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              26 Oct 2026
            </div>
          </motion.div>

          {/* Video Reels Section (SH1.mp4 & SH2.mp4) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="shrink-0 w-full flex flex-col gap-2"
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-xs sm:text-sm text-gold-light font-bold flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                <Film className="w-4 h-4 text-amber-300" />
                The Kiss Reels We Sent Each Other
              </span>
              <span className="text-[11px] text-white/70 font-mono">
                Tap video to play
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* Video Reel 1 */}
              <div 
                className="relative rounded-2xl overflow-hidden border border-white/25 bg-black/90 shadow-xl group aspect-[9/16] max-h-[300px] sm:max-h-[340px] flex items-center justify-center cursor-pointer"
                onClick={togglePlay1}
              >
                <video
                  ref={video1Ref}
                  src={sh1Video}
                  playsInline
                  loop
                  className="w-full h-full object-contain bg-black"
                  onPlay={() => setIsPlaying1(true)}
                  onPause={() => setIsPlaying1(false)}
                />

                {/* Play/Pause Overlay Icon */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
                    isPlaying1 ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg">
                    {isPlaying1 ? (
                      <Pause className="w-6 h-6 fill-white" />
                    ) : (
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Top Badge & Sound Toggle */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-white font-medium border border-white/20">
                    Reel 1 💋
                  </span>
                  <button
                    type="button"
                    onClick={toggleMute1}
                    className="pointer-events-auto p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-white/20"
                    aria-label="Toggle mute reel 1"
                  >
                    {isMuted1 ? <VolumeX className="w-3.5 h-3.5 text-white/70" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>
              </div>

              {/* Video Reel 2 */}
              <div 
                className="relative rounded-2xl overflow-hidden border border-white/25 bg-black/90 shadow-xl group aspect-[9/16] max-h-[300px] sm:max-h-[340px] flex items-center justify-center cursor-pointer"
                onClick={togglePlay2}
              >
                <video
                  ref={video2Ref}
                  src={sh2Video}
                  playsInline
                  loop
                  className="w-full h-full object-contain bg-black"
                  onPlay={() => setIsPlaying2(true)}
                  onPause={() => setIsPlaying2(false)}
                />

                {/* Play/Pause Overlay Icon */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
                    isPlaying2 ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg">
                    {isPlaying2 ? (
                      <Pause className="w-6 h-6 fill-white" />
                    ) : (
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Top Badge & Sound Toggle */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-white font-medium border border-white/20">
                    Reel 2 💋
                  </span>
                  <button
                    type="button"
                    onClick={toggleMute2}
                    className="pointer-events-auto p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all border border-white/20"
                    aria-label="Toggle mute reel 2"
                  >
                    {isMuted2 ? <VolumeX className="w-3.5 h-3.5 text-white/70" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Screenshot Showcase Card (SH.jpeg) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="shrink-0 w-full rounded-2xl overflow-hidden shadow-xl border border-white/25 bg-black/85 backdrop-blur-md group cursor-pointer"
            onClick={() => {
              hapticTap('light');
              setIsModalOpen(true);
            }}
          >
            <div className="p-2 sm:p-3 bg-zinc-950 flex flex-col items-center justify-center">
              <img 
                src={shScreenshot} 
                alt="Our Shameless Chat Conversation"
                className="w-full h-auto max-h-[220px] sm:max-h-[260px] object-contain rounded-xl block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
            <div className="px-3.5 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/90">
              <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>&ldquo;could be us..?&rdquo; • Raw Chat</span>
              </span>
              <span className="text-gold-light text-[11px] flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                <Maximize2 className="w-3 h-3" />
                <span>Tap to view full conversation</span>
              </span>
            </div>
          </motion.div>

          {/* The Intimate Context & Words Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/40 via-black/50 to-purple-950/40 border border-rose-400/25 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2">
              <Flame className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                The First Time All Hesitation Melted Away
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              On 26 October 2026, the quiet bashfulness turned into pure, playful intimacy. For the first time, we talked without filters — sending kiss reels to each other, teasing over every shared look, and whispering secrets that belonged only to us.
            </p>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-purple-100/95 italic font-serif leading-relaxed text-center">
              &ldquo;could be us..?&rdquo; <br />
              <span className="text-amber-200 font-sans font-medium text-xs sm:text-sm not-italic mt-1 inline-block">
                &ldquo;haanji.. Aameeen.. ❤️❤️🙈&rdquo;
              </span>
            </div>
          </motion.div>

          {/* Poetic & Interactive Reflection Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-purple-500/20 via-rose-500/15 to-purple-500/20 border border-purple-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/30 text-rose-200 mb-2">
              <MessageCircleHeart className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Shameless in Love, Bound in Soul
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;True intimacy is when shy souls stop hiding behind decorum, and allow love to become playful, raw, and delightfully shameless. Every kiss reel was a silent prayer for the day distance turns into touch.&rdquo;
            </p>

            {/* Interactive Heart Reaction */}
            <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={triggerHeartEffect}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  liked 
                    ? 'bg-rose-500/40 text-rose-100 border border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] font-medium' 
                    : 'bg-white/15 hover:bg-white/20 text-white border border-white/25'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{liked ? 'Could be us.. Aameen 🙈❤️' : 'Hold this memory'}</span>
              </button>
            </div>
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

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
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

      </div>

      {/* Fullscreen Lightbox Modal for Chat Screenshot */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 touch-none"
            onClick={() => {
              hapticTap('light');
              setIsModalOpen(false);
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                hapticTap('light');
                setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-all cursor-pointer"
              aria-label="Close conversation preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-sm sm:max-w-md w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/25 bg-black flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex-1 overflow-auto flex items-center justify-center p-2">
                <img 
                  src={shScreenshot} 
                  alt="Full Chat Screenshot" 
                  className="w-full h-auto max-h-[72vh] object-contain rounded-2xl block mx-auto"
                />
              </div>
              <div className="p-3 bg-zinc-950 border-t border-white/10 text-center shrink-0">
                <p className="text-white text-xs sm:text-sm font-medium">
                  &ldquo;could be us..?&rdquo; • &ldquo;haanji.. Aameeen.. ❤️❤️🙈&rdquo;
                </p>
                <p className="text-white/70 text-[11px] mt-0.5 font-mono">
                  26 Oct 2026 • The Shameless
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
