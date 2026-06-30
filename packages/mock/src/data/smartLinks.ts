import type { SmartLink } from '@cpatracker/types';
import { faker } from '../faker';
import { offers } from './offers';

const COUNT = 4;

export const smartLinks: SmartLink[] = Array.from({ length: COUNT }, (_, i) => {
  const id = `smart-link-${i + 1}`;
  const linkedOffers = faker.helpers.arrayElements(offers, { min: 2, max: 4 });

  return {
    id,
    name: `${faker.commerce.department()} Smart-Link`,
    offerIds: linkedOffers.map((offer) => offer.id),
    alias: `https://track.cpatracker.dev/s/${id}`,
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  };
});
