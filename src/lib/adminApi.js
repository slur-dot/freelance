// Minimal Admin API client for fetching Firestore-backed collections via backend

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5092';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data?.data ?? data;
}

export const adminApi = {
  list: async (collection, { page = 1, limit = 20 } = {}) =>
    request(`/api/admin/${collection}?page=${page}&limit=${limit}`),
  get: async (collection, id) => request(`/api/admin/${collection}/${id}`),
  create: async (collection, payload) =>
    request(`/api/admin/${collection}`, { method: 'POST', body: JSON.stringify(payload) }),
  update: async (collection, id, payload) =>
    request(`/api/admin/${collection}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: async (collection, id) =>
    request(`/api/admin/${collection}/${id}`, { method: 'DELETE' }),
};

export default adminApi;


