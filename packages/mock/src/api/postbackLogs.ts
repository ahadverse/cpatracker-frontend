import type { PostbackLog } from '@cpatracker/types';
import { delay } from '../delay';
import { postbackLogs } from '../data/postbackLogs';
import { USE_MOCK } from '../config';

export async function getPostbackLogs(): Promise<PostbackLog[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return postbackLogs;
}
