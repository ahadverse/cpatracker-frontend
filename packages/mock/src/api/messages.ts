import type { Message } from '@cpatracker/types';
import { delay } from '../delay';
import { messages } from '../data/messages';
import { adminUser } from '../data/users';
import { affiliates } from '../data/affiliates';
import { advertisers } from '../data/advertisers';
import { USE_MOCK } from '../config';

export async function getMessages(threadId?: string): Promise<Message[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return threadId ? messages.filter((m) => m.threadId === threadId) : messages;
}

export type MessageParticipantRole = 'AFFILIATE' | 'ADVERTISER';

export interface MessageThread {
  threadId: string;
  participantUserId: string;
  participantRole: MessageParticipantRole;
  participantName: string;
  lastMessage: Message;
  unreadCount: number;
}

function participantInfo(userId: string): { role: MessageParticipantRole; name: string } | undefined {
  const affiliate = affiliates.find((a) => a.userId === userId);
  if (affiliate) return { role: 'AFFILIATE', name: affiliate.name };
  const advertiser = advertisers.find((a) => a.userId === userId);
  if (advertiser) return { role: 'ADVERTISER', name: advertiser.name };
  return undefined;
}

export async function getMessageThreads(role: MessageParticipantRole): Promise<MessageThread[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const byThread = new Map<string, Message[]>();
  for (const message of messages) {
    const list = byThread.get(message.threadId) ?? [];
    list.push(message);
    byThread.set(message.threadId, list);
  }

  const threads: MessageThread[] = [];
  for (const [threadId, threadMessages] of byThread) {
    const sorted = [...threadMessages].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    const participantUserId = sorted[0]!.senderId === adminUser.id ? sorted[0]!.recipientId : sorted[0]!.senderId;
    const info = participantInfo(participantUserId);
    if (!info || info.role !== role) continue;

    threads.push({
      threadId,
      participantUserId,
      participantRole: info.role,
      participantName: info.name,
      lastMessage: sorted[sorted.length - 1]!,
      unreadCount: sorted.filter((m) => m.recipientId === adminUser.id && m.readAt === null).length,
    });
  }

  return threads.sort((a, b) => (a.lastMessage.createdAt < b.lastMessage.createdAt ? 1 : -1));
}

export async function sendMessage(
  threadId: string,
  recipientUserId: string,
  body: string,
  senderUserId: string = adminUser.id,
): Promise<Message> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const message: Message = {
    id: `${threadId}-message-${Date.now()}`,
    threadId,
    senderId: senderUserId,
    recipientId: recipientUserId,
    body,
    createdAt: new Date().toISOString(),
    readAt: null,
  };
  messages.push(message);
  return message;
}

export async function markThreadRead(threadId: string, viewerUserId: string = adminUser.id): Promise<void> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  for (const message of messages) {
    if (message.threadId === threadId && message.recipientId === viewerUserId && message.readAt === null) {
      message.readAt = new Date().toISOString();
    }
  }
}

export interface OwnThread {
  threadId: string;
  otherPartyUserId: string;
  messages: Message[];
}

// For the affiliate/advertiser side of an existing admin<->participant thread —
// derives the thread from existing messages rather than requiring the caller
// to know the threadId (which only the admin-side fixtures assign deterministically).
export async function getOwnThread(userId: string): Promise<OwnThread> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const own = messages.filter((m) => m.senderId === userId || m.recipientId === userId);
  const threadId = own[0]?.threadId ?? `thread-own-${userId}`;
  const sorted = [...own].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  return { threadId, otherPartyUserId: adminUser.id, messages: sorted };
}
