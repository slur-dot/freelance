/**
 * Client-side SMS API — calls server proxy only (no secrets in browser).
 * Transactional / informational use only (not login OTP).
 */

const SMS_ENDPOINT = '/api/nimba-sms';

function normalizePhone(phone) {
  if (!phone) return null;
  let p = String(phone).replace(/\s/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('00')) p = p.slice(2);
  if (/^\d{9}$/.test(p)) p = `224${p}`;
  return p;
}

export const SmsService = {
  async send({ to, message, senderName }) {
    const phones = (Array.isArray(to) ? to : [to])
      .map(normalizePhone)
      .filter(Boolean);

    if (phones.length === 0) {
      return { success: false, skipped: true, reason: 'no_phone' };
    }

    try {
      const res = await fetch(SMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phones,
          message,
          sender_name: senderName,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.warn('SMS send failed:', data);
        return { success: false, error: data.error || res.statusText };
      }

      return { success: true, data };
    } catch (err) {
      console.warn('SMS request error:', err);
      return { success: false, error: err.message };
    }
  },

  async sendToUser(userProfile, message) {
    const phone = userProfile?.phone || userProfile?.whatsapp;
    return this.send({ to: phone, message });
  },
};
