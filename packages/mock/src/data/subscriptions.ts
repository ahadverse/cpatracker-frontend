import type { Subscription } from '@cpatracker/types';
import { faker } from '../faker';
import { tenants } from './tenants';

export const subscriptions: Subscription[] = tenants.map((tenant) => ({
  tenantId: tenant.id,
  plan: tenant.plan,
  status:
    tenant.status === 'CANCELLED' ? 'CANCELLED' : tenant.status === 'SUSPENDED' ? 'PAST_DUE' : 'ACTIVE',
  nextBillingDate: faker.date.soon({ days: 30 }).toISOString(),
}));
