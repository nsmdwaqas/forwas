import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import webpush from 'web-push';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_PATH = path.resolve(__dirname, '.push-store.json');

interface StoredSubscription {
  deviceId: string;
  soul: 'Shajer' | 'Waqas';
  subscription: webpush.PushSubscription;
  updatedAt: string;
}

interface LatestAlertEvent {
  eventId: string;
  senderDeviceId: string;
  senderSoul: 'Shajer' | 'Waqas';
  title: string;
  body: string;
  vibrate: number[];
  url: string;
  createdAt: string;
}

interface PushStore {
  vapidKeys: {
    publicKey: string;
    privateKey: string;
  };
  subscriptions: StoredSubscription[];
  latestAlert?: LatestAlertEvent;
}

function loadOrInitPushStore(): PushStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as PushStore;
      if (parsed?.vapidKeys?.publicKey && parsed?.vapidKeys?.privateKey) {
        return {
          vapidKeys: parsed.vapidKeys,
          subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
          latestAlert: parsed.latestAlert
        };
      }
    }
  } catch (err) {
    console.warn('[PushStore] Could not read existing store, generating new VAPID keys:', err);
  }

  const vapidKeys = webpush.generateVAPIDKeys();
  const initialStore: PushStore = {
    vapidKeys,
    subscriptions: []
  };
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[PushStore] Could not persist initial store:', err);
  }
  return initialStore;
}

function savePushStore(store: PushStore) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[PushStore] Failed to save store:', err);
  }
}

const pushStore = loadOrInitPushStore();

webpush.setVapidDetails(
  'mailto:nsmdwaqas@gmail.com',
  pushStore.vapidKeys.publicKey,
  pushStore.vapidKeys.privateKey
);

const RANDOM_BODIES = [
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

export function buildNotificationPayload(
  senderSoul: 'Shajer' | 'Waqas',
  isMutualWithin10Mins: boolean,
  senderDeviceId: string,
  customEventId?: string,
  customBodyIndex?: number
): LatestAlertEvent {
  const eventId = customEventId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (isMutualWithin10Mins) {
    // Within 10 mins mutual miss back:
    // If Shajer sends back -> "She misses you too!"
    // If Waqas sends back -> "He misses you too!"
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
  const idx =
    typeof customBodyIndex === 'number'
      ? Math.abs(customBodyIndex) % RANDOM_BODIES.length
      : Math.floor(Math.random() * RANDOM_BODIES.length);
  const body = RANDOM_BODIES[idx];

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

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Return VAPID Public Key for PushManager subscription
  app.get('/api/push/vapid-public-key', (_req, res) => {
    res.json({ publicKey: pushStore.vapidKeys.publicKey });
  });

  // 2. Register or update a device's Web Push subscription
  app.post('/api/push/subscribe', (req, res) => {
    const { deviceId, soul, subscription } = req.body || {};
    if (!deviceId || !subscription || !subscription.endpoint) {
      res.status(400).json({ error: 'Missing deviceId or valid push subscription' });
      return;
    }

    const normalizedSoul: 'Shajer' | 'Waqas' =
      String(soul).toLowerCase().includes('shajer') ? 'Shajer' : 'Waqas';

    // Remove any existing subscription with same deviceId or endpoint
    pushStore.subscriptions = pushStore.subscriptions.filter(
      (s) => s.deviceId !== deviceId && s.subscription.endpoint !== subscription.endpoint
    );

    pushStore.subscriptions.push({
      deviceId,
      soul: normalizedSoul,
      subscription,
      updatedAt: new Date().toISOString()
    });

    savePushStore(pushStore);
    res.json({ ok: true, count: pushStore.subscriptions.length });
  });

  // 3. Send Push Notification to ALL devices OTHER THAN senderDeviceId
  app.post('/api/push/send', async (req, res) => {
    const {
      senderDeviceId,
      senderSoul,
      isMutualWithin10Mins,
      eventId,
      title: clientTitle,
      body: clientBody,
      vibrate: clientVibrate
    } = req.body || {};

    if (!senderDeviceId) {
      res.status(400).json({ error: 'Missing senderDeviceId' });
      return;
    }

    const normalizedSoul: 'Shajer' | 'Waqas' =
      String(senderSoul).toLowerCase().includes('shajer') ? 'Shajer' : 'Waqas';

    const generated = buildNotificationPayload(
      normalizedSoul,
      Boolean(isMutualWithin10Mins),
      senderDeviceId,
      eventId
    );

    const alertPayload: LatestAlertEvent = {
      ...generated,
      title: clientTitle || generated.title,
      body: clientBody || generated.body,
      vibrate: Array.isArray(clientVibrate) ? clientVibrate : generated.vibrate
    };

    pushStore.latestAlert = alertPayload;
    savePushStore(pushStore);

    // Filter to all devices EXCEPT the device that triggered the button
    const targets = pushStore.subscriptions.filter(
      (sub) => sub.deviceId !== senderDeviceId
    );

    const deadEndpoints = new Set<string>();
    let deliveredCount = 0;

    await Promise.all(
      targets.map(async (target) => {
        try {
          await webpush.sendNotification(
            target.subscription,
            JSON.stringify(alertPayload),
            { TTL: 3600, urgency: 'high' }
          );
          deliveredCount++;
        } catch (err: unknown) {
          const statusCode = (err as { statusCode?: number })?.statusCode;
          if (statusCode === 404 || statusCode === 410) {
            deadEndpoints.add(target.subscription.endpoint);
          }
        }
      })
    );

    if (deadEndpoints.size > 0) {
      pushStore.subscriptions = pushStore.subscriptions.filter(
        (s) => !deadEndpoints.has(s.subscription.endpoint)
      );
      savePushStore(pushStore);
    }

    res.json({
      ok: true,
      deliveredCount,
      totalOtherDevices: targets.length,
      alert: alertPayload
    });
  });

  // 4. Fetch latest alert event (for fallback polling by background/open tabs)
  app.get('/api/push/latest', (_req, res) => {
    res.json({ latestAlert: pushStore.latestAlert || null });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
