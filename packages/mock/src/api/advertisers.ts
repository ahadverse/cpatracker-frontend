import type { Advertiser, AdvertiserStatus } from '@cpatracker/types';
import { delay } from '../delay';
import { advertiserUsers, advertisers } from '../data/advertisers';
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

export interface CreateAdvertiserInput {
  name: string;
  email: string;
  company: string;
  country: string;
}

export async function createAdvertiser(input: CreateAdvertiserInput): Promise<Advertiser> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const id = `advertiser-${advertisers.length + 1}-${Date.now()}`;
  const userId = `user-${id}`;
  advertiserUsers.push({ id: userId, email: input.email, role: 'ADVERTISER', status: 'ACTIVE', lastLoginAt: null });

  const advertiser: Advertiser = {
    id,
    userId,
    name: input.name,
    company: input.company,
    country: input.country,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  advertisers.push(advertiser);
  return advertiser;
}

export async function updateAdvertiserStatus(id: string, status: AdvertiserStatus): Promise<Advertiser> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const advertiser = advertisers.find((a) => a.id === id);
  if (!advertiser) throw new Error(`Advertiser ${id} not found`);
  advertiser.status = status;
  return advertiser;
}

export interface UpdateAdvertiserProfileInput {
  name: string;
  company: string;
  country: string;
}

export async function updateAdvertiserProfile(id: string, input: UpdateAdvertiserProfileInput): Promise<Advertiser> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const advertiser = advertisers.find((a) => a.id === id);
  if (!advertiser) throw new Error(`Advertiser ${id} not found`);
  advertiser.name = input.name;
  advertiser.company = input.company;
  advertiser.country = input.country;
  return advertiser;
}

export async function updateAdvertiserPostbackUrl(id: string, postbackUrl: string): Promise<Advertiser> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const advertiser = advertisers.find((a) => a.id === id);
  if (!advertiser) throw new Error(`Advertiser ${id} not found`);
  advertiser.postbackUrl = postbackUrl;
  return advertiser;
}
