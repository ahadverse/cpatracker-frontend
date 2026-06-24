import type { Manager, ManagerKind } from '@cpatracker/types';
import { delay } from '../delay';
import { managers } from '../data/managers';
import { USE_MOCK } from '../config';

export interface ManagerFilters {
  kind?: ManagerKind;
}

export async function getManagers(filters?: ManagerFilters): Promise<Manager[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return managers.filter((manager) => {
    if (filters?.kind && manager.kind !== filters.kind) return false;
    return true;
  });
}
