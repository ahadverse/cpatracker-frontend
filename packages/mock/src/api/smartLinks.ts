import type { SmartLink } from '@cpatracker/types';
import { delay } from '../delay';
import { smartLinks } from '../data/smartLinks';
import { USE_MOCK } from '../config';

export async function getSmartLinks(): Promise<SmartLink[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return smartLinks;
}

export type CreateSmartLinkInput = Pick<SmartLink, 'name' | 'offerIds'>;

export async function createSmartLink(input: CreateSmartLinkInput): Promise<SmartLink> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const id = `smart-link-${smartLinks.length + 1}-${Date.now()}`;
  const smartLink: SmartLink = {
    ...input,
    id,
    alias: `https://track.cpatracker.dev/s/${id}`,
    createdAt: new Date().toISOString(),
  };
  smartLinks.push(smartLink);
  return smartLink;
}
