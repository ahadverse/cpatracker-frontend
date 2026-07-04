import type { Affiliate, User } from '@cpatracker/types';
import { faker } from '../faker';
import { makeUser } from './users';
import { makeRegistrationInfo } from './registration';

const COUNT = 15;

export const affiliateUsers: User[] = Array.from({ length: COUNT }, (_, i) =>
  makeUser('AFFILIATE', `user-affiliate-${i + 1}`),
);

export const affiliates: Affiliate[] = affiliateUsers.map((user, i) => ({
  id: `affiliate-${i + 1}`,
  userId: user.id,
  name: faker.person.fullName(),
  company: faker.datatype.boolean(0.6) ? faker.company.name() : undefined,
  country: faker.location.countryCode(),
  status: faker.helpers.weightedArrayElement([
    { value: 'ACTIVE', weight: 7 },
    { value: 'PENDING', weight: 2 },
    { value: 'SUSPENDED', weight: 1 },
  ]),
  referredBy: i > 3 && faker.datatype.boolean(0.3) ? `affiliate-${faker.number.int({ min: 1, max: i })}` : undefined,
  registration: makeRegistrationInfo(),
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}));

// Stand-in for a current-user/session concept (the affiliate portal has no auth
// yet) — same role adminUser plays for the admin app. Forced ACTIVE so the
// "logged in" affiliate isn't randomly PENDING/SUSPENDED from the fixture roll.
affiliates[0]!.status = 'ACTIVE';
export const demoAffiliate: Affiliate = affiliates[0]!;
