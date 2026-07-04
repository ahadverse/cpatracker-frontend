// Stand-in for a current-user/session concept (super-admin has no auth yet) —
// same role adminUser/demoAffiliate/demoAdvertiser play for the other apps.
// Deliberately not a `User` from @cpatracker/types: super admin isn't part of
// the tenant-scoped Role model (NETWORK_ADMIN/AFFILIATE/ADVERTISER/MANAGER).
export const demoSuperAdmin = {
  id: 'super-admin-1',
  name: 'Super Admin User',
  email: 'super@cpatracker.dev',
};
