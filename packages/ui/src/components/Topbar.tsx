import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import type { Notification } from '@cpatracker/types';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '../lib/cn';

export interface TopbarProps {
  notifications?: Notification[];
  userLabel?: string;
  onLogout?: () => void;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: (id: string) => void;
  onViewAllNotificationsClick?: () => void;
}

function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function Topbar({
  notifications = [],
  userLabel = 'Account',
  onLogout,
  onMenuClick,
  onProfileClick,
  onNotificationClick,
  onViewAllNotificationsClick,
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-4">
      <div className="flex flex-1 items-center gap-2">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <Menu className="size-4" />
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-80 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <DropdownMenu.Label className="px-2 py-1.5 text-xs text-muted-foreground">
                Notifications
              </DropdownMenu.Label>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">No notifications yet.</p>
                )}
                {notifications.map((notification) => (
                  <DropdownMenu.Item
                    key={notification.id}
                    onSelect={() => onNotificationClick?.(notification.id)}
                    className="cursor-pointer rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-start gap-2">
                      {!notification.readAt && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />}
                      <div className={cn('min-w-0 flex-1', notification.readAt && 'pl-3.5')}>
                        <p className={cn('truncate', !notification.readAt && 'font-medium text-foreground')}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</p>
                      </div>
                    </div>
                  </DropdownMenu.Item>
                ))}
              </div>
              {onViewAllNotificationsClick && (
                <>
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item
                    onSelect={onViewAllNotificationsClick}
                    className="cursor-pointer rounded-sm px-2 py-1.5 text-center text-sm font-medium text-primary outline-none hover:bg-accent"
                  >
                    View all
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="User menu"
            >
              <User className="size-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className={cn(
                'z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
              )}
            >
              <DropdownMenu.Label className="px-2 py-1.5 text-xs text-muted-foreground">
                {userLabel}
              </DropdownMenu.Label>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                onSelect={onProfileClick}
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={onLogout}
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
