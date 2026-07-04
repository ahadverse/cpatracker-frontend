import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAdvertisers, updateAdvertiserStatus } from '@cpatracker/mock';
import type { Advertiser } from '@cpatracker/types';
import { DataTable, toast } from '@cpatracker/ui';

export function PendingAdvertisers() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [selected, setSelected] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setAdvertisers(await getAdvertisers({ status: 'PENDING' }));
    setSelected([]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(status: 'ACTIVE' | 'SUSPENDED') {
    await Promise.all(selected.map((advertiser) => updateAdvertiserStatus(advertiser.id, status)));
    toast.success(`${selected.length} advertiser(s) ${status === 'ACTIVE' ? 'approved' : 'rejected'}`);
    load();
  }

  const columns: ColumnDef<Advertiser>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
      ),
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'company', header: 'Company' },
    { accessorKey: 'country', header: 'Country' },
    {
      id: 'createdAt',
      header: 'Applied',
      accessorFn: (advertiser) => new Date(advertiser.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pending Advertisers</h1>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => decide('SUSPENDED')}
            className="rounded-md border border-destructive/50 px-3 py-1.5 text-sm font-medium text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            Reject selected
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => decide('ACTIVE')}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            Approve selected
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={advertisers}
        enableRowSelection
        onRowSelectionChange={setSelected}
        loading={loading} emptyState="No pending advertisers."
      />
    </div>
  );
}
