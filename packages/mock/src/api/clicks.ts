import type { Click } from '@cpatracker/types';
import { delay } from '../delay';
import { clicks } from '../data/clicks';
import { USE_MOCK } from '../config';

export interface ClickFilters {
  offerId?: string;
  affiliateId?: string;
  os?: Click['os'];
  smartLinkId?: string;
  countries?: string[];
  devices?: Click['device'][];
  dateFrom?: string;
  dateTo?: string;
}

export async function getClicks(filters?: ClickFilters): Promise<Click[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return clicks.filter((click) => {
    if (filters?.offerId && click.offerId !== filters.offerId) return false;
    if (filters?.affiliateId && click.affiliateId !== filters.affiliateId) return false;
    if (filters?.os && click.os !== filters.os) return false;
    if (filters?.smartLinkId && click.smartLinkId !== filters.smartLinkId) return false;
    if (filters?.countries?.length && !filters.countries.includes(click.geo)) return false;
    if (filters?.devices?.length && !filters.devices.includes(click.device)) return false;
    if (filters?.dateFrom && click.createdAt < filters.dateFrom) return false;
    if (filters?.dateTo && click.createdAt > filters.dateTo) return false;
    return true;
  });
}
