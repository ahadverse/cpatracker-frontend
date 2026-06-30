import { delay } from '../delay';
import { offerCategories } from '../data/offerCategories';
import { USE_MOCK } from '../config';

export async function getOfferCategories(): Promise<string[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return offerCategories;
}

export async function createOfferCategory(name: string): Promise<string[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  if (!offerCategories.includes(name)) offerCategories.push(name);
  return offerCategories;
}
