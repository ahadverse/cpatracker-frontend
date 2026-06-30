import type { AffiliateGroup } from '@cpatracker/types';
import { faker } from '../faker';
import { affiliates } from './affiliates';

const NAMES = ['Top Performers', 'New Signups', 'EU Traffic', 'Incent Specialists'];

export const affiliateGroups: AffiliateGroup[] = NAMES.map((name, i) => ({
  id: `affiliate-group-${i + 1}`,
  name,
  affiliateIds: faker.helpers.arrayElements(affiliates, { min: 2, max: 5 }).map((a) => a.id),
  createdAt: faker.date.past({ years: 1 }).toISOString(),
}));
