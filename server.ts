import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PERMANENT_VAPID_PUBLIC_KEY,
  upsertSubscriptionInSupabase,
  dispatchWebPushToPartnerDevices,
  getLatestAlertFromSupabase
} from './src/lib/pushServerEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Return Permanent VAPID Public Key for PushManager subscription
  app.get('/api/push/vapid-public-key', (_req, res) => {
    res.json({ publicKey: PERMANENT_VAPID_PUBLIC_KEY });
  });

  // 2. Register or update a device's Web Push subscription in Supabase
  app.post('/api/push/subscribe', async (req, res) => {
    try {
      const { deviceId, soul, subscription } = req.body || {};
      if (!deviceId || !subscription || !subscription.endpoint) {
        res.status(400).json({ error: 'Missing deviceId or valid push subscription' });
        return;
      }

      const normalizedSoul: 'Shajer' | 'Waqas' =
        String(soul).toLowerCase().includes('shajer') ? 'Shajer' : 'Waqas';

      const count = await upsertSubscriptionInSupabase({
        deviceId,
        soul: normalizedSoul,
        subscription,
        updatedAt: new Date().toISOString()
      });

      res.json({ ok: true, count });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error)?.message || 'Failed to subscribe' });
    }
  });

  // 3. Send Web Push Notification to ALL devices OTHER THAN senderDeviceId
  app.post('/api/push/send', async (req, res) => {
    try {
      const {
        senderDeviceId,
        senderSoul,
        isMutualWithin10Mins,
        eventId,
        title,
        body,
        vibrate
      } = req.body || {};

      if (!senderDeviceId) {
        res.status(400).json({ error: 'Missing senderDeviceId' });
        return;
      }

      const normalizedSoul: 'Shajer' | 'Waqas' =
        String(senderSoul).toLowerCase().includes('shajer') ? 'Shajer' : 'Waqas';

      const result = await dispatchWebPushToPartnerDevices({
        senderDeviceId,
        senderSoul: normalizedSoul,
        isMutualWithin10Mins: Boolean(isMutualWithin10Mins),
        eventId,
        title,
        body,
        vibrate
      });

      res.json({
        ok: true,
        ...result
      });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error)?.message || 'Failed to send push' });
    }
  });

  // 4. Fetch latest alert event from Supabase
  app.get('/api/push/latest', async (_req, res) => {
    const latestAlert = await getLatestAlertFromSupabase();
    res.json({ latestAlert });
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
