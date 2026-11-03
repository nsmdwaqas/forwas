import {
  PERMANENT_VAPID_PUBLIC_KEY,
  upsertSubscriptionInSupabase,
  dispatchWebPushToPartnerDevices,
  getLatestAlertFromSupabase
} from '../../src/lib/pushServerEngine';

interface NetlifyEvent {
  httpMethod: string;
  path: string;
  body: string | null;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const reqPath = event.path || '';

  try {
    // 1. GET /api/push/vapid-public-key
    if (event.httpMethod === 'GET' && reqPath.endsWith('/vapid-public-key')) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ publicKey: PERMANENT_VAPID_PUBLIC_KEY })
      };
    }

    // 2. GET /api/push/latest
    if (event.httpMethod === 'GET' && reqPath.endsWith('/latest')) {
      const latestAlert = await getLatestAlertFromSupabase();
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ latestAlert })
      };
    }

    // 3. POST /api/push/subscribe
    if (event.httpMethod === 'POST' && reqPath.endsWith('/subscribe')) {
      const parsed = event.body ? JSON.parse(event.body) : {};
      const { deviceId, soul, subscription } = parsed;

      if (!deviceId || !subscription || !subscription.endpoint) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing deviceId or valid push subscription' })
        };
      }

      const normalizedSoul: 'Shajer' | 'Waqas' =
        String(soul).toLowerCase().includes('shajer') ? 'Shajer' : 'Waqas';

      const count = await upsertSubscriptionInSupabase({
        deviceId,
        soul: normalizedSoul,
        subscription,
        updatedAt: new Date().toISOString()
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ok: true, count })
      };
    }

    // 4. POST /api/push/send
    if (event.httpMethod === 'POST' && reqPath.endsWith('/send')) {
      const parsed = event.body ? JSON.parse(event.body) : {};
      const {
        senderDeviceId,
        senderSoul,
        isMutualWithin10Mins,
        eventId,
        title,
        body,
        vibrate
      } = parsed;

      if (!senderDeviceId) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing senderDeviceId' })
        };
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

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          ok: true,
          ...result
        })
      };
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Not Found', path: reqPath })
    };
  } catch (err: unknown) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: (err as Error)?.message || 'Internal Server Error'
      })
    };
  }
};
