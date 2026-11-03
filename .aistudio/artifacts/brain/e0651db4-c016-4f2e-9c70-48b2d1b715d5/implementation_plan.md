# Background Web Push Notifications When Website Is Closed (Netlify + Supabase)

Enable true OS-level Web Push notifications (like WhatsApp, Zomato, or Swiggy) so Waqas and Shajer receive instant Miss Counter notifications even when the website/app is **completely closed** or the phone is locked—while preserving 100% of the existing UI, Miss Counter logic, 50 random messages, 10-minute mutual sync, and Supabase/Netlify integrations.

---

## Why Notifications Previously Required the App to Be Open

1. **Netlify Static Hosting vs. Express (`server.ts`)**:
   - When deployed to Netlify, `vite build` serves static files from `dist/`, meaning the local Express server (`server.ts`) is not active on Netlify unless backed by **Netlify Serverless Functions**. Without serverless functions handling `/api/push/*`, the app fell back to Supabase Realtime Broadcast, which only works while the browser/app is open in memory.
2. **Ephemeral Subscription Storage**:
   - Storing push subscriptions in a local file (`.push-store.json`) does not persist across serverless invocations or redeployments. Subscriptions must be stored in **Supabase** alongside a fixed, permanent pair of **VAPID keys** so Google FCM (Android) and Apple APNs (iOS Home Screen PWA) can wake up the phone's Service Worker at the OS level when the app is completely closed.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following confirmed choices and non-breaking guarantees govern this update:

- **Confirmed Decision 1 — Netlify Serverless Functions + `netlify.toml`**: Add a unified Netlify Function handler (`netlify/functions/push.ts`) and `netlify.toml` redirect rule (`/api/push/*` → `/.netlify/functions/push/:splat`) so Web Push works out-of-the-box on Netlify deployments as well as in local/AI Studio preview.
- **Confirmed Decision 2 — Supabase Push Subscription Persistence**: Store each device's Web Push `PushSubscription` in Supabase (`Push_Subscriptions` table, with an automatic zero-config fallback row inside `WSStats` so push subscriptions persist immediately even before you create a custom table).
- **Zero UI or Feature Changes**: No changes to the visual design, Miss Counter circle/heart animations, counting logic, or the 50 shuffled messages.

---

## 1. Overview & Core Concept

- **What It Does**:
  - Registers each partner's device with the operating system's push service (Google FCM on Android Chrome; Apple APNs on iOS 16.4+ installed Home Screen web apps) using a permanent VAPID public key.
  - Saves the resulting encrypted `PushSubscription` endpoint and keys in **Supabase**.
  - Whenever either partner taps **"I Miss You Right Now ❤️"**, the backend (Netlify Function in production / Express in dev) reads all partner subscriptions from Supabase (`deviceId !== senderDeviceId`) and dispatches a high-priority(`urgency: 'high'`) Web Push payload directly to the OS push servers.
  - The phone's OS wakes up `/sw.js` in the background—even if Chrome or the PWA is completely swiped away/closed—displays the notification with vibration, and opens `/?scene=miss_counter` when tapped.

---

## 2. User Experience & Visual Design

- **Zero Visual Disruption**: The existing UI, typography, colors, animations, and layout remain completely untouched.
- **Automatic Background Subscription Refresh**: Whenever a user opens the app with notifications already granted, the app silently verifies that its `PushSubscription` is saved in Supabase so background delivery stays active across browser updates.
- **OS-Level Notification Behavior**:
  - **High-Priority Delivery**: Dispatched with `urgency: 'high'` and `TTL: 86400` (24 hours) so Android Doze mode and iOS lockscreens deliver the alert immediately.
  - **Tapping the Notification When Closed**: Launches the PWA window directly to `/?scene=miss_counter` (bypassing the lockscreen PIN as configured).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Dual Supabase Storage Strategy (`Push_Subscriptions` Table + Automatic `WSStats` Fallback)**:
  - *Chosen Approach*: The backend first writes/reads subscriptions from a dedicated `Push_Subscriptions` table in Supabase (`device_id`, `soul`, `subscription`, `updated_at`). If that table hasn't been created yet in your Supabase dashboard, it automatically falls back to storing the JSON subscription list inside a reserved row in your existing `WSStats` table (`Chapter = 'PushSubs'`, stored in `Last_Device`).
  - *Why*: Guarantees that closed-app push notifications work **immediately** with zero manual database setup required, while also supporting a clean dedicated `Push_Subscriptions` table whenever you run the optional SQL snippet.
- **Decision 2 — Permanent VAPID Keys**:
  - *Chosen Approach*: Lock in a fixed pair of VAPID keys across `server.ts`, Netlify Functions, and client fallback (with support for optional `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` environment variables).
  - *Why*: Ensures push subscriptions never become invalidated when Netlify redeploys or serverless functions cold-start.

---

## 4. Technical Architecture & Data Strategy

### End-to-End Closed-App Push Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 1. Sender Phone (e.g. Waqas taps "I Miss You Right Now ❤️")                │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │ POST /api/push/send
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 2. Serverless Push Engine (Netlify Function / Express Server)              │
│    • Queries Supabase for all PushSubscriptions where deviceId != sender   │
│    • Signs RFC 8292 VAPID Web Push payload with urgency="high"             │
└──────────────────┬──────────────────────────────────────┬──────────────────┘
                   │                                      │
                   ▼ (Android)                            ▼ (iOS 16.4+ PWA)
     ┌───────────────────────────┐          ┌───────────────────────────┐
     │ Google FCM Push Service   │          │ Apple APNs Web Push       │
     └─────────────┬─────────────┘          └─────────────┬─────────────┘
                   │                                      │
                   └──────────────────┬───────────────────┘
                                      │ Wakes up OS Service Worker
                                      ▼ (Even when website/app is CLOSED)
┌────────────────────────────────────────────────────────────────────────────┐
│ 3. Recipient Phone OS -> Service Worker (/sw.js)                           │
│    • Fires `push` event listener in background                             │
│    • Calls `self.registration.showNotification(title, { body, vibrate })`  │
│    • On tap (`notificationclick`): opens `/?scene=miss_counter`            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Optional Supabase Table Schema (Plus Zero-Config Automatic Fallback)
If you wish to view subscriptions in a dedicated table in Supabase, you can optionally run:
```sql
create table if not exists public."Push_Subscriptions" (
  device_id text primary key,
  soul text,
  subscription jsonb not null,
  updated_at timestamptz default now()
);
alter table public."Push_Subscriptions" enable row level security;
create policy "Allow public push subscription access"
  on public."Push_Subscriptions" for all using (true) with check (true);
```
*(Even before running this SQL, our backend will automatically persist subscriptions in your existing Supabase database so closed-app notifications work right away.)*
