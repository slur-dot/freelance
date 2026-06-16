/**
 * Company notification emails
 * Set in .env (see .env.example) or fallback to predefined production emails.
 */

export const COMPANY_CONTACT = {
  general: import.meta.env.VITE_GENERAL_EMAIL || 'freelance@freelance-224.com',
  noreply: import.meta.env.VITE_NOREPLY_EMAIL || 'noreply@freelance-224.com',
  newsletter: import.meta.env.VITE_NEWSLETTER_EMAIL || 'Newsletter@freelance-224.com',
  partnerships: import.meta.env.VITE_PARTNERSHIP_EMAIL || 'partners@freelance-224.com',
  talents: import.meta.env.VITE_TALENTS_EMAIL || 'talents@freelance-224.com',
  vendor: import.meta.env.VITE_VENDOR_EMAIL || 'Vendor@freelance-224.com',
  booking: import.meta.env.VITE_BOOKING_EMAIL || 'booking@freelance-224.com',
};

export function isCompanyEmailConfigured() {
  return true;
}
