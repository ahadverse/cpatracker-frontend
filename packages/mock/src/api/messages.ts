import type { Message } from '@cpatracker/types';
import { delay } from '../delay';
import { messages } from '../data/messages';
import { USE_MOCK } from '../config';

export async function getMessages(threadId?: string): Promise<Message[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return threadId ? messages.filter((m) => m.threadId === threadId) : messages;
}
