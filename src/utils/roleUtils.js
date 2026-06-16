/** Normalize role strings for comparison (rules accept admin/Admin). */
export function normalizeRole(role) {
  if (!role) return null;
  const r = String(role).trim();
  if (r.toLowerCase() === 'admin') return 'admin';
  return r;
}

export function rolesMatch(userRole, requiredRole) {
  const u = normalizeRole(userRole);
  const req = normalizeRole(requiredRole);
  if (!req) return true;
  if (req === 'admin') return u === 'admin';
  return u === req;
}

/** Only vendors may publish job postings (not freelancers or companies). */
export function canPostJobs(role) {
  const r = role && String(role).trim();
  return r === 'Vendor' || r === 'Seller';
}

export function getDashboardPathForRole(role) {
  const r = normalizeRole(role);
  switch (r) {
    case 'Freelancer': return '/freelancer/dashboard';
    case 'Company': return '/company/dashboard';
    case 'Vendor': return '/vendor/dashboard';
    case 'admin': return '/admin/dashboard';
    case 'Client': return '/Clients/dashboard';
    case 'Seller': return '/seller/dashboard';
    default: return '/';
  }
}

export const PROTECTED_USER_FIELDS = [
  'role', 'balance', 'status', 'createdAt', 'isBanned', 'isAdmin', 'commissionRate', 'totalEarned',
];

export function sanitizeUserUpdate(data) {
  const out = { ...data };
  PROTECTED_USER_FIELDS.forEach((k) => delete out[k]);
  return out;
}
