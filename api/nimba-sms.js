/**
 * Server-side Nimba SMS relay — credentials must NOT use VITE_ prefix.
 * Env: NIMBA_SERVICE_ID, NIMBA_SECRET_TOKEN, NIMBA_SENDER_NAME
 */
const NIMBA_API = 'https://api.nimbasms.com/v1/messages';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serviceId = process.env.NIMBA_SERVICE_ID;
  const secretToken = process.env.NIMBA_SECRET_TOKEN;
  const defaultSender = process.env.NIMBA_SENDER_NAME;

  if (!serviceId || !secretToken) {
    return res.status(503).json({
      error: 'SMS not configured',
      message: 'Set NIMBA_SERVICE_ID and NIMBA_SECRET_TOKEN on the server.',
    });
  }

  const { to, message, sender_name } = req.body || {};

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing to or message' });
  }

  const recipients = Array.isArray(to) ? to : [to];
  const normalized = recipients
    .map((n) => String(n).replace(/\s/g, ''))
    .filter(Boolean);

  if (normalized.length === 0) {
    return res.status(400).json({ error: 'No valid phone numbers' });
  }

  const authHeader = `Basic ${Buffer.from(`${serviceId}:${secretToken}`).toString('base64')}`;

  try {
    const response = await fetch(NIMBA_API, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: normalized,
        message: String(message).slice(0, 1600),
        sender_name: sender_name || defaultSender || 'Freelance',
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Nimba API error', details: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'SMS send failed' });
  }
}
