import type { Plan, Subscription, TenantInvoice } from '@cpatracker/types';
import { delay } from '../delay';
import { plans } from '../data/plans';
import { subscriptions } from '../data/subscriptions';
import { tenantInvoices } from '../data/tenantInvoices';
import { USE_MOCK } from '../config';

export async function getPlans(): Promise<Plan[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return plans;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return subscriptions;
}

export async function getSubscription(tenantId: string): Promise<Subscription | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return subscriptions.find((s) => s.tenantId === tenantId);
}

export async function getTenantInvoices(tenantId?: string): Promise<TenantInvoice[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return tenantInvoices.filter((invoice) => !tenantId || invoice.tenantId === tenantId);
}
