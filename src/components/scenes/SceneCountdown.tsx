import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface SceneCountdownProps {
  onNext: () => void;
}

const TimeUnit = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
  <motion.div 
    className="flex flex-col items-center justify-center glass-panel p-3 w-[70px] sm:w-[80px]"
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.8, type: "spring" }}
  >
    <span className="text-2xl sm:text-3xl font-sans font-semibold text-white drop-shadow-md">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[10px] sm:text-xs font-heading tracking-widest text-white/80 uppercase mt-1">
      {label}
    </span>
  </motion.div>
);

export function SceneCountdown({ onNext }: SceneCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // 31 Dec 2026 11:30 AM IST is +05:30 ahead of UTC. 
    // This perfectly evaluates against the user's local phone time in new Date() comparisons.
    const targetDate = new Date('2026-12-31T11:30:00+05:30');

    // Run immediately once so we don't wait 1s for the first tick
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

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

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center px-4">
      <motion.div 
        className="glass-panel w-full p-8 md:p-12 relative overflow-hidden"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-heading mb-2 text-white text-shadow-elegant shimmer-text"
          initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          The Big Day
        </motion.h1>

        <motion.p
          className="text-sm md:text-base font-sans text-white/80 mb-10 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          The journey to our forever...
        </motion.p>

        <div className="flex justify-center gap-2 sm:gap-4 mb-12">
          <TimeUnit value={timeLeft.days} label="Days" delay={0.8} />
          <TimeUnit value={timeLeft.hours} label="Hrs" delay={1.0} />
          <TimeUnit value={timeLeft.minutes} label="Mins" delay={1.2} />
          <TimeUnit value={timeLeft.seconds} label="Secs" delay={1.4} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 2, duration: 1 }}
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
