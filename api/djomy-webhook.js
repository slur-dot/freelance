import { getDjomyConfig, verifyWebhookSignature } from '../lib/djomy.js';
import { markOrderPaidFromWebhook } from '../lib/firebaseAdmin.js';

async function readRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return JSON.stringify(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let rawString;
  try {
    rawString = await readRawBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid body' });
  }
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
    return res.status(400).json({ error: 'Invalid JSON payload' });
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

  return res.status(200).json({ received: true, eventType });
}
