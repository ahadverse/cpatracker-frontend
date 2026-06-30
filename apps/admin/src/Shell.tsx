import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminUser, getNotifications, markNotificationRead } from '@cpatracker/mock';
import type { Notification } from '@cpatracker/types';
import { AppShell, LogoMark } from '@cpatracker/ui';
import { adminMenu } from './menu';

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  return (
    <AppShell
      menu={adminMenu}
      currentPath={location.pathname}
      onNavigate={navigate}
      userLabel="Admin"
      userName="Admin User"
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
}
