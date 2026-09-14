import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface SceneProps {
  onNext: () => void;
  title?: string;
  subtitle?: string;
  question: string;
}

export function QuestionScene({ onNext, title, subtitle, question }: SceneProps) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const hapticHover = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const moveNoButton = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e && 'cancelable' in e && e.cancelable) {
      e.preventDefault();
    }
    
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const btnWidth = 100;
      const btnHeight = 50;
      
      const maxX = (container.width / 2) - (btnWidth / 2) - 20;
      const maxY = 100;
      
      let newX = (Math.random() - 0.5) * 2 * maxX;
      let newY = (Math.random() - 0.5) * 2 * maxY;
      
      if (Math.abs(newX) < 60 && Math.abs(newY) < 60) {
        newX = newX > 0 ? newX + 60 : newX - 60;
        newY = newY > 0 ? newY + 60 : newY - 60;
      }

      setNoPosition({ x: newX, y: newY });
      hapticHover();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto text-center" ref={containerRef}>
      <motion.div 
        className="glass-panel w-full p-8 md:p-12 relative overflow-visible"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {title && (
          <motion.h1 
            className="text-4xl md:text-5xl font-heading mb-4 text-white text-shadow-elegant tracking-wide shimmer-text"
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          >
            {title}
          </motion.h1>
        )}
        
        {subtitle && (
          <motion.p 
            className="text-xl md:text-2xl font-heading italic text-white mb-8 text-shadow-elegant font-medium"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.h2 
          className="text-2xl md:text-3xl font-sans font-medium text-white mb-12 text-shadow-elegant"
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
        >
          {question}
        </motion.h2>

        <motion.div 
          className="relative h-24 flex items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="relative px-8 py-4 glass-button text-white rounded-full font-medium text-lg transition-all flex items-center gap-2 z-10"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.9, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
            animate={{
              boxShadow: ["0 8px 32px rgba(0,0,0,0.15)", "0 0 20px rgba(255,255,255,0.4)", "0 8px 32px rgba(0,0,0,0.15)"]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            Yes <Heart className="w-5 h-5 text-gold-light drop-shadow-[0_0_8px_rgba(232,180,200,0.8)]" fill="currentColor" />
          </motion.button>

          <motion.button
            onMouseEnter={moveNoButton}
            onTouchStart={moveNoButton}
            onClick={moveNoButton}
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute px-8 py-4 bg-white/20 border border-white/50 text-[#993556] font-semibold rounded-full text-lg backdrop-blur-md shadow-lg z-20 cursor-default"
            style={{ left: 'calc(50% + 20px)' }}
          >
            No
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
