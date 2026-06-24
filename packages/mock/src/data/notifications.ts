import type { Notification } from '@cpatracker/types';
import { faker } from '../faker';
import { adminUser } from './users';
import { affiliateUsers } from './affiliates';
import { advertiserUsers } from './advertisers';

const allUsers = [adminUser, ...affiliateUsers, ...advertiserUsers];

const TYPES = ['offer_approved', 'conversion_approved', 'payment_sent', 'new_message', 'offer_paused'];

export const notifications: Notification[] = allUsers.flatMap((user) =>
  Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, (_, i) => {
    const type = faker.helpers.arrayElement(TYPES);
    return {
      id: `notification-${user.id}-${i + 1}`,
      userId: user.id,
      type,
      message: faker.lorem.sentence(),
      link: faker.datatype.boolean(0.5) ? '/notifications' : undefined,
      readAt: faker.datatype.boolean(0.5) ? faker.date.recent({ days: 5 }).toISOString() : null,
      createdAt: faker.date.recent({ days: 15 }).toISOString(),
    };
  }),
);
