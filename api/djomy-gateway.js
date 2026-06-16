import {
  createGatewayPayment,
  resolvePublicBaseUrl,
  setCorsHeaders,
} from '../lib/djomy.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
      return res.status(400).json({ error: 'merchantPaymentReference (order id) is required' });
    }
    if (!payerNumber) {
      return res.status(400).json({ error: 'payerNumber is required' });
    }

    const baseUrl = resolvePublicBaseUrl(origin);
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
      return res.status(502).json({ error: 'Djomy did not return a redirect URL', data });
    }

    return res.status(200).json({
      success: true,
      transactionId: data.transactionId,
      redirectUrl,
      status: data.status,
    });
  } catch (err) {
    console.error('[djomy-gateway]', err);
    return res.status(err.status || 500).json({
      error: err.message || 'Djomy gateway initiation failed',
      details: err.djomy || undefined,
    });
  }
}
