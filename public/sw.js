// Service Worker for "For Shajer 🤍" PWA & Miss Counter Notifications
const CACHE_NAME = 'for-shajer-pwa-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon-32x32.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Ignore precache errors in dev
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
    ])
  );
});

// Network-first fetch handler so app is installable as a PWA while always serving fresh updates
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('', { status: 408 });
        });
      })
  );
});

// Handle incoming Web Push notifications (even when app is closed or phone is locked)
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Someone Misses U ❤️',
    body: 'Someone just sent a little heartbeat your way.',
    url: '/?scene=miss_counter',
    vibrate: [200, 100, 200, 100, 400],
    eventId: String(Date.now())
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch {
      payload.body = event.data.text() || payload.body;
    }
  }

  const options = {
    body: payload.body,
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    vibrate: payload.vibrate || [200, 100, 200, 100, 400],
    tag: 'miss-counter-heartbeat',
    renotify: true,
    requireInteraction: false,
    data: {
      url: payload.url || '/?scene=miss_counter',
      scene: 'miss_counter',
      eventId: payload.eventId
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Allow client pages to trigger a native system notification with vibration via SW
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_MISS_NOTIFICATION') {
    const { title, body, vibrate, url, eventId } = event.data.payload || {};
    const options = {
      body: body || 'Someone just sent a little heartbeat your way.',
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      vibrate: vibrate || [200, 100, 200, 100, 400],
      tag: 'miss-counter-heartbeat',
      renotify: true,
      requireInteraction: false,
      data: {
        url: url || '/?scene=miss_counter',
        scene: 'miss_counter',
        eventId: eventId || String(Date.now())
      }
    };

    event.waitUntil(
      self.registration.showNotification(title || 'Someone Misses U', options)
    );
  }
});

// Redirect directly to the Miss U Counter when the notification is tapped
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/?scene=miss_counter';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'OPEN_MISS_COUNTER',
            url: targetUrl
          });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
