import type { MenuConfig } from '@cpatracker/types';

// Advertiser menu per docs/frontend-plan.md section 4. Pure data — no sidebar
// component renders this yet (Stage 1).
export const advertiserMenu: MenuConfig = {
  groups: [
    {
      items: [
        { label: 'Dashboard', path: '/' },
        { label: 'Offers + Performance', path: '/offers' },
        { label: 'Conversions / Reports', path: '/reports' },
        { label: 'Postback Setup', path: '/postback-setup' },
        { label: 'Billing', path: '/billing' },
        { label: 'Messages', path: '/messages' },
        { label: 'Profile', path: '/profile' },
        { label: 'Logout', path: '/logout' },
      ],
    },
  ],
};
