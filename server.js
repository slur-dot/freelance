import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  createGatewayPayment,
  getPaymentStatus,
  resolvePublicBaseUrl,
  verifyWebhookSignature,
  getDjomyConfig,
} from './lib/djomy.js';
import { markOrderPaidFromWebhook } from './lib/firebaseAdmin.js';

const app = express();
app.use(cors());

app.post('/api/djomy-gateway', express.json(), async (req, res) => {
  try {
    const {
      amount,
      countryCode = 'GN',
      payerNumber,
      merchantPaymentReference,
      description,
      allowedPaymentMethods,
      metadata,
      origin,
    } = req.body || {};

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!merchantPaymentReference) {
      return res.status(400).json({ error: 'merchantPaymentReference is required' });
    }
    if (!payerNumber) {
      return res.status(400).json({ error: 'payerNumber is required' });
    }

    const baseUrl = resolvePublicBaseUrl(origin || req.headers.origin);
    const returnUrl = `${baseUrl}/checkout/success?orderId=${encodeURIComponent(merchantPaymentReference)}`;
    const cancelUrl = `${baseUrl}/checkout/cart`;

    const data = await createGatewayPayment({
      amount,
      countryCode,
      payerNumber,
      merchantPaymentReference,
      description,
      allowedPaymentMethods,
      returnUrl,
      cancelUrl,
      metadata: metadata || { order_id: merchantPaymentReference },
    });

    const redirectUrl = data.redirectUrl || data.paymentUrl;
    if (!redirectUrl) {
      return res.status(502).json({ error: 'Djomy did not return a redirect URL' });
    }

    res.json({
      success: true,
      transactionId: data.transactionId,
      redirectUrl,
      status: data.status,
    });
  } catch (err) {
    console.error('[djomy-gateway]', err);
    res.status(err.status || 500).json({ error: err.message, details: err.djomy });
  }
});

app.get('/api/djomy-status', async (req, res) => {
  const transactionId = req.query.transactionId;
  if (!transactionId) {
    return res.status(400).json({ error: 'transactionId is required' });
  }
  try {
    const data = await getPaymentStatus(String(transactionId));
    const status = (data.status || '').toUpperCase();
    res.json({
      success: status === 'SUCCESS' || status === 'CAPTURED',
      status,
      transactionId: data.transactionId || transactionId,
      merchantPaymentReference: data.merchantPaymentReference,
      data,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, details: err.djomy });
  }
});

app.post('/api/djomy-confirm', express.json(), async (req, res) => {
  const { orderId, transactionId, status: returnStatus } = req.body || {};
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const normalizedReturn = (returnStatus || '').toUpperCase();
  if (normalizedReturn && normalizedReturn !== 'SUCCESS' && !transactionId) {
    return res.json({ verified: false, status: normalizedReturn });
  }
  if (!transactionId) {
    return res.status(400).json({ error: 'transactionId is required' });
  }

  try {
    const data = await getPaymentStatus(transactionId);
    const apiStatus = (data.status || '').toUpperCase();
    const verified = apiStatus === 'SUCCESS' || apiStatus === 'CAPTURED';
    const merchantRef = data.merchantPaymentReference;

    if (verified && merchantRef && merchantRef !== orderId) {
      return res.status(403).json({ verified: false, error: 'Payment reference mismatch' });
    }

    res.json({
      verified,
      status: apiStatus,
      transactionId: data.transactionId || transactionId,
      merchantPaymentReference: merchantRef,
    });
  } catch (err) {
    res.status(err.status || 500).json({ verified: false, error: err.message });
  }
});

app.post(
  '/api/djomy-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const rawString = req.body?.toString('utf8') || '';
    const signature = req.headers['x-webhook-signature'];

    let clientSecret;
    try {
      clientSecret = getDjomyConfig().clientSecret;
    } catch {
      return res.status(503).json({ error: 'Djomy not configured' });
    }

    if (!verifyWebhookSignature(rawString, signature, clientSecret)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    let payload;
    try {
      payload = JSON.parse(rawString);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }

    const eventType = payload.eventType;
    const payment = payload.data || {};
    const orderId =
      payment.merchantPaymentReference ||
      payload.metadata?.order_id ||
      payment.metadata?.order_id;

    if (eventType === 'payment.success' && orderId) {
      await markOrderPaidFromWebhook(orderId, {
        transactionId: payment.transactionId,
        paymentRef: payment.transactionId,
      });
    }

    res.json({ received: true, eventType });
  }
);

app.post('/api/nimba-sms', express.json(), async (req, res) => {
  const serviceId = process.env.NIMBA_SERVICE_ID;
  const secretToken = process.env.NIMBA_SECRET_TOKEN;
  const defaultSender = process.env.NIMBA_SENDER_NAME;

  if (!serviceId || !secretToken) {
    return res.status(503).json({ error: 'SMS not configured' });
  }

  const { to, message, sender_name } = req.body || {};
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing to or message' });
  }

  const recipients = (Array.isArray(to) ? to : [to]).map((n) => String(n).replace(/\s/g, '')).filter(Boolean);
  const authHeader = `Basic ${Buffer.from(`${serviceId}:${secretToken}`).toString('base64')}`;

  try {
    const response = await fetch('https://api.nimbasms.com/v1/messages', {
      method: 'POST',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipients,
        message: String(message).slice(0, 1600),
        sender_name: sender_name || defaultSender || 'Freelance',
      }),
    });
    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }
    res.status(response.status).json(response.ok ? { success: true, data: json } : { error: json });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend proxy running on port ${PORT}`);
});
