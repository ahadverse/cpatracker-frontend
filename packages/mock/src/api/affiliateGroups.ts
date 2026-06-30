import type { AffiliateGroup } from '@cpatracker/types';
import { delay } from '../delay';
import { affiliateGroups } from '../data/affiliateGroups';
import { USE_MOCK } from '../config';

export async function getAffiliateGroups(): Promise<AffiliateGroup[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return affiliateGroups;
}

export type CreateAffiliateGroupInput = Pick<AffiliateGroup, 'name' | 'affiliateIds'>;

export async function createAffiliateGroup(input: CreateAffiliateGroupInput): Promise<AffiliateGroup> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const group: AffiliateGroup = {
    ...input,
    id: `affiliate-group-${affiliateGroups.length + 1}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  affiliateGroups.push(group);
  return group;
}
