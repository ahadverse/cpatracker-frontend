import type { Manager, ManagerKind, User } from '@cpatracker/types';
import { faker } from '../faker';
import { makeUser } from './users';

const COUNT = 5;
const KINDS: ManagerKind[] = ['AFFILIATE_MANAGER', 'ACCOUNT_MANAGER', 'GENERAL_MANAGER'];

export const managerUsers: User[] = Array.from({ length: COUNT }, (_, i) =>
  makeUser('MANAGER', `user-manager-${i + 1}`),
);

export const managers: Manager[] = managerUsers.map((user, i) => ({
  id: `manager-${i + 1}`,
  userId: user.id,
  name: faker.person.fullName(),
  kind: KINDS[i % KINDS.length]!,
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}));
