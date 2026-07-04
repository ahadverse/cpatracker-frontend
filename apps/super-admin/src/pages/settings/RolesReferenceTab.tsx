import type { StaffRole } from '@cpatracker/types';

interface RoleDescriptor {
  role: StaffRole;
  label: string;
  description: string;
  capabilities: string[];
}

const ROLES: RoleDescriptor[] = [
  {
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Full control over the CPATracker platform.',
    capabilities: [
      'Create, suspend, and cancel tenants',
      'View and manage billing across all tenants',
      'Manage staff accounts and roles',
      'View as any active tenant',
    ],
  },
  {
    role: 'OPERATIONS',
    label: 'Operations',
    description: 'Day-to-day tenant and billing support.',
    capabilities: ['Activate and suspend tenants', 'View billing and invoices', 'View as any active tenant'],
  },
  {
    role: 'SUPPORT',
    label: 'Support',
    description: 'Read-only visibility for support reps.',
    capabilities: ['View tenants and their usage', 'View billing and invoices'],
  },
];

export function RolesReferenceTab() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {ROLES.map((role) => (
        <div key={role.role} className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">{role.label}</h3>
          <p className="mt-1 text-sm text-card-foreground">{role.description}</p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {role.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
