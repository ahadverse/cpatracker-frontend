import type { TenantInvoice } from '@cpatracker/types';
import { faker } from '../faker';
import { plans } from './plans';
import { tenants } from './tenants';

function periodsFor(): string[] {
  const now = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return d.toISOString().slice(0, 7);
  });
}

const priceByPlan = new Map(plans.map((p) => [p.id, p.price]));

export const tenantInvoices: TenantInvoice[] = tenants.flatMap((tenant) =>
  periodsFor().map((period, i) => ({
    id: `tenant-invoice-${tenant.id}-${period}`,
    tenantId: tenant.id,
    period,
    amount: priceByPlan.get(tenant.plan) ?? 0,
    status: i === 0 && tenant.status !== 'CANCELLED' ? 'PENDING' : 'PAID',
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  })),
);
