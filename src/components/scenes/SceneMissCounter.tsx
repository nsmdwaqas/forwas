import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  HeartPulse, 
  Sparkles, 
  Smartphone,
  Laptop
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SceneMissCounterProps {
  onNext: () => void;
}

interface MissRecord {
  name: string;
  role: boolean;
  'Miss Count': number | null;
  Latest_at: string | null;
}

export function SceneMissCounter({ onNext }: SceneMissCounterProps) {
  const [records, setRecords] = useState<MissRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<'Shajer' | 'Waqas'>('Shajer');
  const [deviceDetected, setDeviceDetected] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  // Detect device on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      const isAndroid = /Android/i.test(ua);
      if (isAndroid) {
        setCurrentUser('Shajer');
        setDeviceDetected('Android (Shajer)');
      } else {
        setCurrentUser('Waqas');
        setDeviceDetected(/iPhone|iPad|iPod/i.test(ua) ? 'iOS (Waqas)' : 'Desktop/Web (Waqas)');
      }
    }
  }, []);

  const hapticTap = (type: 'light' | 'heart' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'heart') {
        navigator.vibrate([25, 45, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  // Fetch Miss_Counter data from Supabase
  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data, error } = await supabase
        .from('Miss_Counter')
        .select('*');

      if (!error && data) {
        setRecords(data as MissRecord[]);
      }
    } catch (err) {
      console.warn('Error fetching Miss_Counter:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh periodically so live updates from both sides appear seamlessly
    const interval = setInterval(() => {
      loadData(true);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const shajerRecord = records.find(r => r.name?.toLowerCase().includes('shajer'));
  const waqasRecord = records.find(r => r.name?.toLowerCase().includes('waqas'));

  const shajerCount = typeof shajerRecord?.['Miss Count'] === 'number' ? shajerRecord['Miss Count'] : 0;
  const waqasCount = typeof waqasRecord?.['Miss Count'] === 'number' ? waqasRecord['Miss Count'] : 0;
  const totalMisses = shajerCount + waqasCount;

  // Single Circle Proportions (SVG Circle Math)
  const radius = 80;
  const circumference = 2 * Math.PI * radius; // ~502.65

  let waqasRatio = 0.5;
  let shajerRatio = 0.5;

  if (totalMisses > 0) {
    waqasRatio = waqasCount / totalMisses;
    shajerRatio = shajerCount / totalMisses;
  }

  const waqasArc = waqasRatio * circumference;
  const shajerArc = shajerRatio * circumference;

  // Increment Miss Count
  const handleMissClick = async (e: React.MouseEvent) => {
    if (isUpdating) return;
    hapticTap('heart');
    setIsUpdating(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const emojis = ['❤️', '💖', '🥺', '🤍', '✨'];
    const newItems = emojis.map((emoji, idx) => ({
      id: Date.now() + idx,
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 30 - 15),
      text: emoji
    }));
    setFloatingHearts(prev => [...prev, ...newItems]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(item => !newItems.some(n => n.id === item.id)));
    }, 1500);

    const nowIso = new Date().toISOString();
    const isShajer = currentUser === 'Shajer';
    const currentCount = isShajer ? shajerCount : waqasCount;
    const updatedCount = currentCount + 1;

    // Optimistic Update
    setRecords(prev => {
      return prev.map(item => {
        if (item.name?.toLowerCase().includes(currentUser.toLowerCase())) {
          return {
            ...item,
            'Miss Count': updatedCount,
            Latest_at: nowIso
          };
        }
        return item;
      });
    });

    try {
      const { error } = await supabase
        .from('Miss_Counter')
        .update({
          'Miss Count': updatedCount,
          Latest_at: nowIso
        })
        .ilike('name', `%${currentUser}%`);

      if (error) {
        console.warn('Error updating Miss_Counter:', error.message);
      } else {
        await loadData(true);
      }
    } catch (err) {
      console.warn('Failed to update miss count:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTimestampIST = (isoString?: string | null) => {
    if (!isoString) return 'Waiting for first miss';
    try {
      const d = new Date(isoString);
      const dateStr = d.toLocaleDateString('en-GB', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const timeStr = d.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).toLowerCase();
      return `${dateStr} ${timeStr} IST`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <HeartPulse className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <HeartPulse className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE MISS COUNTER
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Two Souls Completing One Circle of Missing
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
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Our Shared Circle of Longing
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
              <span>Device:</span>
              <span className="text-rose-300 font-bold">{deviceDetected || 'Ready'}</span>
            </div>
          </motion.div>

          {/* Single Unified Circle Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="shrink-0 w-full py-5 sm:py-6 bg-black/45 rounded-3xl border border-white/15 flex flex-col items-center justify-center gap-4 relative overflow-hidden backdrop-blur-md shadow-xl"
          >
            {/* The Unified SVG Circle */}
            <div className="relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
              <svg 
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 200 200"
              >
                {/* SVG Definitions for Gradients and Glows */}
                <defs>
                  {/* Waqas Amber Gradient */}
                  <linearGradient id="waqasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>

                  {/* Shajer Rose Gradient */}
                  <linearGradient id="shajerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#FB7185" />
                  </linearGradient>

                  {/* Subtle Filter Glow */}
                  <filter id="circleGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Track Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="13"
                />

                {/* Waqas Segment Arc */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="url(#waqasGrad)"
                  strokeWidth="13"
                  strokeDasharray={`${waqasArc} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  filter="url(#circleGlow)"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${waqasArc} ${circumference}` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Shajer Segment Arc */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="url(#shajerGrad)"
                  strokeWidth="13"
                  strokeDasharray={`${shajerArc} ${circumference}`}
                  strokeDashoffset={-waqasArc}
                  strokeLinecap="round"
                  filter="url(#circleGlow)"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ 
                    strokeDasharray: `${shajerArc} ${circumference}`,
                    strokeDashoffset: -waqasArc
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>

              {/* Inside the Circle Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="mb-0.5"
                >
                  <HeartPulse className="w-6 h-6 text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
                </motion.div>

                {/* Total Count Number */}
                <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                  {totalMisses}
                </span>

                <span className="text-[11px] text-white/80 font-sans tracking-wide uppercase mt-0.5">
                  times missed
                </span>

                {/* Romantic Share Pill */}
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-white/15">
                  <span className="text-amber-300 font-semibold">
                    Waqas {Math.round(waqasRatio * 100)}%
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-rose-300 font-semibold">
                    Shajer {Math.round(shajerRatio * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom of the Circle: When Both Missed Each Other in IST */}
            <div className="w-full max-w-sm px-4 pt-2 border-t border-white/10 flex flex-col gap-1.5 text-center">
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-sans font-semibold mb-0.5">
                Recent Touchpoints
              </span>
              <div className="flex flex-col gap-1 text-xs text-white/90 font-mono">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  <span>
                    <strong>Waqas :</strong> {formatTimestampIST(waqasRecord?.Latest_at)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                  <span>
                    <strong>Shajer :</strong> {formatTimestampIST(shajerRecord?.Latest_at)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tap-to-Miss Interactive Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/40 via-black/60 to-purple-950/40 border border-rose-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col items-center gap-3 text-center"
          >
            {/* User Toggle Switcher */}
            <div className="flex items-center justify-center gap-1 p-1 bg-black/50 rounded-xl border border-white/15 w-full max-w-xs">
              <button
                type="button"
                onClick={() => {
                  hapticTap('light');
                  setCurrentUser('Shajer');
                }}
                className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  currentUser === 'Shajer'
                    ? 'bg-rose-500/40 text-white border border-rose-400/50 shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Shajer (Android)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  hapticTap('light');
                  setCurrentUser('Waqas');
                }}
                className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  currentUser === 'Waqas'
                    ? 'bg-amber-500/40 text-white border border-amber-400/50 shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Waqas (iOS/PC)</span>
              </button>
            </div>

            {/* The Big I Miss You Button */}
            <motion.button
              type="button"
              onClick={handleMissClick}
              disabled={isUpdating}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500/40 via-rose-600/50 to-pink-500/40 hover:from-rose-500/60 hover:to-pink-500/60 active:scale-95 border-2 border-rose-400/60 shadow-[0_0_30px_rgba(244,63,94,0.4)] text-white font-medium text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              <HeartPulse className={`w-6 h-6 text-rose-200 ${isUpdating ? 'animate-spin' : 'animate-pulse'}`} />
              <span className="font-heading tracking-wide">
                I Miss You Right Now ❤️
              </span>
            </motion.button>

            <span className="text-[11px] text-white/70 font-sans">
              Currently logging miss as <strong className="text-rose-300">{currentUser}</strong> • Synchronized live across your devices
            </span>
          </motion.div>

          {/* Poetic Note Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-purple-500/20 via-rose-500/15 to-purple-500/20 border border-purple-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              One Shared Circle of Longing
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;No competition, no division — just two people bound within the same circle. Every press adds to our shared total, reminding us that no matter how many miles stand between us, we are always thinking of each other.&rdquo;
            </p>
          </motion.div>

        </div>

        {/* Floating Hearts Effect */}
        {floatingHearts.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.8, y: -70 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 text-2xl select-none"
            style={{ left: item.x, top: item.y }}
          >
            {item.text}
          </motion.div>
        ))}

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
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
    </div>
  );
}
