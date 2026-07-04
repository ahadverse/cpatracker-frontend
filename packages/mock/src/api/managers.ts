import type { Manager, ManagerKind } from '@cpatracker/types';
import { delay } from '../delay';
import { managerUsers, managers } from '../data/managers';
import { USE_MOCK } from '../config';

export interface ManagerFilters {
  kind?: ManagerKind;
  dateFrom?: string;
  dateTo?: string;
}

export async function getManagers(filters?: ManagerFilters): Promise<Manager[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return managers.filter((manager) => {
    if (filters?.kind && manager.kind !== filters.kind) return false;
    if (filters?.dateFrom && manager.createdAt < filters.dateFrom) return false;
    if (filters?.dateTo && manager.createdAt > filters.dateTo) return false;
    return true;
  });
}

export interface CreateManagerInput {
  name: string;
  email: string;
  kind: ManagerKind;
}

export async function createManager(input: CreateManagerInput): Promise<Manager> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const id = `manager-${managers.length + 1}-${Date.now()}`;
  const userId = `user-${id}`;
  managerUsers.push({ id: userId, email: input.email, role: 'MANAGER', status: 'ACTIVE', lastLoginAt: null });

  const manager: Manager = {
    id,
    userId,
    name: input.name,
    kind: input.kind,
    createdAt: new Date().toISOString(),
  };
  managers.push(manager);
  return manager;
}
