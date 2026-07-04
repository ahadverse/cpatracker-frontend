import type { AdvertiserPlanTier, AdvertiserSubscription } from '@cpatracker/types';
import { faker } from '../faker';
import { advertisers } from './advertisers';

const PLANS: AdvertiserPlanTier[] = ['BASIC', 'PRO', 'ENTERPRISE'];

export const advertiserSubscriptions: AdvertiserSubscription[] = advertisers.map((advertiser) => {
  const plan = faker.helpers.weightedArrayElement([
    { value: PLANS[0]!, weight: 4 },
    { value: PLANS[1]!, weight: 3 },
    { value: PLANS[2]!, weight: 1 },
  ]);
  return {
    advertiserId: advertiser.id,
    plan,
    status:
      advertiser.status === 'SUSPENDED'
        ? 'PAST_DUE'
        : advertiser.status === 'PENDING'
          ? 'ACTIVE'
          : faker.helpers.weightedArrayElement([
              { value: 'ACTIVE' as const, weight: 9 },
              { value: 'PAST_DUE' as const, weight: 1 },
            ]),
    nextBillingDate: faker.date.soon({ days: 30 }).toISOString(),
  };
});
