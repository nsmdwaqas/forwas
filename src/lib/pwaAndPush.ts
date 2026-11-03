import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface MissAlertPayload {
  eventId: string;
  senderDeviceId: string;
  senderSoul: 'Shajer' | 'Waqas';
  title: string;
  body: string;
  vibrate: number[];
  url: string;
  createdAt: string;
}

const DEVICE_ID_KEY = 'for_shajer_device_id';
const SEEN_EVENTS_KEY = 'for_shajer_seen_alert_ids';
const SUBSCRIBED_SOUL_KEY = 'for_shajer_push_subscribed_soul';

const RANDOM_MISS_BODIES = [
  // 🥺 Sweet & Missing You
  'Someone is missing you right now 🥺❤️',
  'Wish you were here for a little hug 🤗',
  "You're on someone's mind. Again. 💭💕",
  'Sending you a thousand invisible hugs 🫂',
  'Someone wishes they could see your smile right now 🥹',
  'A little heart is looking for you 💗',
  'If only teleportation existed! 🛸❤️',
  "Someone's day would be better with you in it 🌷",
  'Missing your hugs a little extra today 🫂',
  "You're someone's favourite thought today 💞",
  // 😘 Flirty & Romantic
  'Someone wants a kiss from you 😘',
  "Stop being so adorable, it's distracting 🙈💕",
  'Someone wants to steal a moment with you 💋',
  "Guess who's craving your attention? 😏",
  "Your smile is living rent-free in someone's head 🥰",
  'Someone wants you. Just you. ❤️',
  'Sending one tiny kiss through the screen 😚',
  'Someone wishes they could hold you closer 🫶',
  "You're dangerously lovable, you know? 😍",
  "Someone's heart just did a little dance thinking of you 💓",
  // 😂 Cute & Funny
  "Breaking news! You're being missed 🚨😂",
  'Someone needs their daily dose of YOU 💊❤️',
  'Distance, please stop being so dramatic 🙄',
  'Your absence has been reported to management 📢🤣',
  'Someone is requesting an emergency hug 🚑🫂',
  "You're officially too far away. Come back! 😤💕",
  'Missing you is becoming a full-time job 💼😂',
  'Someone wants to annoy you in person 😈',
  'A hug has been ordered. Delivery pending 📦🤗',
  'Warning: Someone is suffering from a YOU deficiency ⚠️🥺',
  // 🌙 Deep & Emotional
  'Some hearts miss quietly, but deeply 🌙❤️',
  "Even the stars know someone's missing you ✨",
  "You're closer to someone's heart than you think 🫀",
  'If thoughts could travel, someone would be beside you 🕊️',
  "A little piece of someone's heart is with you 💝",
  'Some people are worth every mile between them 🌍💕',
  'Someone wishes this moment had you in it 🥹',
  "Distance can't stop a heart from reaching out 💗",
  "You're someone's favourite kind of happiness 🌸",
  'One heart. One thought. You. ❤️',
  // 💌 Little Surprises
  'Psst... someone is thinking about you 🤫💕',
  "Guess what? YOU. That's the notification 😌",
  "Here's your random dose of affection 🥰",
  'Someone just sent a little heartbeat your way 💓',
  'Consider yourself virtually hugged! 🫂',
  "A tiny reminder: you're special 🌷",
  'Someone wishes they could pause time with you ⏳❤️',
  "Just dropping by to say you're missed 💌",
  "Someone's heart said hello! 👋💗",
  'This notification comes with unlimited love 🎁❤️'
];

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((fn) => fn());
  });
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'fallback_device';
  }
}

function hasSeenEvent(eventId: string): boolean {
  if (!eventId || typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(SEEN_EVENTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(eventId);
  } catch {
    return false;
  }
}

export function markEventSeen(eventId: string): void {
  if (!eventId || typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(SEEN_EVENTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(eventId)) {
      const updated = [eventId, ...list].slice(0, 30);
      localStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify(updated));
    }
  } catch {
    // ignore storage errors
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return reg;
  } catch (err) {
    console.warn('[PWA] Service worker registration failed:', err);
    return null;
  }
}

export function buildClientMissPayload(
  senderSoul: 'Shajer' | 'Waqas',
  isMutualWithin10Mins: boolean
): MissAlertPayload {
  const senderDeviceId = getDeviceId();
  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (isMutualWithin10Mins) {
    const title = senderSoul === 'Shajer' ? 'She misses you too!' : 'He misses you too!';
    const body = 'Two hearts. Almost the same moment. 🥹';
    return {
      eventId,
      senderDeviceId,
      senderSoul,
      title,
      body,
      vibrate: [200, 100, 200, 100, 400, 100, 300],
      url: '/?scene=miss_counter',
      createdAt: new Date().toISOString()
    };
  }

  const title = `${senderSoul} Miss U 💗`;
  const randomIdx = Math.floor(Math.random() * RANDOM_MISS_BODIES.length);
  const body = RANDOM_MISS_BODIES[randomIdx];

  return {
    eventId,
    senderDeviceId,
    senderSoul,
    title,
    body,
    vibrate: [200, 100, 200, 100, 400],
    url: '/?scene=miss_counter',
    createdAt: new Date().toISOString()
  };
}

export async function showLocalPartnerNotification(
  payload: MissAlertPayload,
  onNavigateToMissCounter?: () => void
): Promise<void> {
  const myDeviceId = getDeviceId();
  // Never notify the device that pressed the button
  if (payload.senderDeviceId === myDeviceId) {
    return;
  }
  if (hasSeenEvent(payload.eventId)) {
    return;
  }
  markEventSeen(payload.eventId);

  // Trigger physical vibration on recipient device
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(payload.vibrate || [200, 100, 200, 100, 400]);
    } catch {
      // ignore vibration error
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  try {
    const reg = await registerServiceWorker();
    if (reg && reg.showNotification) {
      await reg.showNotification(payload.title, {
        body: payload.body,
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        vibrate: payload.vibrate || [200, 100, 200, 100, 400],
        tag: 'miss-counter-heartbeat',
        renotify: true,
        data: {
          url: payload.url || '/?scene=miss_counter',
          scene: 'miss_counter',
          eventId: payload.eventId
        }
      } as NotificationOptions);
      return;
    }
  } catch {
    // Fallback to standard Notification API if SW showNotification fails
  }

  try {
    const notif = new Notification(payload.title, {
      body: payload.body,
      icon: '/android-chrome-192x192.png',
      tag: 'miss-counter-heartbeat'
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
      if (onNavigateToMissCounter) {
        onNavigateToMissCounter();
      } else {
        window.location.href = '/?scene=miss_counter';
      }
    };
  } catch (err) {
    console.warn('[PWA] Fallback notification error:', err);
  }
}

// Shared Supabase Realtime channel for instant cross-device delivery
let broadcastChannel: ReturnType<typeof supabase.channel> | null = null;

function getOrCreateBroadcastChannel() {
  if (!broadcastChannel) {
    broadcastChannel = supabase.channel('miss-counter-live-alerts', {
      config: {
        broadcast: { self: false }
      }
    });
    broadcastChannel.subscribe();
  }
  return broadcastChannel;
}

export async function triggerPartnerMissNotification(
  senderSoul: 'Shajer' | 'Waqas',
  isMutualWithin10Mins: boolean
): Promise<MissAlertPayload> {
  const payload = buildClientMissPayload(senderSoul, isMutualWithin10Mins);
  // Mark our own eventId as seen so this device never alerts itself
  markEventSeen(payload.eventId);

  // 1. Send via Supabase Realtime Broadcast to all other connected devices immediately
  try {
    const channel = getOrCreateBroadcastChannel();
    await channel.send({
      type: 'broadcast',
      event: 'miss-heartbeat',
      payload
    });
  } catch (err) {
    console.warn('[Push] Realtime broadcast error:', err);
  }

  // 2. Send via Express Web Push API to wake up background / closed Service Workers on other devices
  try {
    await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderDeviceId: payload.senderDeviceId,
        senderSoul: payload.senderSoul,
        isMutualWithin10Mins,
        eventId: payload.eventId,
        title: payload.title,
        body: payload.body,
        vibrate: payload.vibrate
      })
    });
  } catch (err) {
    console.warn('[Push] Server push send error:', err);
  }

  return payload;
}

export async function subscribeDeviceToPush(soul: 'Shajer' | 'Waqas'): Promise<{
  granted: boolean;
  subscribed: boolean;
  error?: string;
}> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      granted: false,
      subscribed: false,
      error: 'Notifications are not supported in this browser. On iPhone, please tap Install App (Add to Home Screen) first.'
    };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        granted: false,
        subscribed: false,
        error: 'Please allow notification permission in your browser settings.'
      };
    }

    const reg = await registerServiceWorker();
    if (!reg) {
      localStorage.setItem(SUBSCRIBED_SOUL_KEY, soul);
      return { granted: true, subscribed: true };
    }

    // Attempt Web Push subscription with server VAPID key
    try {
      const vapidRes = await fetch('/api/push/vapid-public-key');
      if (vapidRes.ok) {
        const { publicKey } = await vapidRes.json();
        if (publicKey && reg.pushManager) {
          let sub = await reg.pushManager.getSubscription();
          if (!sub) {
            sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey)
            });
          }
          await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              deviceId: getDeviceId(),
              soul,
              subscription: sub
            })
          });
        }
      }
    } catch (pushErr) {
      console.warn('[Push] PushManager subscription warning (falling back to live SW alerts):', pushErr);
    }

    localStorage.setItem(SUBSCRIBED_SOUL_KEY, soul);

    // Gentle confirmation vibration
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 150]);
    }

    return { granted: true, subscribed: true };
  } catch (err) {
    return {
      granted: false,
      subscribed: false,
      error: (err as Error)?.message || 'Could not enable notifications.'
    };
  }
}

export function usePWAInstallAndPush(currentSoul: 'Shajer' | 'Waqas' = 'Waqas') {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSChrome, setIsIOSChrome] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsInstalled(standalone);
    };
    checkStandalone();

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    const iosChrome = ios && /crios/.test(ua);
    setIsIOS(ios);
    setIsIOSChrome(iosChrome);

    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
      const savedSoul = localStorage.getItem(SUBSCRIBED_SOUL_KEY);
      if (Notification.permission === 'granted' && savedSoul) {
        setIsPushSubscribed(true);
        // Silently refresh subscription in background
        subscribeDeviceToPush(currentSoul).catch(() => {});
      }
    }

    const onPromptChange = () => {
      setDeferredPrompt(globalDeferredPrompt);
    };
    promptListeners.add(onPromptChange);

    const onInstalled = () => {
      setIsInstalled(true);
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      promptListeners.delete(onPromptChange);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [currentSoul]);

  const installApp = useCallback(async () => {
    if (!globalDeferredPrompt) return false;
    try {
      await globalDeferredPrompt.prompt();
      const { outcome } = await globalDeferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('[PWA] Install prompt failed:', err);
    }
    return false;
  }, []);

  const enableNotifications = useCallback(async () => {
    setIsSubscribing(true);
    setStatusMessage(null);
    const res = await subscribeDeviceToPush(currentSoul);
    setIsSubscribing(false);
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
    if (res.granted) {
      setIsPushSubscribed(true);
      setStatusMessage('Heartbeat alerts active on this phone ❤️');
      setTimeout(() => setStatusMessage(null), 4000);
    } else if (res.error) {
      setStatusMessage(res.error);
      setTimeout(() => setStatusMessage(null), 5000);
    }
    return res.granted;
  }, [currentSoul]);

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    isIOSChrome,
    notifPermission,
    isPushSubscribed,
    isSubscribing,
    statusMessage,
    installApp,
    enableNotifications
  };
}
