import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { demoAdvertiser, getNotifications, markNotificationRead } from '@cpatracker/mock';
import type { Notification } from '@cpatracker/types';
import { AppShell, LogoMark } from '@cpatracker/ui';
import { advertiserMenu } from './menu';

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function loadNotifications() {
    getNotifications(demoAdvertiser.userId).then(setNotifications);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleNotificationClick(id: string) {
    await markNotificationRead(id);
    loadNotifications();
  }

  return (
    <AppShell
      menu={advertiserMenu}
      currentPath={location.pathname}
      onNavigate={navigate}
      userLabel="Advertiser"
      userName={demoAdvertiser.name}
      notifications={notifications}
      onNotificationClick={handleNotificationClick}
      onProfileClick={() => navigate('/profile')}
      onLogout={() => navigate('/logout')}
      logoMark={<LogoMark />}
      logoText="CPATracker"
    >
      {children}
    </AppShell>
  );
}
