import { getPaymentStatus, setCorsHeaders } from '../lib/djomy.js';

const SUCCESS_STATUSES = new Set(['SUCCESS', 'CAPTURED']);

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId, transactionId, status: returnStatus } = req.body || {};

  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  const normalizedReturn = (returnStatus || '').toUpperCase();
  if (normalizedReturn && normalizedReturn !== 'SUCCESS' && !transactionId) {
    return res.status(200).json({
      verified: false,
      status: normalizedReturn,
      message: 'Payment was not successful',
    });
  }

  if (!transactionId) {
    return res.status(400).json({
      error: 'transactionId is required to verify payment with Djomy',
    });
  }

  try {
    const data = await getPaymentStatus(transactionId);
    const apiStatus = (data.status || '').toUpperCase();
    const verified = SUCCESS_STATUSES.has(apiStatus);

    const merchantRef = data.merchantPaymentReference;
    if (verified && merchantRef && merchantRef !== orderId) {
      return res.status(403).json({
        verified: false,
        error: 'Payment reference does not match order',
        merchantPaymentReference: merchantRef,
      });
    }

    return res.status(200).json({
      verified,
      status: apiStatus,
      transactionId: data.transactionId || transactionId,
      merchantPaymentReference: merchantRef,
      paidAmount: data.paidAmount,
    });
  } catch (err) {
    console.error('[djomy-confirm]', err);
    return res.status(err.status || 500).json({
      verified: false,
      error: err.message || 'Payment verification failed',
      details: err.djomy || undefined,
    });
  }
}
