import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface SceneProps {
  onNext: () => void;
}

export function Scene1Loading({ onNext }: SceneProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 seconds loading
    const interval = 30; // update every 30ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onNext, 800); // Wait a bit after 100% before transitioning
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      <div className="glass-panel w-full p-12 flex flex-col items-center justify-center">
        <motion.div 
          className="relative w-32 h-32 mb-8"
          animate={progress === 100 ? { scale: [1, 1.2, 1], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Empty Heart Outline */}
          <Heart strokeWidth={1} className="w-full h-full text-white/30 absolute inset-0" />
          
          {/* Filled Heart clipped by progress */}
          <div 
            className="absolute inset-0 overflow-hidden" 
            style={{ height: `${progress}%`, top: `${100 - progress}%`, transition: 'height 0.1s linear, top 0.1s linear' }}
          >
            <Heart strokeWidth={0} fill="currentColor" className="w-full h-full text-white absolute bottom-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{top: `-${100 - progress}%`}}/>
          </div>

          {/* Liquid effect overlay (subtle) */}
          <motion.div 
             className="absolute inset-x-0 bg-white/30 blur-[2px]"
             style={{ height: '4px', top: `${100 - progress}%` }}
             animate={{ x: [-5, 5, -5] }}
             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />

          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-wine font-semibold text-xl drop-shadow-md z-10">{progress}%</span>
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-xl font-heading tracking-wide text-white text-shadow-elegant shimmer-text"
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Loading love for Shajer...
        </motion.h2>
      </div>
    </div>
  );
}
