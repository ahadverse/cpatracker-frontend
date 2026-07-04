import type { Affiliate, AffiliateStatus } from '@cpatracker/types';
import { delay } from '../delay';
import { affiliateUsers, affiliates } from '../data/affiliates';
import { emptyRegistrationInfo } from '../data/registration';
import { USE_MOCK } from '../config';

export interface AffiliateFilters {
  status?: Affiliate['status'];
  country?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getAffiliates(filters?: AffiliateFilters): Promise<Affiliate[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return affiliates.filter((affiliate) => {
    if (filters?.status && affiliate.status !== filters.status) return false;
    if (filters?.country && affiliate.country !== filters.country) return false;
    if (filters?.dateFrom && affiliate.createdAt < filters.dateFrom) return false;
    if (filters?.dateTo && affiliate.createdAt > filters.dateTo) return false;
    return true;
  });
}

export async function getAffiliate(id: string): Promise<Affiliate | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return affiliates.find((affiliate) => affiliate.id === id);
}

export interface CreateAffiliateInput {
  name: string;
  email: string;
  company?: string;
  country: string;
}

export async function createAffiliate(input: CreateAffiliateInput): Promise<Affiliate> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const id = `affiliate-${affiliates.length + 1}-${Date.now()}`;
  const userId = `user-${id}`;
  affiliateUsers.push({ id: userId, email: input.email, role: 'AFFILIATE', status: 'ACTIVE', lastLoginAt: null });

  const affiliate: Affiliate = {
    id,
    userId,
    name: input.name,
    company: input.company,
    country: input.country,
    status: 'PENDING',
    registration: emptyRegistrationInfo(),
    createdAt: new Date().toISOString(),
  };
  affiliates.push(affiliate);
  return affiliate;
}

export async function updateAffiliateStatus(id: string, status: AffiliateStatus): Promise<Affiliate> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const affiliate = affiliates.find((a) => a.id === id);
  if (!affiliate) throw new Error(`Affiliate ${id} not found`);
  affiliate.status = status;
  return affiliate;
}

export interface UpdateAffiliateProfileInput {
  name: string;
  company?: string;
  country: string;
  phone?: string;
}

export async function updateAffiliateProfile(id: string, input: UpdateAffiliateProfileInput): Promise<Affiliate> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const affiliate = affiliates.find((a) => a.id === id);
  if (!affiliate) throw new Error(`Affiliate ${id} not found`);
  affiliate.name = input.name;
  affiliate.company = input.company;
  affiliate.country = input.country;
  if (input.phone !== undefined) affiliate.registration.phone = input.phone;
  return affiliate;
}

export async function updateAffiliatePostbackUrl(id: string, postbackUrl: string): Promise<Affiliate> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const affiliate = affiliates.find((a) => a.id === id);
  if (!affiliate) throw new Error(`Affiliate ${id} not found`);
  affiliate.postbackUrl = postbackUrl;
  return affiliate;
}
