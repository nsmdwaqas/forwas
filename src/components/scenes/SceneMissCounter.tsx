import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  HeartPulse, 
  Sparkles, 
  Clock, 
  Heart
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { triggerPartnerMissNotification } from '../../lib/pwaAndPush';
import { PWAAndNotifyBar } from '../PWAAndNotifyBar';

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
  const [currentUser, setCurrentUser] = useState<'Shajer' | 'Waqas'>('Shajer');
  const [deviceDetected, setDeviceDetected] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCircleOverride, setShowCircleOverride] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const hasVibratedForSyncRef = useRef(false);

  // Detect soul on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      const isAndroid = /Android/i.test(ua);
      if (isAndroid) {
        setCurrentUser('Shajer');
        setDeviceDetected('Shajer');
      } else {
        setCurrentUser('Waqas');
        setDeviceDetected('Waqas');
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

  const hapticSynced = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      // Romantic double-heartbeat vibration rhythm: thump-thump ... thump-thump ... thump!
      navigator.vibrate([100, 60, 100, 140, 120, 60, 200, 80, 350]);
    }
  };

  // Fetch Miss_Counter data from Supabase
  const loadData = async (silent = false) => {
    try {
      const { data, error } = await supabase
        .from('Miss_Counter')
        .select('*');

      if (!error && data) {
        setRecords(data as MissRecord[]);
      }
    } catch (err) {
      console.warn('Error fetching Miss_Counter:', err);
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

  // Calculate Delta (Time Difference between both misses)
  const getDeltaInfo = () => {
    if (!waqasRecord?.Latest_at || !shajerRecord?.Latest_at) {
      return null;
    }
    const t1 = new Date(waqasRecord.Latest_at).getTime();
    const t2 = new Date(shajerRecord.Latest_at).getTime();
    if (isNaN(t1) || isNaN(t2)) return null;

    const diffMs = Math.abs(t1 - t2);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    const isSynced = diffMs <= 5 * 60 * 1000; // within 5 mins

    let formattedDiff = '';
    if (diffMin < 1) {
      formattedDiff = diffSec <= 5 ? 'within seconds of each other' : `just ${diffSec} seconds apart`;
    } else if (diffMin < 60) {
      formattedDiff = `${diffMin} ${diffMin === 1 ? 'min' : 'mins'} apart`;
    } else if (diffHrs < 24) {
      const remMin = diffMin % 60;
      formattedDiff = remMin > 0
        ? `${diffHrs} ${diffHrs === 1 ? 'hour' : 'hours'} ${remMin} ${remMin === 1 ? 'min' : 'mins'} apart`
        : `${diffHrs} ${diffHrs === 1 ? 'hour' : 'hours'} apart`;
    } else {
      const remHrs = diffHrs % 24;
      formattedDiff = remHrs > 0
        ? `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ${remHrs} ${remHrs === 1 ? 'hour' : 'hours'} apart`
        : `${diffDays} ${diffDays === 1 ? 'day' : 'days'} apart`;
    }

    return {
      diffMs,
      diffSec,
      diffMin,
      diffHrs,
      diffDays,
      isSynced,
      formattedDiff
    };
  };

  const delta = getDeltaInfo();

  // Trigger sync vibration when hearts are synced within 5 mins
  useEffect(() => {
    if (delta?.isSynced && !hasVibratedForSyncRef.current) {
      hapticSynced();
      hasVibratedForSyncRef.current = true;
    } else if (!delta?.isSynced) {
      hasVibratedForSyncRef.current = false;
    }
  }, [delta?.isSynced]);

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

    // Check if this tap is within 5 mins (for in-app sync animation) or 10 mins (for mutual miss notification)
    const otherLatest = isShajer ? waqasRecord?.Latest_at : shajerRecord?.Latest_at;
    let isMutualWithin10Mins = false;
    if (otherLatest) {
      const otherTime = new Date(otherLatest).getTime();
      const nowTime = new Date(nowIso).getTime();
      if (!isNaN(otherTime)) {
        const diffMs = Math.abs(nowTime - otherTime);
        if (diffMs <= 5 * 60 * 1000) {
          hapticSynced();
          hasVibratedForSyncRef.current = true;
        }
        if (diffMs <= 10 * 60 * 1000) {
          isMutualWithin10Mins = true;
        }
      }
    }

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

    // Send notification to all partner devices (excluding this triggering device)
    triggerPartnerMissNotification(currentUser, isMutualWithin10Mins).catch((err) => {
      console.warn('Notification dispatch error:', err);
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

  // Determine whether to display the special Synced Hearts view
  const isHeartSyncedMode = Boolean(delta?.isSynced && !showCircleOverride);

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
              <span className={`w-2.5 h-2.5 rounded-full ${delta?.isSynced ? 'bg-amber-300 animate-ping' : 'bg-rose-400 animate-pulse'}`} />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {delta?.isSynced ? '✨ Hearts Synchronized' : 'Our Shared Circle of Longing'}
              </span>
            </div>

            <div className="bg-black/50 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/95 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
              <span>Soul:</span>
              <span className="text-rose-300 font-bold">{deviceDetected || 'Ready'}</span>
            </div>
          </motion.div>

          {/* MAIN VISUAL: SYNCHRONIZED HEARTS OR RATIO CIRCLE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className={`shrink-0 w-full py-5 sm:py-6 rounded-3xl border flex flex-col items-center justify-center gap-4 relative overflow-hidden backdrop-blur-md shadow-xl transition-all duration-700 ${
              isHeartSyncedMode 
                ? 'bg-gradient-to-b from-rose-950/70 via-purple-950/70 to-amber-950/60 border-rose-400/50 shadow-[0_0_35px_rgba(244,63,94,0.3)]'
                : 'bg-black/45 border-white/15'
            }`}
          >
            {/* If Hearts Are Synced (within 5 mins) and not overridden: ILLUSTRATIVE TWO-HEART LIVE ECG RESONANCE */}
            {isHeartSyncedMode ? (
              <div className="flex flex-col items-center text-center px-3 sm:px-5 py-2 relative w-full">
                {/* Ambient Radial Pulsing Glow */}
                <motion.div 
                  className="absolute inset-0 bg-radial from-rose-500/25 via-amber-500/10 to-transparent pointer-events-none rounded-3xl"
                  animate={{ opacity: [0.55, 1, 0.55], scale: [0.96, 1.04, 0.96] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                />

                {/* Top Resonance Status Badge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: [1, 1.04, 1], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500/35 via-purple-500/35 to-amber-500/35 px-4 py-1.5 rounded-full border border-rose-300/60 shadow-[0_0_22px_rgba(244,63,94,0.45)] mb-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-100 uppercase shimmer-text">
                    ✨ TWO HEARTS IN PERFECT SYNC ✨
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                </motion.div>

                {/* Interactive SVG Illustration: Two Hearts Connected by a Live ECG Pulse Wave */}
                <div
                  role="button"
                  tabIndex={0}
                  title="Tap to feel your synchronized heartbeat"
                  onClick={(e) => {
                    hapticSynced();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
                    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
                    const burst = ['❤️', '💓', '✨', '🤍', '🥹'].map((emoji, idx) => ({
                      id: Date.now() + idx,
                      x: x + (Math.random() * 80 - 40),
                      y: y + (Math.random() * 30 - 15),
                      text: emoji
                    }));
                    setFloatingHearts((prev) => [...prev, ...burst]);
                    setTimeout(() => {
                      setFloatingHearts((prev) => prev.filter((item) => !burst.some((b) => b.id === item.id)));
                    }, 1500);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      hapticSynced();
                    }
                  }}
                  className="relative w-full max-w-[350px] sm:max-w-[390px] aspect-[360/176] flex items-center justify-center my-1 cursor-pointer select-none group"
                >
                  <svg
                    viewBox="0 0 360 176"
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      {/* Shajer Rose Heart Gradient */}
                      <linearGradient id="shajerHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE4E6" />
                        <stop offset="30%" stopColor="#FB7185" />
                        <stop offset="75%" stopColor="#E11D48" />
                        <stop offset="100%" stopColor="#9F1239" />
                      </linearGradient>

                      {/* Waqas Amber-Gold Heart Gradient */}
                      <linearGradient id="waqasHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FEF3C7" />
                        <stop offset="30%" stopColor="#FBBF24" />
                        <stop offset="75%" stopColor="#D97706" />
                        <stop offset="100%" stopColor="#92400E" />
                      </linearGradient>

                      {/* Shared ECG Lifeline Gradient (Rose -> Champagne White -> Gold) */}
                      <linearGradient id="ecgSyncGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FB7185" />
                        <stop offset="35%" stopColor="#FDA4AF" />
                        <stop offset="50%" stopColor="#FFFBEB" />
                        <stop offset="65%" stopColor="#FDE68A" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>

                      {/* Luminous Glow Filter */}
                      <filter id="syncGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>

                      {/* Soft Aura Blur */}
                      <filter id="softAura" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="10" />
                      </filter>
                    </defs>

                    {/* 1. Ambient Glowing Auras Behind Both Hearts & Center */}
                    <circle cx="62" cy="78" r="28" fill="#F43F5E" opacity="0.28" filter="url(#softAura)" />
                    <circle cx="180" cy="78" r="24" fill="#FBBF24" opacity="0.22" filter="url(#softAura)" />
                    <circle cx="298" cy="78" r="28" fill="#F59E0B" opacity="0.28" filter="url(#softAura)" />

                    {/* 2. Concentric Sonar Ripples Emitting from Both Hearts */}
                    <motion.circle
                      cx="62"
                      cy="78"
                      r="24"
                      fill="none"
                      stroke="#FB7185"
                      strokeWidth="1.5"
                      animate={{ scale: [0.85, 1.9], opacity: [0.7, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                      style={{ transformOrigin: '62px 78px' }}
                    />
                    <motion.circle
                      cx="298"
                      cy="78"
                      r="24"
                      fill="none"
                      stroke="#FBBF24"
                      strokeWidth="1.5"
                      animate={{ scale: [0.85, 1.9], opacity: [0.7, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                      style={{ transformOrigin: '298px 78px' }}
                    />
                    {/* Central Convergence Ripple */}
                    <motion.circle
                      cx="180"
                      cy="78"
                      r="16"
                      fill="none"
                      stroke="#FFFBEB"
                      strokeWidth="1.5"
                      animate={{ scale: [0.7, 2.2], opacity: [0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut", delay: 0.2 }}
                      style={{ transformOrigin: '180px 78px' }}
                    />

                    {/* 3. Delicate Upper & Lower Magnetic Soul Threads */}
                    <path
                      d="M 62 46 Q 180 10 298 46"
                      fill="none"
                      stroke="url(#ecgSyncGrad)"
                      strokeWidth="1"
                      strokeDasharray="3 5"
                      opacity="0.4"
                    />
                    <path
                      d="M 62 110 Q 180 144 298 110"
                      fill="none"
                      stroke="url(#ecgSyncGrad)"
                      strokeWidth="1"
                      strokeDasharray="3 5"
                      opacity="0.4"
                    />

                    {/* 4. Live ECG Heartbeat Wave Connecting Shajer (Left) and Waqas (Right) */}
                    {/* Faint Background ECG Track */}
                    <path
                      d="M 88 78 L 114 78 L 120 70 L 126 78 L 136 78 L 141 90 L 147 48 L 153 102 L 159 74 L 165 78 L 173 78 L 180 34 L 187 78 L 195 78 L 201 74 L 207 102 L 213 48 L 219 90 L 224 78 L 234 78 L 240 70 L 246 78 L 272 78"
                      fill="none"
                      stroke="url(#ecgSyncGrad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.32"
                    />

                    {/* Animated Glowing ECG Pulse Surge */}
                    <motion.path
                      d="M 88 78 L 114 78 L 120 70 L 126 78 L 136 78 L 141 90 L 147 48 L 153 102 L 159 74 L 165 78 L 173 78 L 180 34 L 187 78 L 195 78 L 201 74 L 207 102 L 213 48 L 219 90 L 224 78 L 234 78 L 240 70 L 246 78 L 272 78"
                      fill="none"
                      stroke="url(#ecgSyncGrad)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#syncGlow)"
                      initial={{ pathLength: 0, opacity: 0.4 }}
                      animate={{
                        pathLength: [0.15, 1, 0.15],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.6,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Traveling Pulse Sparks Meeting in the Center */}
                    <motion.circle
                      r="3.5"
                      fill="#FDA4AF"
                      filter="url(#syncGlow)"
                      animate={{
                        cx: [90, 180],
                        cy: [78, 78],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    />
                    <motion.circle
                      r="3.5"
                      fill="#FDE68A"
                      filter="url(#syncGlow)"
                      animate={{
                        cx: [270, 180],
                        cy: [78, 78],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    />

                    {/* 5. Center Convergence Node (Where Both Heartbeats Meet) */}
                    <motion.g
                      animate={{
                        scale: [1, 1.28, 1.08, 1.34, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                      style={{ transformOrigin: '180px 78px' }}
                    >
                      <circle
                        cx="180"
                        cy="78"
                        r="13"
                        fill="rgba(22, 5, 16, 0.85)"
                        stroke="url(#ecgSyncGrad)"
                        strokeWidth="1.8"
                        filter="url(#syncGlow)"
                      />
                      {/* Mini Merged Heart Inside Center Node */}
                      <path
                        d="M 180 84 C 180 84 173 79 173 74.5 C 173 72 175 70.5 177 70.5 C 178.5 70.5 179.5 71.5 180 72.5 C 180.5 71.5 181.5 70.5 183 70.5 C 185 70.5 187 72 187 74.5 C 187 79 180 84 180 84 Z"
                        fill="url(#ecgSyncGrad)"
                      />
                    </motion.g>

                    {/* Center Label Pill */}
                    <text
                      x="180"
                      y="19"
                      textAnchor="middle"
                      className="fill-amber-200/90 text-[9px] font-mono tracking-widest uppercase"
                    >
                      ONE SHARED RHYTHM
                    </text>

                    {/* 6. Left Sculpted Heart: SHAJER (Rose) */}
                    <motion.g
                      animate={{
                        scale: [1, 1.2, 1.05, 1.26, 1],
                        x: [0, 5, 2, 6, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                      style={{ transformOrigin: '62px 78px' }}
                    >
                      <path
                        d="M 62 103 C 62 103 34 85 34 65.5 C 34 54.5 42.5 47 52 47 C 57.5 47 60.5 50 62 53.5 C 63.5 50 66.5 47 72 47 C 81.5 47 90 54.5 90 65.5 C 90 85 62 103 62 103 Z"
                        fill="url(#shajerHeartGrad)"
                        stroke="#FFE4E6"
                        strokeWidth="1.5"
                        filter="url(#syncGlow)"
                      />
                      {/* Specular Inner Shine */}
                      <path
                        d="M 41 64 C 41 57 46 52 52 52"
                        fill="none"
                        stroke="rgba(255,255,255,0.65)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    {/* Shajer Label Below Left Heart */}
                    <text
                      x="62"
                      y="128"
                      textAnchor="middle"
                      className="fill-rose-200 text-[11px] font-bold tracking-widest uppercase"
                    >
                      SHAJER
                    </text>
                    <text
                      x="62"
                      y="141"
                      textAnchor="middle"
                      className="fill-rose-300/80 text-[9px] font-mono"
                    >
                      ♥ Beating Now
                    </text>

                    {/* 7. Right Sculpted Heart: WAQAS (Amber Gold) */}
                    <motion.g
                      animate={{
                        scale: [1, 1.2, 1.05, 1.26, 1],
                        x: [0, -5, -2, -6, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                      style={{ transformOrigin: '298px 78px' }}
                    >
                      <path
                        d="M 298 103 C 298 103 270 85 270 65.5 C 270 54.5 278.5 47 288 47 C 293.5 47 296.5 50 298 53.5 C 299.5 50 302.5 47 308 47 C 317.5 47 326 54.5 326 65.5 C 326 85 298 103 298 103 Z"
                        fill="url(#waqasHeartGrad)"
                        stroke="#FEF3C7"
                        strokeWidth="1.5"
                        filter="url(#syncGlow)"
                      />
                      {/* Specular Inner Shine */}
                      <path
                        d="M 277 64 C 277 57 282 52 288 52"
                        fill="none"
                        stroke="rgba(255,255,255,0.65)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </motion.g>

                    {/* Waqas Label Below Right Heart */}
                    <text
                      x="298"
                      y="128"
                      textAnchor="middle"
                      className="fill-amber-200 text-[11px] font-bold tracking-widest uppercase"
                    >
                      WAQAS
                    </text>
                    <text
                      x="298"
                      y="141"
                      textAnchor="middle"
                      className="fill-amber-300/80 text-[9px] font-mono"
                    >
                      ♥ Beating Now
                    </text>

                    {/* Bottom Sync Delta Caption Inside SVG */}
                    <text
                      x="180"
                      y="164"
                      textAnchor="middle"
                      className="fill-white/75 text-[10px] font-mono"
                    >
                      {delta ? `Connected ${delta.formattedDiff}` : 'Connected in the same breath'} • Tap to feel pulse
                    </text>
                  </svg>
                </div>

                {/* Subtitle & Romantic Declaration */}
                <h2 className="text-base sm:text-lg md:text-xl font-heading text-white font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mt-1">
                  You both missed each other almost simultaneously. ❤️
                </h2>
                <p className="text-xs sm:text-sm text-purple-200 font-sans mt-0.5 max-w-md">
                  Two souls across the distance, sending a heartbeat on the exact same lifeline.
                </p>

                {/* Total Misses Counter In Synced Mode */}
                <div className="mt-3 flex items-center gap-2 bg-black/60 px-4 py-1.5 rounded-full border border-rose-400/40 shadow-inner">
                  <HeartPulse className="w-4 h-4 text-rose-300 animate-pulse" />
                  <span className="text-sm font-extrabold text-white font-mono">{totalMisses}</span>
                  <span className="text-[11px] text-white/80 font-sans">total heartbeats recorded together</span>
                </div>

                {/* Switcher back to Ratio Circle view */}
                <button
                  type="button"
                  onClick={() => setShowCircleOverride(true)}
                  className="mt-3 text-[11px] text-white/60 hover:text-white underline underline-offset-4 font-mono transition-colors cursor-pointer"
                >
                  View Ratio Circle Outline ⟳
                </button>
              </div>
            ) : (
              /* The Unified SVG Circle View */
              <div className="relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
                <svg 
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 200 200"
                >
                  {/* SVG Definitions for Gradients and Glows */}
                  <defs>
                    <linearGradient id="waqasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>

                    <linearGradient id="shajerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F43F5E" />
                      <stop offset="100%" stopColor="#FB7185" />
                    </linearGradient>

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
            )}

            {/* If override is active and hearts are synced, show toggle back */}
            {delta?.isSynced && showCircleOverride && (
              <button
                type="button"
                onClick={() => setShowCircleOverride(false)}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline underline-offset-4 font-mono transition-colors cursor-pointer"
              >
                ✨ Show Synced Hearts Animation
              </button>
            )}

            {/* Bottom of the Circle: When Both Missed Each Other in IST + Time Difference Delta */}
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

              {/* NEW LINE: Time Difference Delta between both misses */}
              {delta ? (
                <div className={`mt-2 pt-2 border-t flex flex-col items-center justify-center gap-1 ${
                  delta.isSynced 
                    ? 'border-rose-400/40 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-amber-500/20 py-2 px-3 rounded-xl border'
                    : 'border-white/10'
                }`}>
                  {delta.isSynced ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-rose-200 font-semibold animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>✨ <strong>Hearts Synced!</strong> Both missed each other {delta.formattedDiff} (Almost simultaneously) ❤️</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-purple-200/90 font-mono">
                      <Clock className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                      <span>Time Difference: Both missed each other <strong>{delta.formattedDiff}</strong></span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-white/10 text-center text-[11px] text-white/50 font-mono">
                  Time Difference: Waiting for both to record a miss
                </div>
              )}
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
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  currentUser === 'Shajer'
                    ? 'bg-rose-500/40 text-white border border-rose-400/50 shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-400/60" />
                <span>Shajer</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  hapticTap('light');
                  setCurrentUser('Waqas');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  currentUser === 'Waqas'
                    ? 'bg-amber-500/40 text-white border border-amber-400/50 shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-400/60" />
                <span>Waqas</span>
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
              Currently logging miss as <strong className="text-rose-300">{currentUser}</strong> • Synchronized live between both souls
            </span>

            {/* Install App & Partner Notification Controls */}
            <div className="w-full pt-2.5 mt-1 border-t border-white/15">
              <PWAAndNotifyBar currentSoul={currentUser} />
            </div>
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
              &ldquo;No competition, no division — just two people bound within the same circle. When both of our hearts call out at once, time bends and distance disappears.&rdquo;
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
