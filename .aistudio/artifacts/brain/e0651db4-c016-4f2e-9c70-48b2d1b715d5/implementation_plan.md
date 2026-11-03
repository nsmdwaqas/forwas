# Miss Counter Cross-Device Notifications & PWA Installability

Transform "For Shajer 🤍" into an installable Progressive Web App (PWA) for both iOS and Android, and equip **The Miss Counter** with real-time cross-device push notifications, romantic heartbeat vibrations, 10-minute mutual-miss detection, and direct one-tap deep-linking into the Miss Counter scene.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during clarification and govern this implementation:

- **Confirmed Decision 1 — Direct Deep-Link on Notification Tap**: Tapping a Miss Counter notification opens the app directly into **The Miss Counter** (`/?scene=miss_counter`), bypassing the lockscreen PIN so your partner lands straight on the shared circle.
- **Confirmed Decision 2 — Install & Notification Controls Placement**: A sleek, non-intrusive glassmorphic **Install App** & **Enable Alerts** bar will appear in **The Miss Counter** scene and as a subtle pill action in the **Chapter Hub** (`SceneHub`), automatically hiding once installed and subscribed.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. Allows both Waqas (iOS Chrome/Safari) and Shajer (Android Chrome) to install the web app to their home screens as a standalone full-screen sanctuary.
  2. Sends an instant push notification with heartbeat vibration to all *other* registered devices whenever either partner presses **"I Miss You Right Now ❤️"** in The Miss Counter.
  3. Detects when a partner responds with a miss back within **10 minutes** and upgrades the notification to a special mutual-heartbeat alert.
  4. Redirects the recipient straight to **The Miss Counter** when they tap the notification.
- **Target Audience / Persona**: Waqas and Shajer, staying connected across the distance on their mobile phones.
- **Key Value**: Turns every tap of the Miss Counter into a tangible, real-time physical tap on the other person's phone—complete with vibration and instant navigation.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Installing the App on iOS & Android**:
   - **Android (Chrome)**: Tapping **Install App** triggers the native browser `beforeinstallprompt` installation dialog.
   - **iOS (Chrome / Safari)**: Tapping **Install on iPhone** opens a romantic glassmorphic guide sheet explaining how to tap the **Share** icon in Chrome/Safari and select **Add to Home Screen** (`standalone` mode with the custom `apple-touch-icon.png`).
   - Once running as an installed home-screen app, the install button automatically hides.

2. **Enabling Partner Notifications**:
   - Inside **The Miss Counter** (and optionally from the Chapter Hub), a compact glass button lets each partner tap **Enable Heartbeat Alerts 🔔**.
   - Grants browser/OS `Notification` permission, registers the Service Worker push subscription with a unique per-device identifier (`deviceId`), and confirms with a gentle haptic pulse.

3. **Sending a Miss & Receiving the Notification**:
   - **Standard Miss (> 10 mins since partner's last miss)**:
     - **Title**: `Waqas Miss U` or `Shajer Miss U` (based on who pressed the button).
     - **Body** (randomly shuffled 50/50 on each press):
       - *"Someone just sent a little heartbeat your way."*
       - *"Sending you a virtual hug."*
   - **Mutual Miss Back (≤ 10 mins since partner's last miss)**:
     - **Title**:
       - `She misses you too!` (when Shajer misses back within 10 mins of Waqas)
       - `He misses you too!` (when Waqas misses back within 10 mins of Shajer)
     - **Body**: *"Two hearts. Almost the same moment. 🥹"*
   - **Vibration**: Notifications include a custom heartbeat vibration array (`[200, 100, 200, 100, 400]`) so the phone physically pulses like a heartbeat.

4. **Tapping the Notification**:
   - Tapping the system notification either focuses the already-open app window or launches `/?scene=miss_counter`, bypassing the lockscreen and opening **The Miss Counter** immediately.

### Visual Identity & Theme
- **Aesthetic Direction**: Preserves the existing intimate dark-velvet glassmorphism (`#160510` / `#0d0107`), `Cormorant Garamond` headings, and `Quicksand` body prose without altering any other chapter scenes.
- **Touch Ergonomics**: All install and notification buttons maintain $\ge 44\text{px}$ touch targets (`min-h-[44px]`) and single-line label discipline (`whitespace-nowrap`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Dual-Channel Notification Delivery (Web Push + Real-Time Broadcast)**:
  - *Chosen Approach*: Combine Service Worker **Web Push** (via VAPID keys on an Express server) with **Supabase Realtime Broadcast / Polling** fallback.
  - *Why*: Service Worker Web Push delivers notifications when the app is backgrounded or closed on Android and iOS (16.4+ home-screen PWAs), while real-time broadcast + Service Worker `showNotification` guarantees instant delivery even if push services are restricted by network firewalls.
- **Decision 2 — Device-Level Exclusion (`senderDeviceId`)**:
  - *Chosen Approach*: Each browser/device generates a persistent UUID (`localStorage.getItem('love_device_id')`). When a miss is triggered, the payload includes `senderDeviceId`, and notifications are only shown on devices where `deviceId !== senderDeviceId`.
  - *Why*: Ensures that the device pressing the button never receives its own notification, while all other devices (including a partner's phone or secondary tablet) receive it immediately.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                         Client PWA (iOS & Android)                        │
│                                                                           │
│  ┌──────────────────────┐   Deep-Link (?scene=miss_counter)               │
│  │   App Root Router    │◄─────────────────────────────────────────────┐  │
│  └──────────┬───────────┘                                              │  │
│             │                                                          │  │
│             ▼                                                          │  │
│  ┌──────────────────────┐        ┌──────────────────────────────────┐  │  │
│  │  SceneMissCounter &  │───────►│ PWA Install & Push Subscription  │  │  │
│  │      SceneHub        │        │ (usePWAInstall & pushManager)    │  │  │
│  └──────────┬───────────┘        └─────────────────┬────────────────┘  │  │
│             │                                      │                   │  │
│             │ 1. Tap "I Miss You"                  │ Register SW       │  │
│             │    (Compute <=10m delta)             ▼                   │  │
│             │                            ┌──────────────────────────┐  │  │
│             │                            │ Service Worker (/sw.js)  │──┘  │
│             │                            │ • push event + vibrate   │     │
│             │                            │ • notificationclick      │     │
│             │                            └─────────────▲────────────┘     │
└─────────────┼──────────────────────────────────────────┼──────────────────┘
              │                                          │
              ▼                                          │ 3. Deliver Push to
┌────────────────────────────────────────────────────────┴──────────────────┐
│            Express Server (/api/push/*) + Supabase Realtime               │
│                                                                           │
│  • Stores active Web Push subscriptions keyed by deviceId                 │
│  • Filters out senderDeviceId so triggering device is excluded            │
│  • Broadcasts notification payload (Title, Body, Vibration, Deep-Link)    │
└───────────────────────────────────────────────────────────────────────────┘
```

### Notification Decision Matrix

| Scenario | Trigger Condition | Notification Title | Notification Body | Vibration Pattern |
| :--- | :--- | :--- | :--- | :--- |
| **Waqas Taps Miss** | Partner's last miss was $> 10\text{ mins}$ ago | `Waqas Miss U` | Randomly chosen:<br>1. *"Someone just sent a little heartbeat your way."*<br>2. *"Sending you a virtual hug."* | `[200, 100, 200, 100, 400]` |
| **Shajer Taps Miss** | Partner's last miss was $> 10\text{ mins}$ ago | `Shajer Miss U` | Randomly chosen:<br>1. *"Someone just sent a little heartbeat your way."*<br>2. *"Sending you a virtual hug."* | `[200, 100, 200, 100, 400]` |
| **Shajer Misses Back** | Waqas missed $\le 10\text{ mins}$ ago | `She misses you too!` | *"Two hearts. Almost the same moment. 🥹"* | `[200, 100, 200, 100, 400, 100, 300]` |
| **Waqas Misses Back** | Shajer missed $\le 10\text{ mins}$ ago | `He misses you too!` | *"Two hearts. Almost the same moment. 🥹"* | `[200, 100, 200, 100, 400, 100, 300]` |

### Interactive Component & State Mapping
- **URL & Message Deep-Linking**: On initial load in `App.tsx`, inspect `window.location.search` for `scene=miss_counter`. If present, initialize `scene` state directly to `'miss_counter'` (bypassing `'lockscreen'`) and clean the URL query parameter via `window.history.replaceState`. Also listen for `navigator.serviceWorker` messages (`type: 'OPEN_MISS_COUNTER'`) when the app is already open in the background.
- **PWA Manifest & Icons**: Update `public/site.webmanifest` to include `id: '/'`, `scope: '/'`, `start_url: '/'`, and separate `any` and `maskable` icon entries so Android Chrome and iOS Chrome/Safari pass all installability checks.
