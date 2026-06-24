import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Bell, Moon, Search, Sun, User } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '../lib/cn';

export interface TopbarProps {
  notificationCount?: number;
  userLabel?: string;
  onSearch?: (value: string) => void;
  onLogout?: () => void;
}

export function Topbar({ notificationCount = 0, userLabel = 'Account', onSearch, onLogout }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-4">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="size-4" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:opacity-90"
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
