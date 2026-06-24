import type { Role, User } from '@cpatracker/types';
import { faker } from '../faker';

export function makeUser(role: Role, id: string): User {
  return {
    id,
    email: faker.internet.email().toLowerCase(),
    role,
    status: faker.helpers.weightedArrayElement([
      { value: 'ACTIVE', weight: 9 },
      { value: 'SUSPENDED', weight: 1 },
    ]),
    lastLoginAt: faker.date.recent({ days: 14 }).toISOString(),
  };
}

export const adminUser: User = {
  id: 'user-admin-1',
  email: 'admin@cpatracker.dev',
  role: 'ADMIN',
  status: 'ACTIVE',
  lastLoginAt: new Date().toISOString(),
};
