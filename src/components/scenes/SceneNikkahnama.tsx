import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ScrollText, 
  Fingerprint, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  RotateCcw,
  Clock,
  Feather
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SceneNikkahnamaProps {
  onNext: () => void;
}

type UserRole = 'groom' | 'bride';

interface SignatureRecord {
  Nikkahnama_at: string;
  'Both Online'?: boolean | null;
}

export function SceneNikkahnama({ onNext }: SceneNikkahnamaProps) {
  // Role selection: groom (Waqas) or bride (Shajer)
  const [myRole, setMyRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nikkahnama_role');
      if (saved === 'groom' || saved === 'bride') return saved;
    }
    return 'groom';
  });

  // Online Presence & State
  const [onlineUsers, setOnlineUsers] = useState<{ groom: boolean; bride: boolean }>({
    groom: false,
    bride: false
  });
  const [isPartnerSimulated, setIsPartnerSimulated] = useState(false);

  // Fingerprint Pressing States (Local & Partner)
  const [isLocalPressed, setIsLocalPressed] = useState(false);
  const [isPartnerPressed, setIsPartnerPressed] = useState(false);

  // Synchronized Signing Progress (0 to 100)
  const [progress, setProgress] = useState(0);
  const [isSigning, setIsSigning] = useState(false);

  // Finalized / Existing Signature
  const [signedRecord, setSignedRecord] = useState<SignatureRecord | null>(null);
  const [showCeremonyMode, setShowCeremonyMode] = useState(false);

  const channelRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);

  const hapticTap = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'success') {
        navigator.vibrate([40, 80, 50, 100, 60, 200]);
      } else if (type === 'medium') {
        navigator.vibrate([25, 40, 25]);
      } else {
        navigator.vibrate([15, 20]);
      }
    }
  };

  // 1. Fetch existing signature on mount
  useEffect(() => {
    async function fetchLatestSignature() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('Nikkahnama_signatures')
          .select('*')
          .order('Nikkahnama_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          // If record has "Both Online" = true, or timestamp exists
          const latest = data[0];
          if (latest['Both Online'] === true) {
            setSignedRecord(latest);
          }
        }
      } catch (err) {
        console.warn('[Nikkahnama] Error fetching signature:', err);
      }
    }

    fetchLatestSignature();
  }, []);

  // 2. Realtime Presence & Broadcast Channel
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel('nikkahnama_ceremony_room', {
      config: {
        presence: {
          key: myRole
        }
      }
    });

    channelRef.current = channel;

    // Track presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const hasGroom = Boolean(state.groom && state.groom.length > 0);
        const hasBride = Boolean(state.bride && state.bride.length > 0);
        setOnlineUsers({
          groom: hasGroom || myRole === 'groom',
          bride: hasBride || myRole === 'bride'
        });
      })
      .on('broadcast', { event: 'fingerprint_touch' }, (event: any) => {
        const { role, isPressed } = event.payload || {};
        if (role !== myRole) {
          setIsPartnerPressed(Boolean(isPressed));
        }
      })
      .on('broadcast', { event: 'ceremony_sealed' }, (event: any) => {
        const { record } = event.payload || {};
        if (record) {
          setSignedRecord(record);
          hapticTap('success');
        }
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            role: myRole,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      channel.unsubscribe();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [myRole]);

  // Persist role
  const handleSelectRole = (role: UserRole) => {
    hapticTap('medium');
    setMyRole(role);
    localStorage.setItem('nikkahnama_role', role);
  };

  // Both are online if actually present or simulated for preview
  const bothOnline = (onlineUsers.groom && onlineUsers.bride) || isPartnerSimulated;

  // Determine active presses based on my role
  const groomPressed = myRole === 'groom' ? isLocalPressed : isPartnerPressed;
  const bridePressed = myRole === 'bride' ? isLocalPressed : isPartnerPressed;

  // 3. Dual Fingerprint Progress Logic
  const handleSealCeremony = useCallback(async () => {
    hapticTap('success');
    const newRecord: SignatureRecord = {
      Nikkahnama_at: new Date().toISOString(),
      'Both Online': true
    };

    setSignedRecord(newRecord);

    // Save to Supabase
    if (supabase) {
      try {
        await supabase
          .from('Nikkahnama_signatures')
          .insert([newRecord]);
      } catch (err) {
        console.warn('[Nikkahnama] Error logging signature to Supabase:', err);
      }
    }

    // Broadcast to partner
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'ceremony_sealed',
        payload: { record: newRecord }
      });
    }
  }, []);

  useEffect(() => {
    if (groomPressed && bridePressed && !signedRecord) {
      setIsSigning(true);
      const startTime = Date.now();
      const holdDuration = 2200; // 2.2 seconds hold

      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min(100, Math.floor((elapsed / holdDuration) * 100));
        setProgress(currentProgress);

        if (elapsed % 300 < 60) {
          hapticTap('light');
        }

        if (currentProgress >= 100) {
          clearInterval(progressTimerRef.current);
          setIsSigning(false);
          handleSealCeremony();
        }
      }, 50);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      setIsSigning(false);
      setProgress(0);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [groomPressed, bridePressed, signedRecord, handleSealCeremony]);

  // Handle local touch events
  const handleTouchStart = () => {
    hapticTap('medium');
    setIsLocalPressed(true);

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'fingerprint_touch',
        payload: { role: myRole, isPressed: true }
      });
    }
  };

  const handleTouchEnd = () => {
    setIsLocalPressed(false);

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'fingerprint_touch',
        payload: { role: myRole, isPressed: false }
      });
    }
  };

  const formattedSignedDate = useMemo(() => {
    if (!signedRecord?.Nikkahnama_at) return '';
    const date = new Date(signedRecord.Nikkahnama_at);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata',
      timeZoneName: 'short'
    }).format(date);
  }, [signedRecord]);

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div 
        className="glass-panel w-full p-3.5 sm:p-5 md:p-7 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <ScrollText className="w-96 h-96 text-white" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <ScrollText className="w-7 h-7 sm:w-8 sm:h-8 text-gold-light drop-shadow-[0_0_12px_rgba(232,180,200,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE NIKKAHNAMA
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            The Sacred Covenant of Eternal Love • Mithaqan Ghalidha
          </p>
        </motion.div>

        {/* Scrollable Document Body */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-2 custom-scrollbar scroll-smooth flex flex-col gap-3 sm:gap-4 py-1 touch-pan-y overscroll-contain relative z-10 text-left"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* ============================================================
              ROLE PICKER / ONLINE PRESENCE STATUS BAR
              ============================================================ */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
            {/* Role Buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center">
              <span className="text-[11px] text-white/75 font-sans font-medium mr-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gold-light" />
                I am:
              </span>
              <button
                type="button"
                onClick={() => handleSelectRole('groom')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  myRole === 'groom'
                    ? 'bg-gradient-to-r from-indigo-500/80 to-purple-600/80 text-white border border-purple-300/60 shadow-md font-semibold'
                    : 'bg-white/10 text-white/75 hover:bg-white/20 border border-white/15'
                }`}
              >
                Waqas (Groom)
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole('bride')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  myRole === 'bride'
                    ? 'bg-gradient-to-r from-pink-500/80 to-rose-600/80 text-white border border-rose-300/60 shadow-md font-semibold'
                    : 'bg-white/10 text-white/75 hover:bg-white/20 border border-white/15'
                }`}
              >
                Shajer (Bride)
              </button>
            </div>

            {/* Online Status Pill */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/20 text-[11px] font-sans">
                <span className={`w-2 h-2 rounded-full ${bothOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className={bothOnline ? 'text-emerald-200 font-medium' : 'text-amber-200'}>
                  {bothOnline ? 'Both Online & Ready to Sign' : '1 Online (Waiting for partner)'}
                </span>
              </div>

              {/* Simulation switch if partner not online yet */}
              {!bothOnline && (
                <button
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setIsPartnerSimulated(prev => !prev);
                  }}
                  className="text-[10px] text-gold-light underline hover:text-white transition-colors cursor-pointer"
                >
                  {isPartnerSimulated ? 'Exit Preview' : 'Enable Partner'}
                </button>
              )}
            </div>
          </div>

          {/* ============================================================
              THE NIKKAHNAMA WRITTEN SCRIPT
              ============================================================ */}
          <div className="rounded-3xl bg-white/10 border border-white/25 p-4 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col gap-3.5 relative overflow-hidden text-center">
            {/* Arabic Bismillah */}
            <div className="flex flex-col items-center">
              <p className="font-heading text-lg sm:text-2xl text-gold-light tracking-widest text-shadow-elegant">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[10px] sm:text-xs text-white/80 italic font-serif mt-0.5">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </div>

            {/* Title & Parties */}
            <div className="border-y border-white/15 py-2.5 flex items-center justify-around flex-wrap gap-2">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-purple-200 block font-semibold">
                  Al-Zawj (The Groom)
                </span>
                <span className="font-heading text-lg sm:text-xl text-white font-bold tracking-wide">
                  Waqas
                </span>
              </div>

              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20">
                <Heart className="w-4 h-4 text-rose-300 fill-rose-400" />
              </div>

              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-pink-200 block font-semibold">
                  Al-Zawjah (The Bride)
                </span>
                <span className="font-heading text-lg sm:text-xl text-white font-bold tracking-wide">
                  Shajer (Ruhi.. ❤️)
                </span>
              </div>
            </div>

            {/* The Solemn Articles of Covenant */}
            <div className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans space-y-2.5 text-left bg-black/25 p-3.5 sm:p-4 rounded-2xl border border-white/15">
              <div className="flex items-start gap-2">
                <span className="text-gold-light font-bold">I.</span>
                <p>
                  <strong className="text-amber-200">The Eternal Vow:</strong> &ldquo;i Choose you.. over everything.. ONLY YOU Hameshakeliye.. if life give me 1000 more time to relive i will choose you and thats a promise and i pray for it.. Inshallah..&rdquo;
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-gold-light font-bold">II.</span>
                <p>
                  <strong className="text-rose-200">The Sacred Acceptance:</strong> &ldquo;so do i... inshallah... we will pray for the same. Jaan bhi lagadun aap pe... bound together from this life till the gardens of Jannah.&rdquo;
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-gold-light font-bold">III.</span>
                <p>
                  <strong className="text-emerald-200">Mercy &amp; Companion:</strong> To wake each other for Fajr, to hold hands when the path gets steep, to listen with patience, and never to turn away without a reason.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================
              SIGNATURE STATE: SEALED CERTIFICATE VS DUAL SCANNER
              ============================================================ */}
          {signedRecord && !showCeremonyMode ? (
            /* ---------------- SEALED STATE ---------------- */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-gradient-to-br from-amber-500/20 via-rose-500/15 to-purple-500/20 border-2 border-amber-300/40 p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Golden Ambient Glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

              {/* Verified Wax Seal */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border-2 border-white/60 flex items-center justify-center text-zinc-950 shadow-[0_0_25px_rgba(251,191,36,0.6)] mb-2.5">
                <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-950 stroke-[2.5]" />
              </div>

              <span className="text-[11px] uppercase tracking-widest font-black text-amber-300 mb-0.5">
                SEALED IN HOLY COVENANT
              </span>
              <h3 className="text-xl sm:text-2xl font-heading text-white text-shadow-elegant tracking-wide">
                Nikkahnama Formally Signed
              </h3>

              {/* Timestamp Badge */}
              <div className="mt-2 px-4 py-2 rounded-2xl bg-black/50 border border-white/20 text-xs sm:text-sm text-white font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{formattedSignedDate || 'Signed & Captured Forever'}</span>
              </div>

              {/* Dual Digital Thumbprint Stamps */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
                <div className="p-3 rounded-2xl bg-white/10 border border-purple-400/30 flex flex-col items-center">
                  <Fingerprint className="w-8 h-8 text-emerald-400 mb-1" />
                  <span className="text-xs font-semibold text-white">Waqas</span>
                  <span className="text-[10px] text-emerald-300">Signed &amp; Sealed</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 border border-rose-400/30 flex flex-col items-center">
                  <Fingerprint className="w-8 h-8 text-rose-400 mb-1" />
                  <span className="text-xs font-semibold text-white">Shajer</span>
                  <span className="text-[10px] text-rose-300">Signed &amp; Sealed</span>
                </div>
              </div>

              {/* Re-enter ceremony mode toggle */}
              <button
                type="button"
                onClick={() => setShowCeremonyMode(true)}
                className="mt-4 text-[11px] text-gold-light hover:text-white underline transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Open Live Fingerprint Scanner</span>
              </button>
            </motion.div>
          ) : (
            /* ---------------- LIVE DUAL FINGERPRINT SCANNER ---------------- */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white/10 border border-white/25 p-4 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Instructions */}
              <div className="mb-3 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[11px] sm:text-xs text-white font-medium mb-1.5">
                  <Feather className="w-3.5 h-3.5 text-gold-light" />
                  <span>Dual Biometric Signing</span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 font-sans max-w-sm mx-auto">
                  {bothOnline 
                    ? 'Both of you are online! Place and hold your thumb on your designated scanner simultaneously to seal the Nikkahnama.'
                    : 'Place your thumb on the scanner. When your beloved touches theirs at the same time, the covenant will be sealed.'}
                </p>
              </div>

              {/* Dual Fingerprint Pads Display */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 w-full max-w-md my-2">
                
                {/* 1. Waqas (Groom) Pad */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    onTouchStart={myRole === 'groom' ? handleTouchStart : undefined}
                    onTouchEnd={myRole === 'groom' ? handleTouchEnd : undefined}
                    onMouseDown={myRole === 'groom' ? handleTouchStart : undefined}
                    onMouseUp={myRole === 'groom' ? handleTouchEnd : undefined}
                    onMouseLeave={myRole === 'groom' ? handleTouchEnd : undefined}
                    className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl flex flex-col items-center justify-center border-2 transition-all select-none ${
                      myRole === 'groom' ? 'cursor-pointer active:scale-95' : 'cursor-default'
                    } ${
                      groomPressed
                        ? 'bg-emerald-500/30 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.6)] scale-105'
                        : 'bg-black/40 border-white/25 hover:border-white/40'
                    }`}
                  >
                    <Fingerprint 
                      className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors ${
                        groomPressed ? 'text-emerald-300 animate-pulse' : 'text-white/60'
                      }`} 
                    />
                    <span className="text-[10px] sm:text-xs font-semibold text-white mt-1">
                      {groomPressed ? 'Holding...' : (myRole === 'groom' ? 'Hold Here' : 'Waqas')}
                    </span>

                    {/* Active Ripple */}
                    {groomPressed && (
                      <span className="absolute inset-0 rounded-3xl border-2 border-emerald-400 animate-ping pointer-events-none" />
                    )}
                  </div>
                  <span className="text-[11px] font-sans font-medium text-purple-200">
                    Waqas (Groom)
                  </span>
                </div>

                {/* Linking Pulse Aura */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/25 flex items-center justify-center transition-all ${
                    isSigning 
                      ? 'bg-amber-400 text-zinc-950 scale-125 shadow-[0_0_20px_rgba(251,191,36,0.8)]' 
                      : 'bg-white/10 text-white'
                  }`}>
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSigning ? 'fill-current animate-bounce' : 'text-rose-300'}`} />
                  </div>
                  <span className="text-[10px] font-mono text-white/70 mt-1">
                    {progress > 0 ? `${progress}%` : 'Link'}
                  </span>
                </div>

                {/* 2. Shajer (Bride) Pad */}
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    onTouchStart={myRole === 'bride' ? handleTouchStart : undefined}
                    onTouchEnd={myRole === 'bride' ? handleTouchEnd : undefined}
                    onMouseDown={myRole === 'bride' ? handleTouchStart : undefined}
                    onMouseUp={myRole === 'bride' ? handleTouchEnd : undefined}
                    onMouseLeave={myRole === 'bride' ? handleTouchEnd : undefined}
                    className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl flex flex-col items-center justify-center border-2 transition-all select-none ${
                      myRole === 'bride' ? 'cursor-pointer active:scale-95' : 'cursor-default'
                    } ${
                      bridePressed
                        ? 'bg-rose-500/30 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.6)] scale-105'
                        : 'bg-black/40 border-white/25 hover:border-white/40'
                    }`}
                  >
                    <Fingerprint 
                      className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors ${
                        bridePressed ? 'text-rose-300 animate-pulse' : 'text-white/60'
                      }`} 
                    />
                    <span className="text-[10px] sm:text-xs font-semibold text-white mt-1">
                      {bridePressed ? 'Holding...' : (myRole === 'bride' ? 'Hold Here' : 'Shajer')}
                    </span>

                    {/* Active Ripple */}
                    {bridePressed && (
                      <span className="absolute inset-0 rounded-3xl border-2 border-rose-400 animate-ping pointer-events-none" />
                    )}
                  </div>
                  <span className="text-[11px] font-sans font-medium text-pink-200">
                    Shajer (Bride)
                  </span>
                </div>

              </div>

              {/* Progress Bar when holding */}
              <div className="w-full max-w-xs mt-2">
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/15">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                <p className="text-[10px] text-white/70 font-mono mt-1 text-center">
                  {progress > 0 
                    ? `Sealing Covenant... ${progress}%` 
                    : 'Press and hold simultaneously for 2 seconds'}
                </p>
              </div>

              {signedRecord && (
                <button
                  type="button"
                  onClick={() => setShowCeremonyMode(false)}
                  className="mt-3 text-[11px] text-white/70 hover:text-white underline transition-colors cursor-pointer"
                >
                  View Signed Certificate
                </button>
              )}
            </motion.div>
          )}

        </div>

        {/* ============================================================
            BOTTOM ACTIONS: CONTINUE TO PROMISE
            ============================================================ */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-2 border-t border-white/10 relative z-10"
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
    </div>
  );
}
