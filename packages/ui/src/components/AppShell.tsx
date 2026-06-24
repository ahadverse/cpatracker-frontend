import { useState, type ReactNode } from 'react';
import type { MenuConfig } from '@cpatracker/types';
import { Sidebar } from './Sidebar';
import { Topbar, type TopbarProps } from './Topbar';

export interface AppShellProps extends TopbarProps {
  menu: MenuConfig;
  currentPath: string;
  onNavigate: (path: string) => void;
  children: ReactNode;
}

export function AppShell({ menu, currentPath, onNavigate, children, ...topbarProps }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        menu={menu}
        currentPath={currentPath}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar {...topbarProps} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
