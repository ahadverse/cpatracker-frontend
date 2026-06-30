import type { CapMetric, CapPeriod, Offer, OfferCap, OfferStatus, PayoutRule, TrafficType } from '@cpatracker/types';
import { faker } from '../faker';
import { advertisers } from './advertisers';
import { offerCategories } from './offerCategories';

const COUNT = 20;
const STATUSES: OfferStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'PAUSED'];
const TRAFFIC_TYPES: TrafficType[] = [
  'BANNER_DISPLAY',
  'EMAILING',
  'FACEBOOK',
  'INCENT_TRAFFIC',
  'INSTAGRAM',
  'MOBILE_TRAFFIC',
  'NATIVE',
  'NEWSLETTER',
  'PPV_POP',
  'SEARCH_PPC',
  'SEO',
  'SOCIAL_MEDIA',
  'TEXT_LINKS',
  'VIDEO',
  'YOUTUBE',
];
const GEOS = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'BR', 'IN'];
const DEVICES = ['DESKTOP', 'MOBILE', 'TABLET'];
const CAP_PERIODS: CapPeriod[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'OVERALL'];
const CAP_METRICS: CapMetric[] = ['CLICKS', 'CONVERSIONS', 'PAYOUT'];

function makePayoutRule(offerId: string, index: number): PayoutRule {
  const amount = faker.number.float({ min: 1, max: 60, fractionDigits: 2 });
  return {
    id: `payout-rule-${offerId}-${index}`,
    offerId,
    payoutMode: 'CPA',
    payoutType: 'FLAT',
    amount,
    revenueModel: faker.datatype.boolean(0.7) ? 'RPA' : 'NONE',
    revenueAmount: Number((amount * faker.number.float({ min: 1.1, max: 1.6, fractionDigits: 2 })).toFixed(2)),
    targeting: {
      countries: faker.datatype.boolean(0.5) ? faker.helpers.arrayElements(GEOS, { min: 1, max: 4 }) : [],
      devices: faker.datatype.boolean(0.4) ? faker.helpers.arrayElements(DEVICES, { min: 1, max: 2 }) : [],
      affiliateIds: [],
      affiliateGroupIds: [],
    },
    managerCommissionPercent: faker.number.int({ min: 0, max: 10 }),
    referAffiliateCommissionPercent: faker.number.int({ min: 0, max: 5 }),
    holdSchedule: {
      enabled: faker.datatype.boolean(0.4),
      days: faker.number.int({ min: 3, max: 30 }),
    },
    commissionPercent: faker.number.int({ min: 5, max: 20 }),
  };
}

function makeCaps(offerId: string): OfferCap[] {
  if (!faker.datatype.boolean(0.4)) return [];
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, (_, i) => ({
    id: `cap-${offerId}-${i + 1}`,
    period: faker.helpers.arrayElement(CAP_PERIODS),
    metric: faker.helpers.arrayElement(CAP_METRICS),
    limit: faker.number.int({ min: 50, max: 5000 }),
  }));
}

export const offers: Offer[] = Array.from({ length: COUNT }, (_, i) => {
  const id = `offer-${i + 1}`;
  const advertiser = faker.helpers.arrayElement(advertisers);

  return {
    id,
    advertiserId: advertiser.id,
    name: `${faker.company.buzzNoun()} ${faker.helpers.arrayElement(['Signup', 'Trial', 'Survey', 'App Install', 'Sale'])}`,
    description: faker.lorem.paragraph(),
    kpi: faker.lorem.sentence(),
    category: faker.helpers.arrayElement(offerCategories),
    currency: 'USD',
    status: faker.helpers.weightedArrayElement([
      { value: STATUSES[1]!, weight: 6 },
      { value: STATUSES[0]!, weight: 2 },
      { value: STATUSES[3]!, weight: 1 },
      { value: STATUSES[2]!, weight: 1 },
    ]),
    trackingLink: `https://track.cpatracker.dev/click?offer_id=${id}&aff_id={click_id}`,
    trackingPlatform: 'DIRECT',
    trafficTypes: faker.helpers.arrayElements(TRAFFIC_TYPES, { min: 1, max: 4 }),
    featured: faker.datatype.boolean(0.2),
    autoApproveConversions: faker.datatype.boolean(0.3),
    allowDeepLinking: faker.datatype.boolean(0.6),
    payoutRules: [makePayoutRule(id, 1)],
    caps: makeCaps(id),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  };
});
