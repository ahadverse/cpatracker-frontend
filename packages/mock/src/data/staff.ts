import type { StaffMember, StaffRole } from '@cpatracker/types';
import { faker } from '../faker';
import { demoSuperAdmin } from './superAdmin';

const COUNT = 6;
const ROLES: StaffRole[] = ['SUPER_ADMIN', 'OPERATIONS', 'SUPPORT'];

export const staff: StaffMember[] = [
  {
    id: 'staff-1',
    name: demoSuperAdmin.name,
    email: demoSuperAdmin.email,
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: new Date('2025-01-06').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  ...Array.from({ length: COUNT }, (_, i) => ({
    id: `staff-${i + 2}`,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: faker.helpers.weightedArrayElement([
      { value: ROLES[0]!, weight: 1 },
      { value: ROLES[1]!, weight: 3 },
      { value: ROLES[2]!, weight: 3 },
    ]),
    status: faker.helpers.weightedArrayElement([
      { value: 'ACTIVE' as const, weight: 9 },
      { value: 'SUSPENDED' as const, weight: 1 },
    ]),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    lastLoginAt: faker.datatype.boolean(0.8) ? faker.date.recent({ days: 14 }).toISOString() : null,
  })),
];
