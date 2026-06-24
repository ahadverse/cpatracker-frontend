import type { MenuConfig } from '@cpatracker/types';

// Affiliate menu per docs/frontend-plan.md section 4 (payout-only reports —
// the affiliate app must never surface revenue/profit, see CLAUDE.md "Money
// visibility"). Pure data — no sidebar component renders this yet (Stage 1).
export const affiliateMenu: MenuConfig = {
  groups: [
    {
      items: [
        { label: 'Dashboard', path: '/' },
        {
          label: 'Offers',
          path: '/offers',
          children: [
            { label: 'Browse Offers', path: '/offers/browse' },
            { label: 'Request Access', path: '/offers/request-access' },
            { label: 'Tracking Link', path: '/offers/tracking-link' },
            { label: 'Smart-Links', path: '/offers/smart-links' },
          ],
        },
        {
          label: 'Reports',
          path: '/reports',
          children: [
            { label: 'Performance', path: '/reports/performance' },
            { label: 'Clicks', path: '/reports/clicks' },
            { label: 'Conversions', path: '/reports/conversions' },
            { label: 'Sub-ID Tracking', path: '/reports/sub-id-tracking' },
            { label: 'Postback Logs', path: '/reports/postback-logs' },
          ],
        },
        { label: 'Payments', path: '/payments' },
        { label: 'Messages', path: '/messages' },
        { label: 'Referral Program', path: '/referral' },
        { label: 'Profile', path: '/profile' },
        { label: 'Postback Setup', path: '/postback-setup' },
        { label: 'Logout', path: '/logout' },
      ],
    },
  ],
};
