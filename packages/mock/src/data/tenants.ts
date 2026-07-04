import type { PlanTier, Tenant, TenantStatus } from '@cpatracker/types';
import { faker } from '../faker';

const COUNT = 15;
const STATUSES: TenantStatus[] = ['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED'];
const PLANS: PlanTier[] = ['STARTER', 'GROWTH', 'ENTERPRISE'];

export const tenants: Tenant[] = Array.from({ length: COUNT }, (_, i) => ({
  id: `tenant-${i + 1}`,
  companyName: faker.company.name(),
  contactEmail: faker.internet.email().toLowerCase(),
  plan: faker.helpers.weightedArrayElement([
    { value: PLANS[0]!, weight: 5 },
    { value: PLANS[1]!, weight: 3 },
    { value: PLANS[2]!, weight: 1 },
  ]),
  status: faker.helpers.weightedArrayElement([
    { value: STATUSES[1]!, weight: 7 },
    { value: STATUSES[0]!, weight: 4 },
    { value: STATUSES[2]!, weight: 2 },
    { value: STATUSES[3]!, weight: 1 },
  ]),
  usage: {
    offers: faker.number.int({ min: 2, max: 60 }),
    affiliates: faker.number.int({ min: 5, max: 500 }),
    advertisers: faker.number.int({ min: 1, max: 40 }),
    clicks: faker.number.int({ min: 1000, max: 500000 }),
    conversions: faker.number.int({ min: 20, max: 8000 }),
  },
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}));
