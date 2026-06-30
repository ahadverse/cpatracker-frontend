import type { AdminConversion, ConversionStatus } from '@cpatracker/types';
import { faker } from '../faker';
import { clicks } from './clicks';
import { offers } from './offers';

const STATUSES: ConversionStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

const convertingClicks = clicks.filter(
  (click) => click.qualityStatus === 'VALID' && faker.datatype.boolean(0.3),
);

// AdminConversion carries every money field (revenue/payout/profit); the
// role-scoped api functions (getAffiliateConversions/getAdvertiserConversions)
// strip fields down to AffiliateConversion/AdvertiserConversion at the boundary
// instead of regenerating fixtures — see api/conversions.ts.
export const conversions: AdminConversion[] = convertingClicks.map((click, i) => {
  const offer = offers.find((o) => o.id === click.offerId)!;
  const payout = offer.payoutRules[0]!.amount;
  const revenue = Number((payout * faker.number.float({ min: 1.1, max: 1.6, fractionDigits: 2 })).toFixed(2));

  return {
    id: `conversion-${i + 1}`,
    clickId: click.id,
    offerId: offer.id,
    affiliateId: click.affiliateId,
    advertiserId: offer.advertiserId,
    goal: faker.helpers.arrayElement(['sale', 'signup', 'trial', 'lead']),
    txnId: faker.datatype.boolean(0.7) ? faker.string.alphanumeric(10).toUpperCase() : undefined,
    status: faker.helpers.weightedArrayElement([
      { value: STATUSES[1]!, weight: 6 },
      { value: STATUSES[0]!, weight: 3 },
      { value: STATUSES[2]!, weight: 1 },
    ]),
    subIds: click.subIds,
    revenue,
    payout,
    profit: Number((revenue - payout).toFixed(2)),
    createdAt: faker.date.recent({ days: 28 }).toISOString(),
  };
});
