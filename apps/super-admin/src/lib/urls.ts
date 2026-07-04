import type { Tenant } from '@cpatracker/types';

// Query-param contract (impersonate, tenantId, tenantName) is mirrored in
// apps/network-admin/src/Shell.tsx — keep both in sync if it changes.
//
// Resolution order:
//   1. VITE_NETWORK_ADMIN_URL env override (set this per-deployment when the
//      network-admin domain differs from the default below).
//   2. In a production build, the deployed network-admin domain.
//   3. In local dev, network-admin's pinned dev port (see its vite.config.ts).
const PROD_NETWORK_ADMIN_URL = 'https://cpatracker-network-admin.vercel.app';
export const NETWORK_ADMIN_URL =
  import.meta.env.VITE_NETWORK_ADMIN_URL ??
  (import.meta.env.PROD ? PROD_NETWORK_ADMIN_URL : 'http://localhost:5173');

export function buildImpersonationUrl(tenant: Pick<Tenant, 'id' | 'companyName'>): string {
  const url = new URL(NETWORK_ADMIN_URL);
  url.searchParams.set('impersonate', '1');
  url.searchParams.set('tenantId', tenant.id);
  url.searchParams.set('tenantName', tenant.companyName);
  return url.toString();
}
