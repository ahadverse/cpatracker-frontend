import type { NetworkSettings } from '@cpatracker/types';
import { delay } from '../delay';
import { networkSettings } from '../data/networkSettings';
import { USE_MOCK } from '../config';

export async function getNetworkSettings(): Promise<NetworkSettings> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return networkSettings;
}

export async function updateNetworkSettings(patch: Partial<NetworkSettings>): Promise<NetworkSettings> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  Object.assign(networkSettings, patch);
  return networkSettings;
}
