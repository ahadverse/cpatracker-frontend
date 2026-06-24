import type { Advertiser } from '@cpatracker/types';
import { delay } from '../delay';
import { advertisers } from '../data/advertisers';
import { USE_MOCK } from '../config';

export interface AdvertiserFilters {
  status?: Advertiser['status'];
}

export async function getAdvertisers(filters?: AdvertiserFilters): Promise<Advertiser[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return advertisers.filter((advertiser) => {
    if (filters?.status && advertiser.status !== filters.status) return false;
    return true;
  });
}

export async function getAdvertiser(id: string): Promise<Advertiser | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return advertisers.find((advertiser) => advertiser.id === id);
}
