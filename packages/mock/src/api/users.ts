import type { User } from '@cpatracker/types';
import { delay } from '../delay';
import { adminUser } from '../data/users';
import { affiliates, affiliateUsers } from '../data/affiliates';
import { advertisers, advertiserUsers } from '../data/advertisers';
import { managers, managerUsers } from '../data/managers';
import { USE_MOCK } from '../config';

export async function getUser(userId: string): Promise<User | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const allUsers: User[] = [adminUser, ...affiliateUsers, ...advertiserUsers, ...managerUsers];
  return allUsers.find((user) => user.id === userId);
}

// No password field is modeled on User (a real backend never returns one
// either) — this simulates the round trip without persisting anything.
export async function changePassword(userId: string, _newPassword: string): Promise<void> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const allUsers: User[] = [adminUser, ...affiliateUsers, ...advertiserUsers, ...managerUsers];
  if (!allUsers.some((user) => user.id === userId)) throw new Error(`User ${userId} not found`);
}

export interface LoginLogRow {
  userId: string;
  name: string;
  role: User['role'];
  status: User['status'];
  lastLoginAt: string | null;
}

export async function getLoginLogs(): Promise<LoginLogRow[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const affiliateNames = new Map(affiliates.map((a) => [a.userId, a.name]));
  const advertiserNames = new Map(advertisers.map((a) => [a.userId, a.name]));
  const managerNames = new Map(managers.map((m) => [m.userId, m.name]));

  const allUsers: User[] = [adminUser, ...affiliateUsers, ...advertiserUsers, ...managerUsers];

  return allUsers
    .map((user) => ({
      userId: user.id,
      name:
        user.id === adminUser.id
          ? 'Admin'
          : affiliateNames.get(user.id) ?? advertiserNames.get(user.id) ?? managerNames.get(user.id) ?? user.id,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    }))
    .sort((a, b) => (b.lastLoginAt ?? '').localeCompare(a.lastLoginAt ?? ''));
}
