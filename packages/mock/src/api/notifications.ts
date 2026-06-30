import type { Notification } from '@cpatracker/types';
import { delay } from '../delay';
import { notifications } from '../data/notifications';
import { USE_MOCK } from '../config';

export async function getNotifications(userId: string): Promise<Notification[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return notifications.filter((n) => n.userId === userId);
}

export async function markNotificationRead(id: string): Promise<Notification> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const notification = notifications.find((n) => n.id === id);
  if (!notification) throw new Error(`Notification ${id} not found`);
  notification.readAt = new Date().toISOString();
  return notification;
}
