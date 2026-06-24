import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '@cpatracker/ui';
import { adminMenu } from './menu';

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell
      menu={adminMenu}
      currentPath={location.pathname}
      onNavigate={navigate}
      userLabel="Admin"
      notificationCount={3}
    >
      {children}
    </AppShell>
  );
}
