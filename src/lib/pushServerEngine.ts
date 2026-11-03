import webpush from 'web-push';

// Permanent VAPID keys so OS push subscriptions (Android FCM & iOS APNs) remain valid across all serverless cold starts and Netlify deploys
export const PERMANENT_VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  'BBc9GWO0Kr03FybG8hIgHCplf05rH8_q5Jh-EA59REVXnyVftk_qZ-_RZ7nJJRRCQ5j9S-Mk6Z1lnWow64CDiGw';

export const PERMANENT_VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  'OJ34lpzYB2C82oMaIwxjVdw_UjUmK7wD3YntLqWr0W8';

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  'https://qcyhdahclaewvzjpowvr.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeWhkYWhjbGFld3Z6anBvd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODQ2NjYsImV4cCI6MjA3NzU2MDY2Nn0.tSqXIVppqVVU2YKTJJCCt121HDnHzA5DBnCpucTqOF4';

webpush.setVapidDetails(
  'mailto:nsmdwaqas@gmail.com',
  PERMANENT_VAPID_PUBLIC_KEY,
  PERMANENT_VAPID_PRIVATE_KEY
);

export interface StoredSubscription {
  deviceId: string;
  soul: 'Shajer' | 'Waqas';
  subscription: webpush.PushSubscription;
  updatedAt: string;
}

export interface LatestAlertEvent {
  eventId: string;
  senderDeviceId: string;
  senderSoul: 'Shajer' | 'Waqas';
  title: string;
  body: string;
  vibrate: number[];
  url: string;
  createdAt: string;
}

export const RANDOM_BODIES = [
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

const supabaseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

/**
 * Load all active Web Push subscriptions from Supabase:
 * 1) Checks optional `Push_Subscriptions` table if user created it.
 * 2) Reads from `WSStats` row `Chapter = '_PushSubs_'` (which works out-of-the-box).
 */
export async function loadSubscriptionsFromSupabase(): Promise<StoredSubscription[]> {
  const mergedMap = new Map<string, StoredSubscription>();

  // 1. Read from WSStats `_PushSubs_` row
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/WSStats?Chapter=eq._PushSubs_&select=Last_Device`,
      { headers: supabaseHeaders }
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows[0]?.Last_Device) {
        const parsed = JSON.parse(rows[0].Last_Device);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item?.subscription?.endpoint) {
              mergedMap.set(item.subscription.endpoint, item);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('[PushEngine] Error reading _PushSubs_ from WSStats:', err);
  }

  // 2. Also read from optional `Push_Subscriptions` table if it exists
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/Push_Subscriptions?select=device_id,soul,subscription,updated_at`,
      { headers: supabaseHeaders }
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        for (const r of rows) {
          if (r?.subscription?.endpoint) {
            mergedMap.set(r.subscription.endpoint, {
              deviceId: r.device_id,
              soul: String(r.soul).toLowerCase().includes('shajer') ? 'Shajer' : 'Waqas',
              subscription: r.subscription,
              updatedAt: r.updated_at || new Date().toISOString()
            });
          }
        }
      }
    }
  } catch {
    // Optional table may not exist; ignore
  }

  return Array.from(mergedMap.values());
}

/**
 * Persist all active Web Push subscriptions back to Supabase
 */
export async function saveSubscriptionsToSupabase(
  subs: StoredSubscription[]
): Promise<void> {
  const serialized = JSON.stringify(subs);
  const nowIso = new Date().toISOString();

  try {
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/WSStats?Chapter=eq._PushSubs_&select=Chapter`,
      { headers: supabaseHeaders }
    );
    const existing = checkRes.ok ? await checkRes.json() : [];

    if (Array.isArray(existing) && existing.length > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/WSStats?Chapter=eq._PushSubs_`, {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify({
          Last_Device: serialized,
          count: subs.length,
          updated: nowIso
        })
      });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/WSStats`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          Chapter: '_PushSubs_',
          Last_Device: serialized,
          count: subs.length,
          updated: nowIso
        })
      });
    }
  } catch (err) {
    console.warn('[PushEngine] Failed to save _PushSubs_ in WSStats:', err);
  }
}

export async function upsertSubscriptionInSupabase(
  newSub: StoredSubscription
): Promise<number> {
  const current = await loadSubscriptionsFromSupabase();
  const filtered = current.filter(
    (s) =>
      s.deviceId !== newSub.deviceId &&
      s.subscription?.endpoint !== newSub.subscription?.endpoint
  );
  filtered.push(newSub);
  // Keep most recent 25 device subscriptions
  const trimmed = filtered.slice(-25);
  await saveSubscriptionsToSupabase(trimmed);

  // Also attempt to upsert into optional Push_Subscriptions table if user created it
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/Push_Subscriptions`, {
      method: 'POST',
      headers: {
        ...supabaseHeaders,
        Prefer: 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        device_id: newSub.deviceId,
        soul: newSub.soul,
        subscription: newSub.subscription,
        updated_at: newSub.updatedAt
      })
    });
  } catch {
    // Optional table may not exist; ignore
  }

  return trimmed.length;
}

export async function saveLatestAlertToSupabase(alert: LatestAlertEvent): Promise<void> {
  const serialized = JSON.stringify(alert);
  const nowIso = new Date().toISOString();
  try {
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/WSStats?Chapter=eq._LatestPushAlert_&select=Chapter`,
      { headers: supabaseHeaders }
    );
    const existing = checkRes.ok ? await checkRes.json() : [];
    if (Array.isArray(existing) && existing.length > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/WSStats?Chapter=eq._LatestPushAlert_`, {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify({
          Last_Device: serialized,
          updated: nowIso
        })
      });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/WSStats`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          Chapter: '_LatestPushAlert_',
          Last_Device: serialized,
          count: 1,
          updated: nowIso
        })
      });
    }
  } catch {
    // ignore
  }
}

export async function getLatestAlertFromSupabase(): Promise<LatestAlertEvent | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/WSStats?Chapter=eq._LatestPushAlert_&select=Last_Device`,
      { headers: supabaseHeaders }
    );
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows[0]?.Last_Device) {
        return JSON.parse(rows[0].Last_Device) as LatestAlertEvent;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export async function dispatchWebPushToPartnerDevices(params: {
  senderDeviceId: string;
  senderSoul: 'Shajer' | 'Waqas';
  isMutualWithin10Mins: boolean;
  eventId?: string;
  title?: string;
  body?: string;
  vibrate?: number[];
}): Promise<{
  deliveredCount: number;
  totalOtherDevices: number;
  alert: LatestAlertEvent;
}> {
  const {
    senderDeviceId,
    senderSoul,
    isMutualWithin10Mins,
    eventId,
    title: clientTitle,
    body: clientBody,
    vibrate: clientVibrate
  } = params;

  const generated = buildNotificationPayload(
    senderSoul,
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

  // Persist latest alert in Supabase asynchronously
  saveLatestAlertToSupabase(alertPayload).catch(() => {});

  const allSubscriptions = await loadSubscriptionsFromSupabase();
  const targets = allSubscriptions.filter((sub) => sub.deviceId !== senderDeviceId);

  const deadEndpoints = new Set<string>();
  let deliveredCount = 0;

  await Promise.all(
    targets.map(async (target) => {
      try {
        await webpush.sendNotification(
          target.subscription,
          JSON.stringify(alertPayload),
          {
            TTL: 86400, // 24 hours so locked/sleeping phones receive it immediately on wake
            urgency: 'high', // High urgency wakes Android Doze mode & iOS lockscreen immediately
            topic: 'miss-counter'
          }
        );
        deliveredCount++;
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410 || statusCode === 403 || statusCode === 401) {
          deadEndpoints.add(target.subscription.endpoint);
        }
      }
    })
  );

  if (deadEndpoints.size > 0) {
    const remaining = allSubscriptions.filter(
      (s) => !deadEndpoints.has(s.subscription.endpoint)
    );
    await saveSubscriptionsToSupabase(remaining);
  }

  return {
    deliveredCount,
    totalOtherDevices: targets.length,
    alert: alertPayload
  };
}
