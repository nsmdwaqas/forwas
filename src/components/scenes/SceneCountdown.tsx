import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface SceneCountdownProps {
  onNext: () => void;
}

export function SceneCountdown({ onNext }: SceneCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Our journey starts
    const startDate = new Date('2026-08-29T17:00:00+05:30');
    // Our forever begins
    const targetDate = new Date('2026-12-31T11:30:00+05:30');
    const totalDuration = targetDate.getTime() - startDate.getTime();

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      const elapsed = now.getTime() - startDate.getTime();

      let currentProgress = elapsed / totalDuration;
      if (currentProgress < 0) currentProgress = 0;
      if (currentProgress > 1) currentProgress = 1;
      setProgress(currentProgress);

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false; // Stop
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
      return true; // Keep going
    };

    updateCountdown();
    const interval = setInterval(() => {
      if (!updateCountdown()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  // Circular progress variables
  const size = 260;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = center - strokeWidth * 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;
  
  // Calculate position for the glowing tip dot
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  const dotX = center + radius * Math.cos(angle);
  const dotY = center + radius * Math.sin(angle);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4">
      <motion.div 
        className="glass-panel w-full p-6 md:p-10 relative overflow-hidden flex flex-col items-center"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-heading mb-6 text-white text-shadow-elegant shimmer-text"
          initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          The Big Day
        </motion.h1>

        {/* Circular Stopwatch Container */}
        <motion.div 
          className="relative my-4"
          style={{ width: size, height: size }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, type: "spring" }}
        >
          {/* Background Track Circle */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <circle 
              cx={center} cy={center} r={radius} 
              stroke="rgba(255,255,255,0.15)" 
              strokeWidth={strokeWidth} 
              fill="none" 
            />
            
            {/* Progress Circle (Rotated to start at top) */}
            <motion.circle 
              cx={center} cy={center} r={radius} 
              stroke="#E8B4C8" // pink/gold
              strokeWidth={strokeWidth} 
              fill="none" 
              strokeDasharray={circumference}
              strokeLinecap="round"
              className="origin-center -rotate-90 drop-shadow-[0_0_8px_rgba(232,180,200,0.6)]"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            
            {/* Glowing Tip Dot */}
            <motion.circle
              cx={dotX}
              cy={dotY}
              r="5"
              fill="#FFFFFF"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            />
            
            {/* Start Marker (top) */}
            <circle cx={center} cy={center - radius} r="3" fill="rgba(255,255,255,0.8)" />
          </svg>

          {/* Inner Content Grid */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full text-center mt-2">
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-sans font-semibold text-white drop-shadow-md">
                  {timeLeft.days.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-heading tracking-widest text-white/80 uppercase mt-1">Days</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-sans font-semibold text-white drop-shadow-md">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-heading tracking-widest text-white/80 uppercase mt-1">Hours</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-sans font-semibold text-white drop-shadow-md">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-heading tracking-widest text-white/80 uppercase mt-1">Mins</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-sans font-semibold text-white drop-shadow-md">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-heading tracking-widest text-white/80 uppercase mt-1">Secs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Target Date Details */}
        <motion.div 
          className="mt-6 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
           <p className="text-white/60 font-sans uppercase tracking-widest text-[10px] md:text-xs font-semibold mb-2">
             Journey began Aug 29, 2026 • 5:00 PM
           </p>
           <p className="text-gold-light font-heading tracking-widest uppercase text-sm md:text-base font-semibold mb-1">
             December 31, 2026 • 11:30 AM
           </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-8 py-4 glass-button text-white rounded-full font-medium text-lg transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.9, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
