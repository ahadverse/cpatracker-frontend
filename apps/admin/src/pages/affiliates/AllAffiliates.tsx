import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAffiliates, updateAffiliateStatus, type AffiliateFilters } from '@cpatracker/mock';
import type { Affiliate, AffiliateStatus } from '@cpatracker/types';
import { DataTable, Select, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_OPTIONS: { value: AffiliateStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const STATUS_VARIANT: Record<AffiliateStatus, 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  SUSPENDED: 'destructive',
};

export function AllAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [filters, setFilters] = useState<AffiliateFilters>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setAffiliates(await getAffiliates(filters));
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  async function toggleSuspend(affiliate: Affiliate) {
    const next = affiliate.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    await updateAffiliateStatus(affiliate.id, next);
    toast.success(next === 'SUSPENDED' ? 'Affiliate suspended' : 'Affiliate reactivated');
    load();
  }

  const columns: ColumnDef<Affiliate>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'company', header: 'Company', cell: ({ row }) => row.original.company ?? '—' },
    { accessorKey: 'country', header: 'Country' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    { accessorKey: 'points', header: 'Points' },
    {
      id: 'createdAt',
      header: 'Joined',
      accessorFn: (affiliate) => new Date(affiliate.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const affiliate = row.original;
        if (affiliate.status === 'PENDING') return null;
        return (
          <button
            type="button"
            onClick={() => toggleSuspend(affiliate)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {affiliate.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Affiliates</h1>

      <DataTable
        columns={columns}
        data={affiliates}
        loading={loading} emptyState="No affiliates match these filters."
        filterBar={
          <Select
            options={STATUS_OPTIONS}
            value={filters.status}
            onValueChange={(value) => setFilters({ status: value as AffiliateStatus })}
            placeholder="All statuses"
            className="w-44"
          />
        }
      />
    </div>
  );
}
