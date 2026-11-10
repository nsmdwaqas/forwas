import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onBack?: () => void;
  label?: string;
  inline?: boolean;
}

export function BackButton({ onBack, label = 'Back', inline = false }: BackButtonProps) {
  if (!onBack) return null;

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  return (
    <div
      className={
        inline
          ? 'w-full flex items-center justify-start shrink-0 mb-2 relative z-20'
          : 'absolute top-3 left-3 sm:top-4 sm:left-5 z-20'
      }
    >
      <motion.button
        type="button"
        onClick={() => {
          hapticTap();
          onBack();
        }}
        className="px-3.5 py-1.5 sm:px-4 sm:py-1.5 glass-button text-white rounded-full font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all cursor-pointer"
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.35)' }}
        whileTap={{ scale: 0.96 }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{label}</span>
      </motion.button>
    </div>
  );
}
