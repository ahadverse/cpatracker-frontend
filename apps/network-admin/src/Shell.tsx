import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { adminUser, getNotifications, markNotificationRead } from '@cpatracker/mock';
import type { Notification } from '@cpatracker/types';
import { AppShell, LogoMark } from '@cpatracker/ui';
import { adminMenu } from './menu';

// Query-param contract (impersonate, tenantId, tenantName) is set by
// apps/super-admin's "View as Tenant" button — keep both in sync if it changes.
function ImpersonationBanner({ tenantName }: { tenantName: string }) {
  function handleExit() {
    // Permitted here because this tab was opened via window.open() from super-admin
    // (browsers only allow script-closing tabs that were script-opened).
    window.close();
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-warning/30 bg-warning/15 px-4 py-2 text-sm text-warning">
      <span>Viewing as {tenantName}</span>
      <button
        type="button"
        onClick={handleExit}
        className="rounded-md border border-warning/40 px-2 py-1 text-xs font-medium hover:bg-warning/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Exit
      </button>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const impersonatedTenantName = searchParams.get('impersonate') === '1' ? searchParams.get('tenantName') : null;

  function loadNotifications() {
    getNotifications(adminUser.id).then(setNotifications);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleNotificationClick(id: string) {
    await markNotificationRead(id);
    loadNotifications();
  }

  const shell = (
    <AppShell
      menu={adminMenu}
      currentPath={location.pathname}
      onNavigate={navigate}
      userLabel="Network Admin"
      userName="Network Admin User"
      notifications={notifications}
      onNotificationClick={handleNotificationClick}
      onViewAllNotificationsClick={() => navigate('/notifications')}
      onProfileClick={() => navigate('/profile')}
      onLogout={() => navigate('/logout')}
      logoMark={<LogoMark />}
      logoText="CPATracker"
    >
      {children}
    </AppShell>
  );

  if (!impersonatedTenantName) return shell;

  // AppShell's root div is a fixed h-full (100% of its parent) and #root has a
  // hard height:100%/overflow:hidden — stacking the banner as a plain sibling
  // above it would push total content past the viewport and clip the bottom.
  // flex-1/min-h-0 gives AppShell a definite remaining height to fill instead.
  return (
    <div className="flex h-full w-full flex-col">
      <ImpersonationBanner tenantName={impersonatedTenantName} />
      <div className="min-h-0 flex-1">{shell}</div>
    </div>
  );
}
