import React, { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { 
  Heart, 
  Lock, 
  Infinity as InfinityIcon, 
  PenTool, 
  Feather, 
  Sparkles, 
  MessageCircleHeart, 
  MessageSquareQuote, 
  AudioLines, 
  HeartHandshake, 
  Music,
  PhoneCall,
  CalendarHeart
} from 'lucide-react';

interface SceneHubProps {
  onConfession: () => void;
  onCountdown?: () => void;
  onForever: () => void;
  onLetter: () => void;
  onTimeline: () => void;
  onMessage: () => void;
  onProposal: () => void;
  onAnswers: () => void;
  onVoices: () => void;
  onSong: () => void;
  onCall: () => void;
  onLovenama: () => void;
  onOneMonth?: () => void;
}

export function SceneHub({ 
  onConfession, 
  onCountdown,
  onForever, 
  onLetter, 
  onTimeline, 
  onMessage, 
  onProposal, 
  onAnswers, 
  onVoices, 
  onSong, 
  onCall,
  onLovenama 
}: SceneHubProps) {
  const [lockedShake, setLockedShake] = useState(false);
  const controls = useAnimation();

  const hapticTap = (type: 'default' | 'locked' = 'default') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'locked') {
        navigator.vibrate([40, 50, 40]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  const handleLockedClick = async () => {
    hapticTap('locked');
    setLockedShake(true);

    await controls.start({ 
      x: [-12, 12, -9, 9, -5, 5, 0], 
      transition: { duration: 0.45, ease: "easeInOut" } 
    });
    setLockedShake(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto text-center px-4 my-auto">
      <motion.div 
        className="glass-panel w-full p-6 sm:p-8 md:p-10 relative overflow-y-auto max-h-[88vh] flex flex-col gap-3 sm:gap-4 custom-scrollbar"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-heading mb-1 sm:mb-2 text-white text-shadow-elegant shimmer-text shrink-0"
          initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Choose a Chapter
        </motion.h1>

        {/* The Confession */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onConfession();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Confession</span>
            <Heart className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" fill="currentColor" />
          </motion.button>
        </motion.div>

        {/* The Forever */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onForever();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Forever</span>
            <InfinityIcon className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>
        
        {/* The Letter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onLetter();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Letter</span>
            <PenTool className="w-5 h-5 text-white/90 group-hover:-rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onTimeline();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Timeline</span>
            <Sparkles className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onMessage();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Message</span>
            <MessageCircleHeart className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The Proposal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.12, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onProposal();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Proposal</span>
            <HeartHandshake className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The Answers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.18, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onAnswers();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Answers</span>
            <MessageSquareQuote className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The Voices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.23, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onVoices();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Voices</span>
            <AudioLines className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The Song */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.27, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onSong();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Song</span>
            <Music className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The Call */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.29, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onCall();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Call</span>
            <PhoneCall className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The LOVENAMA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.31, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onLovenama();
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span className="tracking-[0.15em] uppercase text-sm md:text-base">The LOVENAMA</span>
            <Feather className="w-5 h-5 text-white/90 group-hover:-rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* The Big Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.34, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              if (onCountdown) {
                onCountdown();
              }
            }}
            className="w-full px-5 py-3.5 sm:px-6 sm:py-4 glass-button text-white rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between group min-h-[44px]"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.98, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            <span>The Big Day</span>
            <CalendarHeart className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </motion.button>
        </motion.div>

        {/* Locked Button - Gives animation of locked on click, no action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.36, duration: 1 }}
        >
          <motion.button
            onClick={handleLockedClick}
            animate={controls}
            className={`w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl font-medium text-base sm:text-lg transition-all flex items-center justify-between min-h-[44px] cursor-pointer ${
              lockedShake 
                ? 'bg-rose-500/20 border border-rose-400/80 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <span>Locked</span>
            <motion.div
              animate={lockedShake ? { rotate: [-15, 15, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Lock className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}
