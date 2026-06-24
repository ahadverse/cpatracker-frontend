import type { Offer, OfferStatus } from '@cpatracker/types';
import { delay } from '../delay';
import { offers } from '../data/offers';
import { USE_MOCK } from '../config';

export interface OfferFilters {
  advertiserId?: string;
  status?: OfferStatus;
}

export async function getOffers(filters?: OfferFilters): Promise<Offer[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return offers.filter((offer) => {
    if (filters?.advertiserId && offer.advertiserId !== filters.advertiserId) return false;
    if (filters?.status && offer.status !== filters.status) return false;
    return true;
  });
}

export async function getOffer(id: string): Promise<Offer | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return offers.find((offer) => offer.id === id);
}
