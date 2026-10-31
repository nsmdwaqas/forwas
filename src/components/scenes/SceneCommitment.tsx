import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Fingerprint, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Infinity as InfinityIcon,
  Flame,
  Clock,
  UserCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SceneCommitmentProps {
  onNext: () => void;
}

interface SignatureRecord {
  name: string;
  role: boolean;
  created_at: string;
}

export function SceneCommitment({ onNext }: SceneCommitmentProps) {
  const [signatures, setSignatures] = useState<SignatureRecord[]>([]);
  const [loadingSignatures, setLoadingSignatures] = useState(true);
  const [signingName, setSigningName] = useState<'Waqas' | 'Shajer'>('Shajer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSignedName, setJustSignedName] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const hapticTap = (type: 'light' | 'heart' | 'sign' = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'sign') {
        navigator.vibrate([30, 60, 40, 90]);
      } else if (type === 'heart') {
        navigator.vibrate([20, 40, 30, 60]);
      } else {
        navigator.vibrate([15, 30, 15]);
      }
    }
  };

  // Fetch signatures from Supabase
  const loadSignatures = async () => {
    try {
      setLoadingSignatures(true);
      const { data, error } = await supabase
        .from('Commitment_signatures')
        .select('name, role, created_at')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSignatures(data as SignatureRecord[]);
        // Shajer is default; if Shajer has already signed and Waqas has not, switch to Waqas
        const hasShajer = data.some((s: any) => s.name?.toLowerCase().includes('shajer'));
        const hasWaqas = data.some((s: any) => s.name?.toLowerCase().includes('waqas'));
        if (hasShajer && !hasWaqas) {
          setSigningName('Waqas');
        } else {
          setSigningName('Shajer');
        }
      }
    } catch (err) {
      console.warn('Failed to fetch commitment signatures:', err);
    } finally {
      setLoadingSignatures(false);
    }
  };

  useEffect(() => {
    loadSignatures();
  }, []);

  const waqasSig = signatures.find(s => s.name?.toLowerCase().includes('waqas'));
  const shajerSig = signatures.find(s => s.name?.toLowerCase().includes('shajer'));
  const isBothSigned = Boolean(waqasSig && shajerSig);

  const handleSign = async (nameToSign: 'Waqas' | 'Shajer') => {
    if (isSubmitting) return;
    hapticTap('sign');
    setIsSubmitting(true);
    setJustSignedName(nameToSign);

    const role = nameToSign === 'Waqas';
    const nowIso = new Date().toISOString();

    const newRecord: SignatureRecord = {
      name: nameToSign,
      role: role,
      created_at: nowIso
    };

    // Optimistic UI update
    setSignatures(prev => {
      const filtered = prev.filter(s => !s.name.toLowerCase().includes(nameToSign.toLowerCase()));
      return [newRecord, ...filtered];
    });

    try {
      const { error } = await supabase
        .from('Commitment_signatures')
        .insert([{
          name: nameToSign,
          role: role,
          created_at: nowIso
        }]);

      if (error) {
        console.warn('Error saving signature to Supabase:', error.message);
      } else {
        // Refresh from server to ensure accurate DB state
        await loadSignatures();
      }
    } catch (err) {
      console.warn('Signature insert failed:', err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setJustSignedName(null), 3000);
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

    setFloatingHearts(prev => [...prev, ...newItems]);
    setLiked(prev => !prev);

    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(item => !newItems.some(n => n.id === item.id)));
    }, 1500);
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return 'Pending Signature';
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
      <div 
        className="glass-panel w-full p-3.5 sm:p-5 md:p-8 relative flex flex-col h-[90vh] sm:h-[86vh] max-h-[92vh] overflow-hidden"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Fingerprint className="w-80 h-80 text-rose-400" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center shrink-0 mb-2 sm:mb-3 relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-1">
            <Fingerprint className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </motion.div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            THE COMMITMENT
          </h1>
          <p className="font-heading italic text-white/95 text-xs sm:text-sm mt-0.5 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Our Sacred Pact • One Soul Across All Odds
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
            className="flex items-center justify-start border-b border-white/15 pb-2.5 shrink-0"
          >
            <div className="inline-flex items-center gap-2 bg-rose-500/25 px-3 py-1.5 rounded-full border border-rose-400/50 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Our Eternal Oath • 31 Oct 2026
              </span>
            </div>
          </motion.div>

          {/* The Real Story & Heartfelt Rationale Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="shrink-0 w-full bg-gradient-to-br from-rose-950/40 via-black/50 to-purple-950/40 border border-rose-400/25 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-white/15 pb-2">
              <Heart className="w-4 h-4 text-rose-300 shrink-0 fill-rose-300" />
              <span className="text-xs sm:text-sm text-rose-200 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Why This Commitment Was Born
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans">
              On 31 October 2026, after a long day of storms and misunderstandings, peace returned to us. But in that quiet reconciliation, you whispered something that shook my soul: that if something hurts, you would either forgive it or lock it away inside your heart.
            </p>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-purple-100 font-serif italic text-center leading-relaxed">
              &ldquo;I cannot bear the thought of you suffering in silence. In this love, you will never have to bury a wound alone. We are not two separate strangers guarding our feelings — we are One Soul in two bodies.&rdquo;
            </div>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
              Whenever something aches, we heal it together. In our story, vulnerability is safe, truth is cherished, and pain is shared before it ever becomes a scar.
            </p>
          </motion.div>

          {/* The Two Eternal Truths */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full shrink-0"
          >
            <div className="p-4 rounded-2xl bg-black/50 border border-rose-400/30 flex flex-col gap-2 backdrop-blur-md">
              <div className="flex items-center gap-2 text-rose-300 text-xs sm:text-sm font-bold">
                <InfinityIcon className="w-4 h-4 text-rose-300 shrink-0" />
                <span>1. First &amp; Last Love</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                I will be your very first and absolute last love — and you will forever be mine. No matter what trials come, no matter the distance or years, our love begins and ends only with each other.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-rose-400/30 flex flex-col gap-2 backdrop-blur-md">
              <div className="flex items-center gap-2 text-gold-light text-xs sm:text-sm font-bold">
                <Flame className="w-4 h-4 text-amber-300 shrink-0" />
                <span>2. Nothing Matters But You</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                Neither the past, nor petty pride, nor the noise of the outside world holds any weight. Nothing in this universe matters more than you, me, and the sacred bond we protect together.
              </p>
            </div>
          </motion.div>

          {/* Interactive Fingerprint Signing Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-br from-purple-950/40 via-black/60 to-rose-950/40 border border-rose-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-col gap-3.5"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-rose-300" />
                <span className="text-xs sm:text-sm text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  The Solemn Fingerprint Seal
                </span>
              </div>
              <span className="text-[11px] text-white/70 font-mono">
                {isBothSigned ? "Both Sealed 💍" : "Touch to Sign"}
              </span>
            </div>

            {/* When NOT both signed: show selector and stamp pad */}
            {!isBothSigned ? (
              <>
                {/* Selector: Choose Who Is Signing (Shajer by default, then Waqas) */}
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
                    <span>Shajer {shajerSig ? '✓' : ''}</span>
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
                    <span>Waqas {waqasSig ? '✓' : ''}</span>
                  </button>
                </div>

                {/* Fingerprint Interactive Pad */}
                <div className="flex flex-col items-center justify-center py-2 sm:py-3">
                  <motion.button
                    type="button"
                    onClick={() => handleSign(signingName)}
                    disabled={isSubmitting}
                    className="relative p-5 sm:p-6 rounded-full border-2 border-rose-400/50 bg-rose-500/10 hover:bg-rose-500/25 active:scale-95 transition-all shadow-[0_0_25px_rgba(244,63,94,0.3)] cursor-pointer group flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Place thumbprint to sign as ${signingName}`}
                  >
                    <Fingerprint className={`w-14 h-14 sm:w-16 sm:h-16 text-rose-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.7)] group-hover:scale-110 transition-transform ${
                      isSubmitting ? 'animate-pulse text-amber-300' : ''
                    }`} />

                    {/* Animated Scanner Ring */}
                    <motion.div 
                      className="absolute inset-0 rounded-full border border-rose-300/60 pointer-events-none"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    />
                  </motion.button>

                  <span className="text-xs sm:text-sm font-medium text-white/90 mt-2.5">
                    {isSubmitting 
                      ? `Sealing ${signingName}'s thumbprint...`
                      : `Tap to Stamp & Sign as ${signingName}`
                    }
                  </span>
                  <span className="text-[11px] text-white/60 font-mono mt-0.5">
                    Saved permanently into our commitment registry
                  </span>
                </div>
              </>
            ) : (
              /* When both signed: Clean sealed confirmation banner (No Tap to Stamp) */
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-center flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Solemnly Signed &amp; Sealed by Both Souls 💍</span>
                </div>
                <p className="text-[11px] text-purple-100/90 font-serif italic">
                  Two hearts bound in one eternal covenant — recorded forever.
                </p>
              </div>
            )}

            {/* Live Signatures Showcase Cards (Shajer & Waqas with Name, Sealed status & Date/Time stamp) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
              {/* Shajer's Seal */}
              <div className={`p-3.5 rounded-xl border flex flex-col gap-1 transition-all ${
                shajerSig 
                  ? 'bg-rose-950/30 border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'bg-black/30 border-white/10 opacity-70'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                    <Fingerprint className={`w-4 h-4 ${shajerSig ? 'text-rose-400' : 'text-white/40'}`} />
                    <span>Shajer</span>
                  </div>
                  {shajerSig ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Sealed
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/50 font-mono">Awaiting Seal</span>
                  )}
                </div>
                <div className="text-[11px] text-white/80 font-mono flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-white/50 shrink-0" />
                  <span>{formatTimestamp(shajerSig?.created_at)}</span>
                </div>
              </div>

              {/* Waqas's Seal */}
              <div className={`p-3.5 rounded-xl border flex flex-col gap-1 transition-all ${
                waqasSig 
                  ? 'bg-rose-950/30 border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'bg-black/30 border-white/10 opacity-70'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                    <Fingerprint className={`w-4 h-4 ${waqasSig ? 'text-rose-400' : 'text-white/40'}`} />
                    <span>Waqas</span>
                  </div>
                  {waqasSig ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Sealed
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/50 font-mono">Awaiting Seal</span>
                  )}
                </div>
                <div className="text-[11px] text-white/80 font-mono flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-white/50 shrink-0" />
                  <span>{formatTimestamp(waqasSig?.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Just Signed Success Banner */}
            <AnimatePresence>
              {justSignedName && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs text-center font-medium flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{justSignedName}&apos;s thumbprint successfully etched into the registry! 💍🤍</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Poetic & Interactive Vow Reaction Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="shrink-0 w-full bg-gradient-to-r from-purple-500/20 via-rose-500/15 to-purple-500/20 border border-purple-300/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg text-center"
          >
            <h3 className="font-heading text-white text-base sm:text-lg mb-1 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Two Bodies, One Inseparable Soul
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-lg mx-auto italic font-serif">
              &ldquo;This commitment is not written on passing paper, but in the beat of our hearts. Never keep hurt inside. Let every tear, every laugh, and every whispered thought belong to both of us — forever and always.&rdquo;
            </p>

            {/* Interactive Vow Reaction */}
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
                <span>{liked ? 'Our Eternal Vow 🕊️💍' : 'Hold this commitment'}</span>
              </button>
            </div>
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
