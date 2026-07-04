import type { NetworkAdminConversion, AdvertiserConversion, AffiliateConversion } from '@cpatracker/types';
import { delay } from '../delay';
import { conversions } from '../data/conversions';
import { USE_MOCK } from '../config';

// Three separate functions, three separate return types — this is the actual
// enforcement point for CLAUDE.md's money-visibility rule on the frontend.
// Each function strips fields at the boundary rather than the caller trusting
// itself to ignore fields it shouldn't read.

export async function getNetworkAdminConversions(): Promise<NetworkAdminConversion[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return conversions;
}

export async function getAffiliateConversions(affiliateId: string): Promise<AffiliateConversion[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return conversions
    .filter((c) => c.affiliateId === affiliateId)
    .map(({ revenue: _revenue, profit: _profit, ...rest }) => rest);
}

export async function getAdvertiserConversions(advertiserId: string): Promise<AdvertiserConversion[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return conversions
    .filter((c) => c.advertiserId === advertiserId)
    .map(({ payout: _payout, profit: _profit, ...rest }) => rest);
}
