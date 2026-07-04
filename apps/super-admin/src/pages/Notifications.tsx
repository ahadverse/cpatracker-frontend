import { useEffect, useState } from 'react';
import { demoSuperAdmin, getNotifications, markNotificationRead } from '@cpatracker/mock';
import type { Notification } from '@cpatracker/types';
import { Skeleton, toast } from '@cpatracker/ui';

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const rows = await getNotifications(demoSuperAdmin.id);
    setNotifications(rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMarkRead(notification: Notification) {
    await markNotificationRead(notification.id);
    toast.success('Marked as read');
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {loading &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          ))}
        {!loading && notifications.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No notifications.</p>
        )}
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className={notification.readAt ? 'text-muted-foreground' : 'font-medium text-card-foreground'}>
                {notification.message}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {notification.type} · {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            {!notification.readAt && (
              <button
                type="button"
                onClick={() => handleMarkRead(notification)}
                className="shrink-0 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
