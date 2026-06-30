import type { MenuConfig } from '@cpatracker/types';

// Advertiser menu per docs/frontend-plan.md section 4. Pure data — no sidebar
// component renders this yet (Stage 1).
export const advertiserMenu: MenuConfig = {
  groups: [
    {
      items: [
        { label: 'Dashboard', path: '/', icon: 'dashboard' },
        {
          label: 'Offers',
          path: '/offers',
          icon: 'offers',
          children: [
            { label: 'All Offers', path: '/offers' },
            { label: 'Create Offer', path: '/offers/create' },
          ],
        },
        { label: 'Performance', path: '/performance', icon: 'reports' },
        { label: 'Conversions', path: '/conversions', icon: 'reports' },
        { label: 'Postback Setup', path: '/postback-setup', icon: 'postback' },
        { label: 'Billing', path: '/billing', icon: 'billing' },
        { label: 'Messages', path: '/messages', icon: 'messages' },
        { label: 'Profile', path: '/profile', icon: 'profile' },
        { label: 'Logout', path: '/logout', icon: 'logout' },
      ],
    },
  ],
};
