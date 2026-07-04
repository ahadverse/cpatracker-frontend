import type { Plan } from '@cpatracker/types';

export const plans: Plan[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 49,
    features: ['1 network', 'Up to 10 offers', 'Email support'],
  },
  {
    id: 'GROWTH',
    name: 'Growth',
    price: 199,
    features: ['1 network', 'Unlimited offers', 'Priority support', 'Advanced reports'],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 599,
    features: ['1 network', 'Unlimited everything', 'Dedicated account manager', 'Custom integrations'],
  },
];
