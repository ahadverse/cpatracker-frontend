import type { AdvertiserPlan } from '@cpatracker/types';

export const advertiserPlans: AdvertiserPlan[] = [
  {
    id: 'BASIC',
    name: 'Basic',
    price: 0,
    features: ['Up to 5 active offers', 'Standard reporting', 'Community support'],
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 99,
    features: ['Unlimited active offers', 'Advanced reporting', 'Priority support'],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 349,
    features: ['Unlimited active offers', 'Dedicated account manager', 'Custom integrations'],
  },
];
