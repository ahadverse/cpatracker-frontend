import type { AdvertiserPlan, AdvertiserPlanTier, AdvertiserSubscription, AdvertiserSubscriptionStatus } from '@cpatracker/types';
import { delay } from '../delay';
import { advertiserPlans } from '../data/advertiserPlans';
import { advertiserSubscriptions } from '../data/advertiserSubscriptions';
import { USE_MOCK } from '../config';

export async function getAdvertiserPlans(): Promise<AdvertiserPlan[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return advertiserPlans;
}

export interface AdvertiserSubscriptionFilters {
  plan?: AdvertiserPlanTier;
  status?: AdvertiserSubscriptionStatus;
}

export async function getAdvertiserSubscriptions(
  filters?: AdvertiserSubscriptionFilters,
): Promise<AdvertiserSubscription[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return advertiserSubscriptions.filter((subscription) => {
    if (filters?.plan && subscription.plan !== filters.plan) return false;
    if (filters?.status && subscription.status !== filters.status) return false;
    return true;
  });
}

export async function getAdvertiserSubscription(advertiserId: string): Promise<AdvertiserSubscription | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return advertiserSubscriptions.find((subscription) => subscription.advertiserId === advertiserId);
}

export async function updateAdvertiserSubscriptionPlan(
  advertiserId: string,
  plan: AdvertiserPlanTier,
): Promise<AdvertiserSubscription> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const subscription = advertiserSubscriptions.find((s) => s.advertiserId === advertiserId);
  if (!subscription) throw new Error(`Subscription for advertiser ${advertiserId} not found`);
  subscription.plan = plan;
  return subscription;
}
