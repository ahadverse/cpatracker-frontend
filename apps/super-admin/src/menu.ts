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
      label: 'ANALYSE',
      items: [
        {
          label: 'Reports',
          path: '/reports',
          icon: 'reports',
          children: [
            { label: 'Performance', path: '/reports/performance' },
            { label: 'Clicks', path: '/reports/clicks' },
            { label: 'Conversions', path: '/reports/conversions' },
            { label: 'Sub-ID Tracking', path: '/reports/sub-id-tracking' },
            { label: 'Postback Logs', path: '/reports/postback-logs' },
            { label: 'Offer Reports', path: '/reports/offer' },
            { label: 'Affiliate Reports', path: '/reports/affiliate' },
            { label: 'Advertiser Reports', path: '/reports/advertiser' },
            { label: 'Conversion Reports', path: '/reports/conversion' },
            { label: 'Advanced Reports', path: '/reports/advanced' },
            { label: 'Click Logs', path: '/reports/click-logs' },
            { label: 'Affiliate Postback Logs', path: '/reports/affiliate-postback-logs' },
            { label: 'Advertiser Postback Logs', path: '/reports/advertiser-postback-logs' },
          ],
        },
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
