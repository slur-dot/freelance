// Utility to join class names conditionally
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}

export function getApiBase() {
  return import.meta.env.VITE_API_BASE || 'http://localhost:5092';
}

export function getQueryParam(name) {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || '';
}

export async function resolveVendorId() {
  // Priority: URL ?vendorId=... -> localStorage -> fetch vendors
  const fromUrl = getQueryParam('vendorId');
  if (fromUrl) {
    localStorage.setItem('vendorId', fromUrl);
    return fromUrl;
  }
  const fromStorage = localStorage.getItem('vendorId');
  if (fromStorage) return fromStorage;

  try {
    const base = getApiBase();
    const res = await fetch(`${base}/api/vendors?limit=10&page=1`);
    const json = await res.json();
    const list = json?.data?.vendors || json?.data?.companies || [];
    if (Array.isArray(list) && list.length) {
      const cherifa = list.find(v => (v.email || '').toLowerCase() === 'sales@cherifa-tech.com');
      const id = (cherifa || list[0]).id;
      if (id) localStorage.setItem('vendorId', id);
      return id || '';
    }
  } catch (e) {
    // ignore, handled by caller
  }
  return '';
}