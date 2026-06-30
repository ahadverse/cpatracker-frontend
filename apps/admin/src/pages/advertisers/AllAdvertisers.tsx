import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAdvertisers, updateAdvertiserStatus, type AdvertiserFilters } from '@cpatracker/mock';
import type { Advertiser, AdvertiserStatus } from '@cpatracker/types';
import { DataTable, Select, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_OPTIONS: { value: AdvertiserStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const STATUS_VARIANT: Record<AdvertiserStatus, 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  SUSPENDED: 'destructive',
};

export function AllAdvertisers() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [filters, setFilters] = useState<AdvertiserFilters>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setAdvertisers(await getAdvertisers(filters));
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  async function toggleSuspend(advertiser: Advertiser) {
    const next = advertiser.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    await updateAdvertiserStatus(advertiser.id, next);
    toast.success(next === 'SUSPENDED' ? 'Advertiser suspended' : 'Advertiser reactivated');
    load();
  }

  const columns: ColumnDef<Advertiser>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'company', header: 'Company' },
    { accessorKey: 'country', header: 'Country' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: 'createdAt',
      header: 'Joined',
      accessorFn: (advertiser) => new Date(advertiser.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const advertiser = row.original;
        if (advertiser.status === 'PENDING') return null;
        return (
          <button
            type="button"
            onClick={() => toggleSuspend(advertiser)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {advertiser.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Advertisers</h1>

      <DataTable
        columns={columns}
        data={advertisers}
        loading={loading} emptyState="No advertisers match these filters."
        filterBar={
          <Select
            options={STATUS_OPTIONS}
            value={filters.status}
            onValueChange={(value) => setFilters({ status: value as AdvertiserStatus })}
            placeholder="All statuses"
            className="w-44"
          />
        }
      />
    </div>
  );
}
