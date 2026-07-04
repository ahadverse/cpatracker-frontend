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
  role: 'NETWORK_ADMIN',
  status: 'ACTIVE',
  lastLoginAt: new Date().toISOString(),
};

// Stand-in for "the network this admin operates," so the admin's own platform
// subscription can be looked up via the existing tenant/subscription api.
export const adminTenantId = 'tenant-1';
