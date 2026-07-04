import type { MenuConfig } from '@cpatracker/types';

export const superAdminMenu: MenuConfig = {
  groups: [
    { items: [{ label: 'Dashboard', path: '/', icon: 'dashboard' }] },
    {
      label: 'MANAGE',
      items: [
        {
          label: 'Tenants',
          path: '/tenants',
          icon: 'tenants',
          children: [
            { label: 'All Tenants', path: '/tenants/all' },
            { label: 'Create Tenant', path: '/tenants/create' },
          ],
        },
        { label: 'Billing', path: '/billing', icon: 'billing' },
        { label: 'Email Templates', path: '/email-templates', icon: 'email' },
        { label: 'News', path: '/news', icon: 'news' },
      ],
    },
    {
      label: 'OTHERS',
      items: [
        { label: 'Notifications', path: '/notifications', icon: 'notifications' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
        { label: 'Logout', path: '/logout', icon: 'logout' },
      ],
    },
  ],
};
