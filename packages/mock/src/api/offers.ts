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

export type CreateOfferInput = Omit<Offer, 'id' | 'createdAt'> & { id?: string };

export async function createOffer(input: CreateOfferInput): Promise<Offer> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const offer: Offer = {
    ...input,
    id: input.id ?? `offer-${offers.length + 1}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  offers.push(offer);
  return offer;
}

export async function updateOfferStatus(id: string, status: OfferStatus): Promise<Offer> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const offer = offers.find((o) => o.id === id);
  if (!offer) throw new Error(`Offer ${id} not found`);
  offer.status = status;
  return offer;
}
