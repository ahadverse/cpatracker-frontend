import type { Offer, OfferStatus, TrafficType } from '@cpatracker/types';
import { faker } from '../faker';
import { advertisers } from './advertisers';

const COUNT = 20;
const STATUSES: OfferStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'PAUSED'];
const TRAFFIC_TYPES: TrafficType[] = ['EMAIL', 'SOCIAL', 'SEARCH', 'PUSH', 'NATIVE', 'INCENT'];
const GEOS = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'BR', 'IN'];
const DEVICES = ['DESKTOP', 'MOBILE', 'TABLET'];

export const offers: Offer[] = Array.from({ length: COUNT }, (_, i) => {
  const id = `offer-${i + 1}`;
  const advertiser = faker.helpers.arrayElement(advertisers);
  const amount = faker.number.float({ min: 1, max: 60, fractionDigits: 2 });

  return {
    id,
    advertiserId: advertiser.id,
    name: `${faker.company.buzzNoun()} ${faker.helpers.arrayElement(['Signup', 'Trial', 'Survey', 'App Install', 'Sale'])}`,
    status: faker.helpers.weightedArrayElement([
      { value: STATUSES[1]!, weight: 6 },
      { value: STATUSES[0]!, weight: 2 },
      { value: STATUSES[3]!, weight: 1 },
      { value: STATUSES[2]!, weight: 1 },
    ]),
    trackingLink: `https://track.cpatracker.dev/click?offer_id=${id}&aff_id={click_id}`,
    trafficTypes: faker.helpers.arrayElements(TRAFFIC_TYPES, { min: 1, max: 3 }),
    payoutRule: {
      id: `payout-rule-${i + 1}`,
      offerId: id,
      geoTargets: faker.helpers.arrayElements(GEOS, { min: 1, max: 4 }),
      deviceTargets: faker.helpers.arrayElements(DEVICES, { min: 1, max: 3 }),
      amount,
      dailyCap: faker.datatype.boolean(0.5) ? faker.number.int({ min: 50, max: 500 }) : undefined,
      totalCap: faker.datatype.boolean(0.3) ? faker.number.int({ min: 1000, max: 10000 }) : undefined,
      holdSchedule: {
        enabled: faker.datatype.boolean(0.4),
        days: faker.number.int({ min: 3, max: 30 }),
      },
      commissionPercent: faker.number.int({ min: 5, max: 20 }),
    },
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  };
});
