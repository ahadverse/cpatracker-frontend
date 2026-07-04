import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { getTenants, type TenantFilters } from '@cpatracker/mock';
import type { PlanTier, Tenant, TenantStatus } from '@cpatracker/types';
import { DataTable, Input, Select, StatusBadge } from '@cpatracker/ui';

const STATUS_OPTIONS: { value: TenantStatus; label: string }[] = [
  { value: 'TRIAL', label: 'Trial' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const PLAN_OPTIONS: { value: PlanTier; label: string }[] = [
  { value: 'STARTER', label: 'Starter' },
  { value: 'GROWTH', label: 'Growth' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
];

const STATUS_VARIANT: Record<TenantStatus, 'success' | 'warning' | 'destructive' | 'neutral'> = {
  TRIAL: 'warning',
  ACTIVE: 'success',
  SUSPENDED: 'destructive',
  CANCELLED: 'neutral',
};

export function AllTenants() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filters, setFilters] = useState<TenantFilters>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setTenants(await getTenants(filters));
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.plan, filters.search]);

  const columns: ColumnDef<Tenant>[] = [
    { accessorKey: 'companyName', header: 'Company' },
    { accessorKey: 'contactEmail', header: 'Contact' },
    { accessorKey: 'plan', header: 'Plan' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: 'usage',
      header: 'Usage (clicks)',
      accessorFn: (tenant) => tenant.usage.clicks,
      cell: ({ row }) => row.original.usage.clicks.toLocaleString(),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorFn: (tenant) => new Date(tenant.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => navigate(`/tenants/${row.original.id}`)}
          className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tenants</h1>

      <DataTable
        columns={columns}
        data={tenants}
        loading={loading}
        emptyState="No tenants match these filters."
        filterBar={
          <div className="flex flex-wrap gap-3">
            <Input
              value={filters.search ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined }))}
              placeholder="Search company or email"
              className="w-64"
            />
            <Select
              options={STATUS_OPTIONS}
              value={filters.status}
              onValueChange={(value) => setFilters((f) => ({ ...f, status: value as TenantStatus }))}
              placeholder="All statuses"
              className="w-44"
            />
            <Select
              options={PLAN_OPTIONS}
              value={filters.plan}
              onValueChange={(value) => setFilters((f) => ({ ...f, plan: value as PlanTier }))}
              placeholder="All plans"
              className="w-44"
            />
          </div>
        }
      />
    </div>
  );
}
