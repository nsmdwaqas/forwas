import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Maximize2, Sparkles, Video } from 'lucide-react';
import { BackButton } from '../BackButton';

interface SceneVideoCallProps {
  onNext: () => void;
  onBack?: () => void;
}

const driveFolderUrl = 'https://drive.google.com/drive/folders/1zoKvEWVvr3jpErzSjI2q-vURzDzSvTz0?usp=sharing';

export function SceneVideoCall({ onNext, onBack }: SceneVideoCallProps) {
  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div className="glass-panel w-full p-3 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden">
        <BackButton onBack={onBack} />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <Video className="w-7 h-7 sm:w-9 sm:h-9 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE VIDEO CALL
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide">
            The first time our eyes met through a screen
          </p>
        </motion.div>

        <div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-3 custom-scrollbar scroll-smooth flex flex-col gap-3.5 sm:gap-4 py-1 touch-pan-y overscroll-contain text-left" style={{ WebkitOverflowScrolling: 'touch' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between border-b border-white/15 pb-2.5 flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 bg-rose-500/25 px-3 py-1.5 rounded-full border border-rose-300/50 text-xs sm:text-sm font-semibold text-white">
              <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
              A moment we kept returning to
            </span>
            <span className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono">
              24 Nov 2026
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="w-full rounded-2xl overflow-hidden border border-white/20 bg-[#090909] shadow-2xl">
            <div className="px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between text-white">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Recent</h2>
              <span className="text-xs text-white/50">WhatsApp</span>
            </div>
            <div className="divide-y divide-white/10">
              {[
                ['8:45 PM', 'Outgoing', 'Video call'],
                ['8:41 PM', 'Outgoing', 'Video call'],
                ['8:39 PM', 'Outgoing', 'Video call'],
                ['5:02 PM', 'Outgoing', 'Call'],
              ].map(([time, direction, type]) => (
                <div key={`${time}-${type}`} className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200/70 to-rose-300/50 flex items-center justify-center text-[#2d1720] font-heading text-lg shrink-0">R</div>
                    <div className="min-w-0">
                      <p className="text-white text-base sm:text-lg truncate">ruhi.. <span className="text-rose-300">♡</span></p>
                      <p className="text-white/55 text-xs sm:text-sm">↗ {direction} · {type}</p>
                    </div>
                  </div>
                  <span className="text-white/65 text-xs sm:text-sm whitespace-nowrap">{time}</span>
                </div>
              ))}
            </div>
            <div className="px-4 sm:px-6 py-3 bg-white/5 flex items-center justify-between gap-3 text-[11px] sm:text-xs text-white/60">
              <span>Three little returns to the same moment</span>
              <Video className="w-4 h-4 text-rose-200 shrink-0" />
            </div>
          </motion.div>

          <a href={driveFolderUrl} target="_blank" rel="noreferrer" className="w-full rounded-2xl border border-amber-200/35 bg-amber-100/10 px-4 py-3 flex items-center justify-between gap-3 text-white hover:bg-amber-100/15 transition-colors">
            <span className="flex items-center gap-2 text-xs sm:text-sm"><Maximize2 className="w-4 h-4 text-amber-200 shrink-0" /> Open the raw call screenshot</span>
            <span className="text-[11px] text-white/60 shrink-0">Google Drive</span>
          </a>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-rose-950/70 via-black/45 to-amber-950/40 border border-rose-300/25 shadow-xl flex flex-col gap-3">
            <h3 className="font-heading text-base sm:text-lg text-white font-semibold">Three times, because neither heart was ready</h3>
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed">We planned to call, and then life placed the moment in front of us: a guest arrived at your house at exactly the same time. Later, when you were free, you sent that little message and we finally met on WhatsApp.</p>
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed">The first call was only a few nervous seconds. We said Salaam, and somehow the call disappeared. We called back, took a screenshot to keep the memory, and ended it. Then we called once more, only to take a proper picture of the two of us looking at each other.</p>
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed">It was all within minutes, yet neither of us wanted the moment to end. We kept finding one more reason to see each other again.</p>
          </motion.div>

          <div className="rounded-2xl bg-black/35 border border-white/15 p-4 sm:p-5 text-center">
            <p className="font-heading italic text-sm sm:text-base text-rose-100 leading-relaxed">“For the first time, I saw your eyes when we said I love you.”</p>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed mt-3">You blushed. I pretended I had not heard you, just so you would say it once more. And you did — twice — turning a few minutes into one of the longest memories of my life.</p>
          </div>
        </div>

        <motion.div className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <motion.button onClick={() => { hapticTap(); onNext(); }} className="px-6 py-2.5 sm:px-8 sm:py-3.5 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
