import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Feather } from 'lucide-react';
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

  // Fetch signature on load if it already exists
  useEffect(() => {
    let isMounted = true;
    const loadSignature = async () => {
      if (!supabase) return;
      try {
        const isMe = role === 'me';
        const { data, error } = await supabase
          .from('lovenama_signatures')
          .select('*')
          .eq('role', isMe)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching signature:", error);
          return;
        }

        if (data && isMounted) {
          setMomentText(data.moment || '');
          
          if (data.created_at) {
            const dateObj = new Date(data.created_at);
            setTimestamp(dateObj.toLocaleString('en-US', { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            }));
          }
          setSigned(true);
        }
      } catch (err) {
        console.error("Failed to load signature:", err);
      }
    };

    loadSignature();
    return () => { isMounted = false; };
  }, [role]);

  const handleSign = async () => {
    setIsSubmitting(true);
    let finalTimestampStr = new Date().toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });

    if (supabase) {
      try {
        const isMe = role === 'me';
        const { data, error } = await supabase
          .from('lovenama_signatures')
          .insert([
            { 
              role: isMe, 
              name: fixedName, 
              moment: momentText.trim() 
              // Omitting created_at and signed_at so Supabase uses its default Now() expressions
            }
          ])
          .select()
          .single();
          
        if (error) throw error;
        
        if (data && data.created_at) {
          finalTimestampStr = new Date(data.created_at).toLocaleString('en-US', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
          });
        }
      } catch (error: any) {
        console.error("Error saving signature:", error);
        alert(`Error saving to Supabase: ${error?.message || error?.details || JSON.stringify(error)}\n\n(Note: If this is a new table, you may need to disable Row Level Security (RLS) in Supabase or add an Insert Policy.)`);
        setIsSubmitting(false);
        return;
      }
    } else {
      console.warn("Supabase not configured. Signature saved locally only for preview.");
    }

    setTimestamp(finalTimestampStr);
    setSigned(true);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-left mb-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <h3 className="text-xl md:text-2xl font-heading text-white mb-6 drop-shadow-md font-semibold">{title}:</h3>
      
      <div className="space-y-6">
      
       {signed ? (
  <div className="text-left">
    <p className="font-heading text-white text-lg md:text-xl italic leading-relaxed drop-shadow-sm">
      "{momentText}"
    </p>
    <div className="flex items-center justify-between mt-3 text-white/60 text-sm font-sans">
      <span className="italic">— {fixedName}</span>
      <span>{timestamp}</span>
    </div>
  </div>
) : (
  <div className="flex flex-col sm:flex-row sm:items-end gap-2">
    <span className="font-heading text-white/90 whitespace-nowrap text-lg">
      The moment {role === 'me' ? 'I' : 'you'} knew:
    </span>
    <input 
      type="text" 
      value={momentText}
      onChange={(e) => setMomentText(e.target.value)}
      className="bg-transparent border-b border-white/60 focus:border-white outline-none text-white font-sans w-full py-1 px-2 transition-colors flex-1"
      placeholder=""
    />
  </div>
)}
        {!signed && (
          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSign}
              disabled={isSubmitting}
              className="px-8 py-2 glass-button text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              {isSubmitting ? 'Signing...' : 'Sign'}
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
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center px-4 md:px-8 py-6 h-full">
      <motion.div 
        className="glass-panel w-full p-6 md:p-12 relative flex flex-col h-full max-h-[85vh]"
        whileHover={{ rotateX: 1, rotateY: -1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center shrink-0 mb-6"
        >
          <Feather className="w-8 h-8 text-gold-light mb-4 drop-shadow-[0_0_8px_rgba(232,180,200,0.6)]" />
          <h1 className="text-3xl md:text-4xl font-heading text-white text-shadow-elegant shimmer-text tracking-[0.2em] uppercase">
            The LOVENAMA
          </h1>
        </motion.div>

        <div 
          className="flex-1 overflow-y-auto px-2 md:px-6 custom-scrollbar scroll-smooth"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 2%, black 98%, transparent)' }}
        >
          <div className="py-4 max-w-2xl mx-auto space-y-6">
            <motion.p className="font-heading text-xl md:text-2xl text-white/90 leading-relaxed italic text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              This page isn't for today.
            </motion.p>
            <motion.p className="font-sans text-base md:text-lg text-white/80 leading-relaxed text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              It's for the day you know. Not think, not guess — just know, quietly, without doubt, that you're in love. Whenever that day comes, you open this page and you sign it. Nothing more needed. Just one line about the moment it happened.
            </motion.p>
            <motion.p className="font-sans text-base md:text-lg text-white/80 leading-relaxed text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              I'll do the same on my end. Neither of us is signing this now. No rushing it, no forcing it, no one going first just to prove something. It stays blank until it's real — for both of us.
            </motion.p>
            <motion.p className="font-sans text-base md:text-lg text-white leading-relaxed text-left font-medium mb-10 drop-shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
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
          className="shrink-0 mt-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.button
            onClick={() => {
              hapticTap();
              onNext();
            }}
            className="px-6 py-3 md:px-8 md:py-4 glass-button text-white rounded-full font-medium text-base md:text-lg transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.9, boxShadow: "0 0 40px rgba(255,255,255,0.8)" }}
          >
            Continue to Promise <ArrowRight className="w-5 h-5" />
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
