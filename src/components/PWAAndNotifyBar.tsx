import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellRing, Download, Share, PlusSquare, X, Check } from 'lucide-react';
import { usePWAInstallAndPush } from '../lib/pwaAndPush';

interface PWAAndNotifyBarProps {
  currentSoul?: 'Shajer' | 'Waqas';
  compact?: boolean;
}

export function PWAAndNotifyBar({
  currentSoul = 'Waqas',
  compact = false
}: PWAAndNotifyBarProps) {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isIOSChrome,
    notifPermission,
    isPushSubscribed,
    isSubscribing,
    statusMessage,
    installApp,
    enableNotifications
  } = usePWAInstallAndPush(currentSoul);

  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const hapticTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
  };

  const handleInstallClick = async () => {
    hapticTap();
    if (isInstallable) {
      const installed = await installApp();
      if (!installed) {
        setShowInstallGuide(true);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  const handleEnableNotifications = async () => {
    hapticTap();
    await enableNotifications();
  };

  const alertsActive = notifPermission === 'granted' && isPushSubscribed;

  // If both installed as standalone AND notifications are already active, show only a quiet status or statusMessage
  if (isInstalled && alertsActive && !statusMessage && compact) {
    return null;
  }

  return (
    <>
      <div className="w-full flex flex-col items-center gap-2 shrink-0">
        <div className="flex flex-wrap items-center justify-center gap-2 w-full">
          {/* Install App Button (Hidden once running as installed standalone app) */}
          {!isInstalled && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/25 text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
            >
              <Download className="w-4 h-4 text-rose-300 shrink-0" />
              <span>Install App</span>
            </button>
          )}

          {/* Enable Partner Notifications Button */}
          <button
            type="button"
            onClick={handleEnableNotifications}
            disabled={isSubscribing}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
              alertsActive
                ? 'bg-rose-500/25 border border-rose-300/50 text-rose-100 hover:bg-rose-500/35'
                : 'bg-gradient-to-r from-rose-500/35 to-amber-500/30 hover:from-rose-500/50 hover:to-amber-500/45 border border-rose-300/50 text-white'
            }`}
          >
            {alertsActive ? (
              <>
                <BellRing className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Heartbeat Alerts Active</span>
                <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-amber-200 animate-bounce shrink-0" />
                <span>{isSubscribing ? 'Enabling Alerts...' : 'Enable Heartbeat Alerts'}</span>
              </>
            )}
          </button>
        </div>

        {/* Status Toast Feedback */}
        <AnimatePresence>
          {statusMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-rose-200 font-sans text-center px-3 py-1 rounded-lg bg-black/50 border border-rose-400/30"
            >
              {statusMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Guided Installation Modal for iOS Chrome / Safari & Mobile Browsers */}
      <AnimatePresence>
        {showInstallGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowInstallGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-3xl bg-zinc-950/95 border border-rose-400/40 p-6 text-left shadow-2xl relative text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="absolute top-4 right-4 min-h-[40px] min-w-[40px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 cursor-pointer"
                aria-label="Close install guide"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-heading text-xl text-white tracking-wide pr-8">
                Install &ldquo;For Shajer 🤍&rdquo;
              </h3>
              <p className="text-xs text-white/80 mt-1 leading-relaxed font-sans">
                Add our sanctuary to your Home Screen for full-screen access and instant Miss Counter notifications:
              </p>

              {isIOS ? (
                <div className="mt-4 flex flex-col gap-3 text-xs sm:text-sm text-white/95 font-sans">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Share className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-rose-200">Step 1: Tap Share</span>
                      <span className="text-white/80 text-xs">
                        {isIOSChrome
                          ? 'Tap the Share icon at the top-right of your Chrome address bar.'
                          : 'Tap the Share button in your browser toolbar.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <PlusSquare className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-amber-200">Step 2: Add to Home Screen</span>
                      <span className="text-white/80 text-xs">
                        Scroll down the menu and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>, then open the app from your Home Screen and tap <strong>Enable Heartbeat Alerts</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-3 text-xs sm:text-sm text-white/95 font-sans">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Download className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-rose-200">Install via Browser Menu</span>
                      <span className="text-white/80 text-xs">
                        Tap the <strong>⋮ menu</strong> at the top-right of Chrome and select <strong>&ldquo;Add to Home screen&rdquo;</strong> or <strong>&ldquo;Install app&rdquo;</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-rose-500/40 hover:bg-rose-500/55 border border-rose-300/50 text-white text-sm font-medium transition-all cursor-pointer"
              >
                Got It 🤍
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
