import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Fingerprint,
  Heart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Infinity as InfinityIcon,
  Lock,
  Clock,
  UserCheck,
  FileSignature,
  HeartHandshake,
  Droplets
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BackButton } from '../BackButton';

interface SceneContractProps {
  onNext: () => void;
  onBack?: () => void;
}

interface ContractSignatureRecord {
  name: string;
  role: boolean;
  created_at: string;
}

export function SceneContract({ onNext, onBack }: SceneContractProps) {
  const [signatures, setSignatures] = useState<ContractSignatureRecord[]>([]);
  const [loadingSignatures, setLoadingSignatures] = useState(true);
  const [signingName, setSigningName] = useState<'Waqas' | 'Shajer'>('Shajer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPressingFinger, setIsPressingFinger] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [justSignedName, setJustSignedName] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const holdIntervalRef = useRef<number | null>(null);

  const hapticTap = (type: 'light' | 'heart' | 'sign' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'sign') {
        navigator.vibrate([35, 60, 45, 100]);
      } else if (type === 'heart') {
        navigator.vibrate([20, 40, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  // Fetch signatures from Supabase Contract_signatures table
  const loadSignatures = async () => {
    try {
      setLoadingSignatures(true);
      const { data, error } = await supabase
        .from('Contract_signatures')
        .select('name, role, created_at')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setSignatures(data as ContractSignatureRecord[]);
        const hasShajer = data.some(
          (s: any) => s.name?.toLowerCase().includes('shajer') || s.role === false
        );
        const hasWaqas = data.some(
          (s: any) => s.name?.toLowerCase().includes('waqas') || s.role === true
        );
        // Automatically select whoever hasn't signed yet
        if (hasShajer && !hasWaqas) {
          setSigningName('Waqas');
        } else if (!hasShajer) {
          setSigningName('Shajer');
        }
      }
    } catch (err) {
      console.warn('Failed to fetch contract signatures:', err);
    } finally {
      setLoadingSignatures(false);
    }
  };

  useEffect(() => {
    loadSignatures();
    return () => {
      if (holdIntervalRef.current) {
        window.clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  const waqasSig = signatures.find(
    (s) => s.name?.toLowerCase().includes('waqas') || s.role === true
  );
  const shajerSig = signatures.find(
    (s) => s.name?.toLowerCase().includes('shajer') || s.role === false
  );
  const isBothSigned = Boolean(waqasSig && shajerSig);
  const currentSelectedSig = signingName === 'Waqas' ? waqasSig : shajerSig;

  const handleSign = async (nameToSign: 'Waqas' | 'Shajer') => {
    // Strictly one-time activity per person
    const alreadySigned = nameToSign === 'Waqas' ? waqasSig : shajerSig;
    if (isSubmitting || alreadySigned) return;

    hapticTap('sign');
    setIsSubmitting(true);
    setJustSignedName(nameToSign);

    const role = nameToSign === 'Waqas'; // True = Waqas, False = Shajer
    const nowIso = new Date().toISOString();

    const newRecord: ContractSignatureRecord = {
      name: nameToSign,
      role: role,
      created_at: nowIso
    };

    // Optimistic UI update (one-time lock)
    setSignatures((prev) => {
      const exists = prev.some(
        (s) => s.name?.toLowerCase() === nameToSign.toLowerCase() || s.role === role
      );
      if (exists) return prev;
      return [...prev, newRecord];
    });

    try {
      const { error } = await supabase
        .from('Contract_signatures')
        .insert([
          {
            name: nameToSign,
            role: role,
            created_at: nowIso
          }
        ]);

      if (error) {
        console.warn('Error saving contract signature to Supabase:', error.message);
      } else {
        await loadSignatures();
      }
    } catch (err) {
      console.warn('Contract signature insert failed:', err);
    } finally {
      setIsSubmitting(false);
      setIsPressingFinger(false);
      setScanProgress(0);
      // Automatically switch tab to the other person if they haven't signed yet
      if (nameToSign === 'Shajer' && !waqasSig) {
        setSigningName('Waqas');
      } else if (nameToSign === 'Waqas' && !shajerSig) {
        setSigningName('Shajer');
      }
      setTimeout(() => setJustSignedName(null), 3500);
    }
  };

  // Biometric finger placement handler (supports both press-and-hold and quick touch/tap)
  const startFingerPress = () => {
    if (isSubmitting || currentSelectedSig) return;
    setIsPressingFinger(true);
    setScanProgress(20);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    if (holdIntervalRef.current) {
      window.clearInterval(holdIntervalRef.current);
    }

    let current = 20;
    holdIntervalRef.current = window.setInterval(() => {
      current += 20;
      if (current >= 100) {
        if (holdIntervalRef.current) {
          window.clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
        }
        setScanProgress(100);
        handleSign(signingName);
      } else {
        setScanProgress(current);
      }
    }, 110);
  };

  const endFingerPress = () => {
    if (holdIntervalRef.current) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    // If they tapped/touched the fingerprint sensor directly, complete the signature seamlessly
    if (isPressingFinger && !currentSelectedSig && !isSubmitting) {
      setScanProgress(100);
      handleSign(signingName);
    } else {
      setIsPressingFinger(false);
      setScanProgress(0);
    }
  };

  const triggerHeartBurst = (e: React.MouseEvent) => {
    hapticTap('heart');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItems = Array.from({ length: 5 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: x + (Math.random() * 50 - 25),
      y: y + (Math.random() * 30 - 15)
    }));

    setFloatingHearts((prev) => [...prev, ...newItems]);
    setLiked((prev) => !prev);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 1500);
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return 'Awaiting Finger Seal';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 h-full my-auto">
      <div className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden">
        <BackButton onBack={onBack} />

        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <FileSignature className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <FileSignature className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE CONTRACT
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Never Give Up On Each Other • 15 Nov, 11:00 AM
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
            className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5 shrink-0"
          >
            <div className="inline-flex items-center gap-2 bg-rose-500/25 px-3 py-1.5 rounded-full border border-rose-400/50 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                15 Nov 2026 • 11:00 AM
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/20 text-[11px] sm:text-xs text-rose-100 font-medium">
              <Lock className="w-3.5 h-3.5 text-gold-light" />
              <span>0.00001% Risk = Zero Tolerance</span>
            </div>
          </motion.div>

          {/* The Moment at 11:00 AM — Gentle Summary Without Harshly Repeating the Forbidden Word */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/45 via-black/55 to-purple-950/45 border border-rose-400/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2">
              <Droplets className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                The Word That Brought Tears at 11:00 AM
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              During our morning conversation at <span className="text-rose-200 font-semibold">11:00 AM on 15 November</span>, Waqas gently asked that the private words and moments shared between us remain our sacred secret — never disclosed even to parents.
            </p>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              When Shajer innocently asked why — <span className="italic text-rose-100">&ldquo;What could possibly happen?&rdquo;</span> — Waqas named the one heavy, unthinkable consequence of parting ways: <span className="underline decoration-rose-400/60 underline-offset-4 text-rose-200 font-medium">that single dreaded word of separation</span> a heart in love should never have to hear.
            </p>

            <div className="p-3.5 rounded-xl bg-white/10 border border-rose-300/25 text-xs sm:text-sm text-purple-100 font-serif italic text-center leading-relaxed">
              &ldquo;She couldn&apos;t bear even the sound of that word. Her breath caught, her heart overwhelmed with emotion, and silent tears welled up in her eyes — because in her world, losing us was never even a word that existed.&rdquo;
            </div>
          </motion.div>

          {/* Two Hearts, Two Perspectives */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full shrink-0"
          >
            {/* Shajer's Perspective */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/45 to-black/60 border border-rose-400/35 flex flex-col gap-2 backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-2 text-rose-200 text-xs sm:text-sm font-bold">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
                  <span>Shajer&apos;s Perspective</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-300/30 text-rose-200">
                  Her Tears 🤍
                </span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                &ldquo;How could he utter such a heavy, unbearable word over something so small as this?&rdquo; For a heart so deeply and purely attached, even hearing the word for parting felt like a storm she never wanted to imagine.
              </p>
            </div>

            {/* Waqas's Perspective */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/45 to-black/60 border border-amber-300/35 flex flex-col gap-2 backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <div className="flex items-center gap-2 text-gold-light text-xs sm:text-sm font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Waqas&apos;s Perspective</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-300/30 text-amber-200">
                  0.00001% Guard 🛡️
                </span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                Privacy in a relationship is the sacred key to a forever bond. Waqas didn&apos;t want even a <span className="text-amber-200 font-semibold">0.00001% chance</span> of anything ever ruining what they have — he only spoke that feared word so she would realize just how unimaginably precious she is to him.
              </p>
            </div>
          </motion.div>

          {/* The Sacred Clauses of Our Contract */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="shrink-0 w-full bg-black/50 border border-white/15 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2">
              <HeartHandshake className="w-4 h-4 text-gold-light shrink-0" />
              <span className="text-xs sm:text-sm text-white font-bold tracking-wide">
                The Unbreakable Terms of Our Forever Contract
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-white/90">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <InfinityIcon className="w-3.5 h-3.5 shrink-0" />
                  I. Never Give Up
                </span>
                <p className="text-[11px] sm:text-xs text-white/85 leading-relaxed">
                  No matter what misunderstanding, fear, or test comes our way, walking away is permanently erased from our destiny.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                <span className="font-bold text-amber-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  II. Sacred Privacy
                </span>
                <p className="text-[11px] sm:text-xs text-white/85 leading-relaxed">
                  What belongs to Waqas and Shajer stays guarded between our two hearts — protecting our peace from even a 0.00001% shadow.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                <span className="font-bold text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  III. Banished Forever
                </span>
                <p className="text-[11px] sm:text-xs text-white/85 leading-relaxed">
                  That heavy word that brought tears to her eyes at 11:00 AM is banished forever — replaced only by patience, reassurance, and eternity.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive One-Time Fingerprint Contract Signing Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-br from-purple-950/45 via-black/65 to-rose-950/45 border border-rose-300/45 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col gap-3.5"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-300" />
                <span className="text-xs sm:text-sm text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Sign The Contract • Never Give Up On Each Other
                </span>
              </div>
              <span className="text-[11px] text-white/75 font-mono">
                {isBothSigned ? 'Contract Sealed Forever 💍' : 'One-Time Finger Seal'}
              </span>
            </div>

            {/* Selector & Finger Scanner when at least one person hasn't signed */}
            {!isBothSigned ? (
              <>
                {/* Choose Who Is Placing Their Finger */}
                <div className="flex items-center justify-center gap-2 p-1 bg-black/40 rounded-xl border border-white/15">
                  <button
                    type="button"
                    onClick={() => {
                      hapticTap('light');
                      setSigningName('Shajer');
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      signingName === 'Shajer'
                        ? 'bg-rose-500/40 text-white shadow border border-rose-400/50'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Shajer {shajerSig ? '✓ (Signed)' : ''}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      hapticTap('light');
                      setSigningName('Waqas');
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      signingName === 'Waqas'
                        ? 'bg-rose-500/40 text-white shadow border border-rose-400/50'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Waqas {waqasSig ? '✓ (Signed)' : ''}</span>
                  </button>
                </div>

                {/* If currently selected person already signed (one-time activity), show their locked timestamp */}
                {currentSelectedSig ? (
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-center flex flex-col items-center gap-1.5">
                    <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>{signingName}&apos;s Fingerprint Is Permanently Sealed</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-white/90 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Signed on {formatTimestamp(currentSelectedSig.created_at)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setSigningName(signingName === 'Shajer' ? 'Waqas' : 'Shajer')}
                      className="mt-1 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[11px] text-rose-200 border border-white/20 transition-all cursor-pointer"
                    >
                      Switch to {signingName === 'Shajer' ? 'Waqas' : 'Shajer'} to Sign →
                    </button>
                  </div>
                ) : (
                  /* Place Finger on Screen Pad */
                  <div className="flex flex-col items-center justify-center py-2.5 sm:py-3.5 select-none">
                    <motion.button
                      type="button"
                      onMouseDown={startFingerPress}
                      onMouseUp={endFingerPress}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        startFingerPress();
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        endFingerPress();
                      }}
                      onClick={() => {
                        if (!isPressingFinger && !isSubmitting && !currentSelectedSig) {
                          handleSign(signingName);
                        }
                      }}
                      disabled={isSubmitting || loadingSignatures}
                      className={`relative p-6 sm:p-7 rounded-full border-2 transition-all cursor-pointer group flex items-center justify-center select-none ${
                        isPressingFinger || isSubmitting
                          ? 'border-amber-300 bg-rose-500/30 scale-95 shadow-[0_0_35px_rgba(251,191,36,0.55)]'
                          : 'border-rose-400/60 bg-rose-500/15 hover:bg-rose-500/25 shadow-[0_0_28px_rgba(244,63,94,0.35)]'
                      }`}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.94 }}
                      aria-label={`Place finger on screen to sign contract as ${signingName}`}
                    >
                      <Fingerprint
                        className={`w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-300 ${
                          isPressingFinger || isSubmitting
                            ? 'text-amber-200 scale-110 drop-shadow-[0_0_16px_rgba(251,191,36,0.9)] animate-pulse'
                            : 'text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.75)] group-hover:scale-105'
                        }`}
                      />

                      {/* Animated Biometric Pulse Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-rose-300/65 pointer-events-none"
                        animate={{ scale: [1, 1.26, 1], opacity: [0.85, 0, 0.85] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                      />

                      {/* Scanning Progress Ring Indicator */}
                      {scanProgress > 0 && (
                        <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-amber-400/90 text-black font-mono text-[10px] font-bold shadow">
                          {scanProgress}%
                        </span>
                      )}
                    </motion.button>

                    <span className="text-xs sm:text-sm font-semibold text-white/95 mt-3">
                      {isSubmitting
                        ? `Capturing ${signingName}'s Finger Seal...`
                        : `Place ${signingName}'s Finger Here to Sign`}
                    </span>
                    <span className="text-[11px] text-white/65 font-mono mt-0.5 text-center">
                      One-time eternal signature • Captures exact date &amp; time forever
                    </span>
                  </div>
                )}
              </>
            ) : (
              /* Both Signed Banner: One-Time Activity Complete */
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-center flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Contract Irrevocably Signed &amp; Sealed by Both Souls 💍</span>
                </div>
                <p className="text-[11px] text-purple-100/90 font-serif italic">
                  We have promised never to give up on each other — etched forever with our fingerprints.
                </p>
              </div>
            )}

            {/* Permanent Signature & Timestamp Cards for Shajer (Role: false) & Waqas (Role: true) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
              {/* Shajer's Signature Card */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all ${
                  shajerSig
                    ? 'bg-rose-950/35 border-rose-400/55 shadow-[0_0_15px_rgba(244,63,94,0.22)]'
                    : 'bg-black/30 border-white/10 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                    <Fingerprint
                      className={`w-4 h-4 ${shajerSig ? 'text-rose-400' : 'text-white/40'}`}
                    />
                    <span>Shajer</span>
                  </div>
                  {shajerSig ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Signed
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/50 font-mono">Awaiting Finger</span>
                  )}
                </div>
                <div className="text-[11px] text-white/85 font-mono flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-rose-300/80 shrink-0" />
                  <span>{formatTimestamp(shajerSig?.created_at)}</span>
                </div>
              </div>

              {/* Waqas's Signature Card */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all ${
                  waqasSig
                    ? 'bg-rose-950/35 border-rose-400/55 shadow-[0_0_15px_rgba(244,63,94,0.22)]'
                    : 'bg-black/30 border-white/10 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                    <Fingerprint
                      className={`w-4 h-4 ${waqasSig ? 'text-rose-400' : 'text-white/40'}`}
                    />
                    <span>Waqas</span>
                  </div>
                  {waqasSig ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Signed
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/50 font-mono">Awaiting Finger</span>
                  )}
                </div>
                <div className="text-[11px] text-white/85 font-mono flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-rose-300/80 shrink-0" />
                  <span>{formatTimestamp(waqasSig?.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Just Signed Toast */}
            <AnimatePresence>
              {justSignedName && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs text-center font-medium flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {justSignedName}&apos;s finger seal &amp; timestamp permanently recorded in our Contract! 💍🤍
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Closing Poetic Covenant Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-purple-500/20 via-rose-500/15 to-purple-500/20 border border-purple-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Not Even a 0.00001% Chance of Parting
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;Forgive the heavy word that made your eyes glisten at 11:00 AM, my Jaan. It only slipped out because a world without you is my greatest fear. From this moment on, we are bound by this Contract — to protect our privacy, wipe every tear before it falls, and never give up on each other till our very last breath.&rdquo;
            </p>

            <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={triggerHeartBurst}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  liked
                    ? 'bg-rose-500/40 text-rose-100 border border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] font-medium'
                    : 'bg-white/15 hover:bg-white/20 text-white border border-white/25'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{liked ? 'Bound Together Forever 💍🤍' : 'Seal this vow in our hearts'}</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Hearts Effect */}
        {floatingHearts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.8, y: -70 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute pointer-events-none z-50 text-rose-400"
            style={{ left: item.x, top: item.y }}
          >
            <Heart className="w-7 h-7 fill-rose-400" />
          </motion.div>
        ))}

        {/* Bottom Navigation: Continue to Promise */}
        <motion.div
          className="shrink-0 mt-2 sm:mt-3 pt-1 border-t border-white/10 relative z-10"
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
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255,255,255,0.4)' }}
            whileTap={{ scale: 0.98, boxShadow: '0 0 40px rgba(255,255,255,0.8)' }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
