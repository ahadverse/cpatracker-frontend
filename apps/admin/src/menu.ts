import type { MenuConfig } from '@cpatracker/types';

// Full admin menu per docs/frontend-plan.md section 4. Pure data — no sidebar
// component renders this yet (Stage 1) and routes aren't wired yet (Stages 3-5).
export const adminMenu: MenuConfig = {
  groups: [
    {
      items: [{ label: 'Dashboard', path: '/', icon: 'dashboard' }],
    },
    {
      label: 'MANAGE',
      items: [
        {
          label: 'Offers',
          path: '/offers',
          icon: 'offers',
          children: [
            { label: 'Create Offer', path: '/offers/create' },
            { label: 'All Offers', path: '/offers/all' },
            { label: 'CR Optimizer', path: '/offers/cr-optimizer' },
            { label: 'Affiliate + Offer CR', path: '/offers/affiliate-offer-cr' },
            { label: 'Smart-Links', path: '/offers/smart-links' },
            { label: 'Offer Approvals', path: '/offers/approvals' },
            { label: 'Access Requests', path: '/offers/access-requests' },
          ],
        },
        {
          label: 'Affiliates',
          path: '/affiliates',
          icon: 'affiliates',
          children: [
            { label: 'Create Affiliate', path: '/affiliates/create' },
            { label: 'All Affiliates', path: '/affiliates/all' },
            { label: 'Pending', path: '/affiliates/pending' },
            { label: 'Referral Program', path: '/affiliates/referral-program' },
            { label: 'Affiliate Groups', path: '/affiliates/groups' },
            { label: 'CR Optimizer', path: '/affiliates/cr-optimizer' },
            { label: 'Affiliate Payments', path: '/affiliates/payments' },
            { label: 'All Affiliate Points', path: '/affiliates/points' },
            { label: 'Affiliate Messages', path: '/affiliates/messages' },
          ],
        },
        {
          label: 'Advertisers',
          path: '/advertisers',
          icon: 'advertisers',
          children: [
            { label: 'Create Advertiser', path: '/advertisers/create' },
            { label: 'All Advertisers', path: '/advertisers/all' },
            { label: 'Pending', path: '/advertisers/pending' },
            { label: 'Advertiser Messages', path: '/advertisers/messages' },
          ],
        },
        {
          label: 'Manager',
          path: '/managers',
          icon: 'managers',
          children: [
            { label: 'Create Manager', path: '/managers/create' },
            { label: 'Affiliate Managers', path: '/managers/affiliate-managers' },
            { label: 'Account Managers', path: '/managers/account-managers' },
            { label: 'General Managers', path: '/managers/general-managers' },
            { label: 'Manager Payments', path: '/managers/payments' },
          ],
        },
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
        { label: 'Billing', path: '/billing', icon: 'billing' },
        { label: 'MarketPlace', path: '/marketplace', icon: 'marketplace' },
        { label: 'Logout', path: '/logout', icon: 'logout' },
      ],
    },
  ],
};
