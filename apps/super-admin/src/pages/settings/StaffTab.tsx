import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  createStaff,
  demoSuperAdmin,
  getStaff,
  updateStaffRole,
  updateStaffStatus,
  type StaffFilters,
} from '@cpatracker/mock';
import type { StaffMember, StaffRole, StaffStatus } from '@cpatracker/types';
import { DataTable, Input, Modal, Select, StatusBadge, toast } from '@cpatracker/ui';

const ROLE_OPTIONS: { value: StaffRole; label: string }[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'OPERATIONS', label: 'Operations' },
  { value: 'SUPPORT', label: 'Support' },
];

const STATUS_OPTIONS: { value: StaffStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const STAFF_ROLE_VARIANT: Record<StaffRole, 'success' | 'info' | 'neutral'> = {
  SUPER_ADMIN: 'success',
  OPERATIONS: 'info',
  SUPPORT: 'neutral',
};

const STAFF_STATUS_VARIANT: Record<StaffStatus, 'success' | 'destructive'> = {
  ACTIVE: 'success',
  SUSPENDED: 'destructive',
};

export function StaffTab() {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [filters, setFilters] = useState<StaffFilters>({});
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  async function load() {
    setLoading(true);
    setMembers(await getStaff(filters));
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.role, filters.status, filters.search]);

  async function handleRoleChange(member: StaffMember, role: StaffRole) {
    await updateStaffRole(member.id, role);
    toast.success('Role updated');
    load();
  }

  async function handleStatusToggle(member: StaffMember) {
    const next: StaffStatus = member.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await updateStaffStatus(member.id, next);
    toast.success(next === 'ACTIVE' ? 'Staff member activated' : 'Staff member suspended');
    load();
  }

  const columns: ColumnDef<StaffMember>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const member = row.original;
        const isSelf = member.email === demoSuperAdmin.email;
        if (isSelf) {
          return <StatusBadge variant={STAFF_ROLE_VARIANT[member.role]}>{ROLE_OPTIONS.find((o) => o.value === member.role)?.label}</StatusBadge>;
        }
        return (
          <Select
            options={ROLE_OPTIONS}
            value={member.role}
            onValueChange={(value) => handleRoleChange(member, value as StaffRole)}
            className="w-40"
          />
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={STAFF_STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const member = row.original;
        const isSelf = member.email === demoSuperAdmin.email;
        if (isSelf) {
          return <span className="text-xs text-muted-foreground">You</span>;
        }
        return (
          <button
            type="button"
            onClick={() => handleStatusToggle(member)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {member.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + Add Staff
        </button>
      </div>

      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        emptyState="No staff match these filters."
        filterBar={
          <div className="flex flex-wrap gap-3">
            <Input
              value={filters.search ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined }))}
              placeholder="Search name or email"
              className="w-64"
            />
            <Select
              options={ROLE_OPTIONS}
              value={filters.role}
              onValueChange={(value) => setFilters((f) => ({ ...f, role: value as StaffRole }))}
              placeholder="All roles"
              className="w-44"
            />
            <Select
              options={STATUS_OPTIONS}
              value={filters.status}
              onValueChange={(value) => setFilters((f) => ({ ...f, status: value as StaffStatus }))}
              placeholder="All statuses"
              className="w-44"
            />
          </div>
        }
      />

      <AddStaffModal open={addOpen} onOpenChange={setAddOpen} onCreated={load} />
    </div>
  );
}

function AddStaffModal({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>();
  const [submitting, setSubmitting] = useState(false);

  const valid = name.trim().length > 0 && email.trim().length > 0 && !!role;

  async function handleSubmit() {
    if (!valid || !role) return;
    setSubmitting(true);
    try {
      await createStaff({ name: name.trim(), email: email.trim(), role });
      toast.success('Staff member added');
      setName('');
      setEmail('');
      setRole(undefined);
      onOpenChange(false);
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Add Staff">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@cpatracker.dev" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Role</label>
          <Select options={ROLE_OPTIONS} value={role} onValueChange={(value) => setRole(value as StaffRole)} placeholder="Select a role" />
        </div>

        <button
          type="button"
          disabled={!valid || submitting}
          onClick={handleSubmit}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {submitting ? 'Adding...' : 'Add staff member'}
        </button>
      </div>
    </Modal>
  );
}
