import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAffiliates, updateAffiliateStatus } from '@cpatracker/mock';
import type { Affiliate } from '@cpatracker/types';
import { DataTable, toast } from '@cpatracker/ui';

export function PendingAffiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [selected, setSelected] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setAffiliates(await getAffiliates({ status: 'PENDING' }));
    setSelected([]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(status: 'ACTIVE' | 'SUSPENDED') {
    await Promise.all(selected.map((affiliate) => updateAffiliateStatus(affiliate.id, status)));
    toast.success(`${selected.length} affiliate(s) ${status === 'ACTIVE' ? 'approved' : 'rejected'}`);
    load();
  }

  const columns: ColumnDef<Affiliate>[] = [
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
    { accessorKey: 'company', header: 'Company', cell: ({ row }) => row.original.company ?? '—' },
    { accessorKey: 'country', header: 'Country' },
    {
      id: 'createdAt',
      header: 'Applied',
      accessorFn: (affiliate) => new Date(affiliate.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pending Affiliates</h1>
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
        data={affiliates}
        enableRowSelection
        onRowSelectionChange={setSelected}
        loading={loading} emptyState="No pending affiliates."
      />
    </div>
  );
}
