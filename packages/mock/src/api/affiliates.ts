import type { Affiliate } from '@cpatracker/types';
import { delay } from '../delay';
import { affiliates } from '../data/affiliates';
import { USE_MOCK } from '../config';

export interface AffiliateFilters {
  status?: Affiliate['status'];
}

export async function getAffiliates(filters?: AffiliateFilters): Promise<Affiliate[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return affiliates.filter((affiliate) => {
    if (filters?.status && affiliate.status !== filters.status) return false;
    return true;
  });
}

export async function getAffiliate(id: string): Promise<Affiliate | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return affiliates.find((affiliate) => affiliate.id === id);
}
