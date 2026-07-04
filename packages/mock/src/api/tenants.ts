import type { PlanTier, Tenant, TenantStatus } from '@cpatracker/types';
import { delay } from '../delay';
import { subscriptions } from '../data/subscriptions';
import { tenants } from '../data/tenants';
import { USE_MOCK } from '../config';

export interface TenantFilters {
  status?: TenantStatus;
  plan?: PlanTier;
  search?: string;
}

export async function getTenants(filters?: TenantFilters): Promise<Tenant[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return tenants.filter((tenant) => {
    if (filters?.status && tenant.status !== filters.status) return false;
    if (filters?.plan && tenant.plan !== filters.plan) return false;
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      if (!tenant.companyName.toLowerCase().includes(q) && !tenant.contactEmail.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export async function getTenant(id: string): Promise<Tenant | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return tenants.find((tenant) => tenant.id === id);
}

export interface CreateTenantInput {
  companyName: string;
  contactEmail: string;
  plan: string;
}

export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const id = `tenant-${tenants.length + 1}-${Date.now()}`;
  const tenant: Tenant = {
    id,
    companyName: input.companyName,
    contactEmail: input.contactEmail,
    plan: input.plan,
    status: 'TRIAL',
    usage: { offers: 0, affiliates: 0, advertisers: 0, clicks: 0, conversions: 0 },
    createdAt: new Date().toISOString(),
  };
  tenants.push(tenant);
  subscriptions.push({
    tenantId: id,
    plan: input.plan,
    status: 'ACTIVE',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  return tenant;
}

export async function updateTenantStatus(id: string, status: TenantStatus): Promise<Tenant> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const tenant = tenants.find((t) => t.id === id);
  if (!tenant) throw new Error(`Tenant ${id} not found`);
  tenant.status = status;

  const subscription = subscriptions.find((s) => s.tenantId === id);
  if (subscription) {
    subscription.status = status === 'CANCELLED' ? 'CANCELLED' : status === 'SUSPENDED' ? 'PAST_DUE' : 'ACTIVE';
  }
  return tenant;
}
