import type { OfferAccessRequest, OfferAccessStatus } from '@cpatracker/types';
import { faker } from '../faker';
import { affiliates } from './affiliates';
import { offers } from './offers';

const STATUSES: OfferAccessStatus[] = ['APPROVED', 'PENDING', 'REJECTED'];

export const offerAccessRequests: OfferAccessRequest[] = affiliates.flatMap((affiliate) => {
  const requestedOffers = faker.helpers.arrayElements(offers, { min: 4, max: offers.length });

  return requestedOffers.map((offer) => ({
    id: `access-request-${affiliate.id}-${offer.id}`,
    offerId: offer.id,
    affiliateId: affiliate.id,
    status: faker.helpers.weightedArrayElement([
      { value: STATUSES[0]!, weight: 7 },
      { value: STATUSES[1]!, weight: 2 },
      { value: STATUSES[2]!, weight: 1 },
    ]),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  }));
});
