export type AdvertiserPlanTier = 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface AdvertiserPlan {
  id: AdvertiserPlanTier;
  name: string;
  price: number;
  features: string[];
}

export type AdvertiserSubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

export interface AdvertiserSubscription {
  advertiserId: string;
  plan: AdvertiserPlanTier;
  status: AdvertiserSubscriptionStatus;
  nextBillingDate: string;
}
