import type { OfferAccessRequest, OfferAccessStatus } from '@cpatracker/types';
import { delay } from '../delay';
import { offerAccessRequests } from '../data/offerAccessRequests';
import { USE_MOCK } from '../config';

export async function getOfferAccessRequests(affiliateId?: string): Promise<OfferAccessRequest[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return affiliateId
    ? offerAccessRequests.filter((r) => r.affiliateId === affiliateId)
    : offerAccessRequests;
}

export async function requestOfferAccess(offerId: string, affiliateId: string): Promise<OfferAccessRequest> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const existing = offerAccessRequests.find((r) => r.offerId === offerId && r.affiliateId === affiliateId);
  if (existing) return existing;

  const request: OfferAccessRequest = {
    id: `access-request-${affiliateId}-${offerId}-${Date.now()}`,
    offerId,
    affiliateId,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  offerAccessRequests.push(request);
  return request;
}

export async function updateOfferAccessRequestStatus(
  id: string,
  status: OfferAccessStatus,
): Promise<OfferAccessRequest> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const request = offerAccessRequests.find((r) => r.id === id);
  if (!request) throw new Error(`Offer access request ${id} not found`);
  request.status = status;
  return request;
}
