import type { Advertiser, User } from '@cpatracker/types';
import { faker } from '../faker';
import { makeUser } from './users';

const COUNT = 8;

export const advertiserUsers: User[] = Array.from({ length: COUNT }, (_, i) =>
  makeUser('ADVERTISER', `user-advertiser-${i + 1}`),
);

export const advertisers: Advertiser[] = advertiserUsers.map((user, i) => ({
  id: `advertiser-${i + 1}`,
  userId: user.id,
  name: faker.person.fullName(),
  company: faker.company.name(),
  country: faker.location.countryCode(),
  status: faker.helpers.weightedArrayElement([
    { value: 'ACTIVE', weight: 8 },
    { value: 'PENDING', weight: 1 },
    { value: 'SUSPENDED', weight: 1 },
  ]),
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}));
