import type { Click } from '@cpatracker/types';
import { delay } from '../delay';
import { clicks } from '../data/clicks';
import { USE_MOCK } from '../config';

export interface ClickFilters {
  offerId?: string;
  affiliateId?: string;
}

export async function getClicks(filters?: ClickFilters): Promise<Click[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return clicks.filter((click) => {
    if (filters?.offerId && click.offerId !== filters.offerId) return false;
    if (filters?.affiliateId && click.affiliateId !== filters.affiliateId) return false;
    return true;
  });
}
