import { getPaymentStatus, setCorsHeaders } from '../lib/djomy.js';

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const transactionId = req.query?.transactionId;
  if (!transactionId) {
    return res.status(400).json({ error: 'transactionId query parameter is required' });
  }

  try {
    const data = await getPaymentStatus(transactionId);
    const status = (data.status || '').toUpperCase();
    const success = status === 'SUCCESS' || status === 'CAPTURED';

    return res.status(200).json({
      success,
      status,
      transactionId: data.transactionId || transactionId,
      merchantPaymentReference: data.merchantPaymentReference || null,
      paidAmount: data.paidAmount,
      data,
    });
  } catch (err) {
    console.error('[djomy-status]', err);
    return res.status(err.status || 500).json({
      error: err.message || 'Failed to fetch payment status',
      details: err.djomy || undefined,
    });
  }
}
