import type { Plan, Subscription, TenantInvoice } from '@cpatracker/types';
import { delay } from '../delay';
import { plans } from '../data/plans';
import { subscriptions } from '../data/subscriptions';
import { tenants } from '../data/tenants';
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

// --- Mutations (super-admin billing management) ---

export async function changeTenantPlan(tenantId: string, plan: string): Promise<Subscription> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const subscription = subscriptions.find((s) => s.tenantId === tenantId);
  if (!subscription) throw new Error(`Subscription for tenant ${tenantId} not found`);
  subscription.plan = plan;

  // Keep the tenant's denormalized plan in sync.
  const tenant = tenants.find((t) => t.id === tenantId);
  if (tenant) tenant.plan = plan;

  return subscription;
}

export async function markTenantInvoicePaid(id: string): Promise<TenantInvoice> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const invoice = tenantInvoices.find((i) => i.id === id);
  if (!invoice) throw new Error(`Tenant invoice ${id} not found`);
  invoice.status = 'PAID';
  return invoice;
}

export async function markTenantInvoiceUnpaid(id: string): Promise<TenantInvoice> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const invoice = tenantInvoices.find((i) => i.id === id);
  if (!invoice) throw new Error(`Tenant invoice ${id} not found`);
  invoice.status = 'PENDING';
  return invoice;
}

export interface CreateTenantInvoiceInput {
  tenantId: string;
  period: string;
  amount: number;
}

export async function createTenantInvoice(input: CreateTenantInvoiceInput): Promise<TenantInvoice> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const invoice: TenantInvoice = {
    id: `tenant-invoice-${input.tenantId}-${input.period}-${Date.now()}`,
    tenantId: input.tenantId,
    period: input.period,
    amount: input.amount,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  tenantInvoices.push(invoice);
  return invoice;
}

export interface CreatePlanInput {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export async function createPlan(input: CreatePlanInput): Promise<Plan> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  if (plans.some((p) => p.id === input.id)) throw new Error(`Plan ${input.id} already exists`);
  const plan: Plan = { id: input.id, name: input.name, price: input.price, features: input.features };
  plans.push(plan);
  return plan;
}

export interface UpdatePlanInput {
  name: string;
  price: number;
  features: string[];
}

export async function updatePlan(id: string, input: UpdatePlanInput): Promise<Plan> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const plan = plans.find((p) => p.id === id);
  if (!plan) throw new Error(`Plan ${id} not found`);
  plan.name = input.name;
  plan.price = input.price;
  plan.features = input.features;
  return plan;
}
