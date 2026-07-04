import type { Tenant } from '@cpatracker/types';

// Query-param contract (impersonate, tenantId, tenantName) is mirrored in
// apps/network-admin/src/Shell.tsx — keep both in sync if it changes.
export const NETWORK_ADMIN_URL = import.meta.env.VITE_NETWORK_ADMIN_URL ?? 'http://localhost:5173';

export function buildImpersonationUrl(tenant: Pick<Tenant, 'id' | 'companyName'>): string {
  const url = new URL(NETWORK_ADMIN_URL);
  url.searchParams.set('impersonate', '1');
  url.searchParams.set('tenantId', tenant.id);
  url.searchParams.set('tenantName', tenant.companyName);
  return url.toString();
}
