import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Feather, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SceneLovenamaProps {
  onNext: () => void;
}

const SignatureBlock = ({ title, role }: { title: string; role: 'me' | 'you' }) => {
  const fixedName = role === 'me' ? 'Waqas' : 'Shajer';
  const [momentText, setMomentText] = useState('');
  const [signed, setSigned] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // 1. Fetch signature on load if it already exists, and subscribe to real-time updates
  useEffect(() => {
    let isMounted = true;

    // Load from local cache first for zero-latency UI
    try {
      const cached = localStorage.getItem(`lovenama_sig_${fixedName}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.moment) {
          setMomentText(parsed.moment);
          if (parsed.timestamp) setTimestamp(parsed.timestamp);
          setSigned(true);
        }
      }
    } catch {
      // ignore storage error
    }

    const loadSignature = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('lovenama_signatures')
          .select('*')
          .eq('name', fixedName)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching signature:", error);
          return;
        }

        if (data && isMounted) {
          setMomentText(data.moment || '');
          
          let dateStr = '';
          if (data.created_at) {
            const dateObj = new Date(data.created_at);
            dateStr = dateObj.toLocaleString('en-US', { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            });
            setTimestamp(dateStr);
          }
          setSigned(true);

          try {
            localStorage.setItem(`lovenama_sig_${fixedName}`, JSON.stringify({
              moment: data.moment,
              timestamp: dateStr
            }));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error("Failed to load signature from Supabase:", err);
      }
    };

    loadSignature();

    // Setup realtime subscription
    let channel: any = null;
    if (supabase) {
      try {
        channel = supabase
          .channel(`public:lovenama_signatures:${fixedName}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'lovenama_signatures',
              filter: `name=eq.${fixedName}`,
            },
            (payload: any) => {
              if (payload.new && isMounted) {
                const newRow = payload.new;
                setMomentText(newRow.moment || '');
                if (newRow.created_at) {
                  const dateObj = new Date(newRow.created_at);
                  const dateStr = dateObj.toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });
                  setTimestamp(dateStr);
                }
                setSigned(true);
                setIsEditing(false);
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("Realtime subscription could not be established:", err);
      }
    }

    return () => { 
      isMounted = false; 
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fixedName]);

  const handleSign = async () => {
    if (!momentText.trim()) {
      setErrorMessage("Please write your moment before signing.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    let finalTimestampStr = new Date().toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });

    if (supabase) {
      try {
        const isMe = role === 'me';
        // Use UPSERT so re-submitting or updating never hits 409 unique constraint errors
        const { data, error } = await supabase
          .from('lovenama_signatures')
          .upsert([
            { 
              role: isMe, 
              name: fixedName, 
              moment: momentText.trim()
            }
          ], { onConflict: 'name' })
          .select()
          .single();
          
        if (error) throw error;
        
        if (data && data.created_at) {
          finalTimestampStr = new Date(data.created_at).toLocaleString('en-US', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
          });
        }

        setStatusMessage("Saved to Supabase ✨");
        setTimeout(() => setStatusMessage(null), 3500);
      } catch (error: any) {
        console.error("Error saving signature to Supabase:", error);
        setErrorMessage(
          `Error saving to Supabase: ${error?.message || error?.details || 'Database connection error'}`
        );
        setIsSubmitting(false);
        return;
      }
    } else {
      console.warn("Supabase not configured. Signature saved locally.");
      setStatusMessage("Saved locally ✨");
      setTimeout(() => setStatusMessage(null), 3500);
    }

    try {
      localStorage.setItem(`lovenama_sig_${fixedName}`, JSON.stringify({
        moment: momentText.trim(),
        timestamp: finalTimestampStr
      }));
    } catch {
      // ignore
    }

    setTimestamp(finalTimestampStr);
    setSigned(true);
    setIsEditing(false);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 text-left mb-4 sm:mb-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-heading text-white drop-shadow-md font-semibold">{title}:</h3>
        {signed && !isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setErrorMessage(null);
            }}
            className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10"
            title="Edit moment"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        )}
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {signed && !isEditing ? (
          <div className="text-left">
            <p className="font-heading text-white text-base sm:text-lg md:text-xl italic leading-relaxed drop-shadow-sm">
              "{momentText}"
            </p>
            <div className="flex items-center justify-between mt-3 text-white/60 text-xs sm:text-sm font-sans">
              <span className="italic">— {fixedName}</span>
              <span>{timestamp}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="font-heading text-white/90 text-base sm:text-lg">
              The moment {role === 'me' ? 'I' : 'you'} knew:
            </label>
            <input 
              type="text" 
              value={momentText}
              onChange={(e) => {
                setMomentText(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              onFocus={(e) => {
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }}
              className="bg-white/5 border-b-2 border-white/60 focus:border-white outline-none text-white font-sans w-full py-2 px-3 rounded-t transition-colors text-base placeholder:text-white/40"
              placeholder="Write your moment here..."
            />
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {statusMessage && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {(!signed || isEditing) && (
          <div className="mt-4 sm:mt-6 flex justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setErrorMessage(null);
                }}
                className="px-4 py-2.5 text-white/70 hover:text-white rounded-lg text-sm transition-all"
              >
                Cancel
              </button>
            )}
            <button 
              onClick={handleSign}
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-2.5 glass-button text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] min-h-[44px]"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Signature' : 'Sign'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export function SceneLovenama({ onNext }: SceneLovenamaProps) {
  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-3xl mx-auto text-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 min-h-full my-auto">
      <motion.div 
        className="glass-panel w-full p-4 sm:p-6 md:p-12 relative flex flex-col h-[82vh] max-h-[82vh] min-h-[380px] sm:min-h-[500px]"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center shrink-0 mb-3 sm:mb-6"
        >
          <Feather className="w-6 h-6 sm:w-8 sm:h-8 text-gold-light mb-2 sm:mb-4 drop-shadow-[0_0_8px_rgba(232,180,200,0.6)]" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            The LOVENAMA
          </h1>
        </motion.div>

        <div 
          className="flex-1 min-h-[160px] overflow-y-auto px-2 sm:px-4 md:px-6 custom-scrollbar scroll-smooth"
        >
          <div className="py-2 sm:py-4 max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <motion.p className="font-heading text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed italic text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              This page isn't for today.
            </motion.p>
            <motion.p className="font-sans text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              It's for the day you know. Not think, not guess — just know, quietly, without doubt, that you're in love. Whenever that day comes, you open this page and you sign it. Nothing more needed. Just one line about the moment it happened.
            </motion.p>
            <motion.p className="font-sans text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              I'll do the same on my end. Neither of us is signing this now. No rushing it, no forcing it, no one going first just to prove something. It stays blank until it's real — for both of us.
            </motion.p>
            <motion.p className="font-sans text-sm sm:text-base md:text-lg text-white leading-relaxed text-left font-medium mb-6 sm:mb-10 drop-shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              There's no deadline on this page. It doesn't matter who signs first, or when. It only matters that whenever it happens, it's true.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <SignatureBlock title="My signature" role="me" />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
              <SignatureBlock title="Your signature" role="you" />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="shrink-0 mt-3 sm:mt-6 pt-2 sm:pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-6 py-2.5 sm:px-8 sm:py-4 glass-button text-white rounded-full font-medium text-sm sm:text-base md:text-lg transition-all inline-flex items-center gap-2 min-h-[44px]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.9, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
