import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MenuConfig, MenuItem } from '@cpatracker/types';
import { cn } from '../lib/cn';

export interface SidebarProps {
  menu: MenuConfig;
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

function isActive(item: MenuItem, currentPath: string): boolean {
  if (item.path === currentPath) return true;
  return item.children?.some((child) => isActive(child, currentPath)) ?? false;
}

function SidebarItem({
  item,
  currentPath,
  onNavigate,
  collapsed,
}: {
  item: MenuItem;
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
}) {
  const active = isActive(item, currentPath);
  const [open, setOpen] = useState(active);
  const hasChildren = !!item.children?.length;

  return (
    <li>
      <button
        type="button"
        onClick={() => (hasChildren ? setOpen((o) => !o) : onNavigate(item.path))}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
        )}
      >
        <span className={cn('truncate', collapsed && 'sr-only')}>{item.label}</span>
        {hasChildren && !collapsed && (
          <ChevronDown
            className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')}
          />
        )}
      </button>
      {hasChildren && open && !collapsed && (
        <ul className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
          {item.children!.map((child) => (
            <SidebarItem
              key={child.path}
              item={child}
              currentPath={currentPath}
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Sidebar({
  menu,
  currentPath,
  onNavigate,
  collapsed = false,
  onCollapsedChange,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card transition-[width]',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {menu.groups.map((group, i) => (
          <div key={group.label ?? i} className={i > 0 ? 'mt-4' : undefined}>
            {group.label && !collapsed && (
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  currentPath={currentPath}
                  onNavigate={onNavigate}
                  collapsed={collapsed}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {onCollapsedChange && (
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className="flex items-center justify-center border-t border-border py-2 text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      )}
    </aside>
  );
}
