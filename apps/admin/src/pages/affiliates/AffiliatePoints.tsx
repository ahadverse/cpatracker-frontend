import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { adjustAffiliatePoints, getAffiliates } from '@cpatracker/mock';
import type { Affiliate } from '@cpatracker/types';
import { DataTable } from '@cpatracker/ui';

export function AffiliatePoints() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setAffiliates(await getAffiliates());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function adjust(affiliate: Affiliate, delta: number) {
    await adjustAffiliatePoints(affiliate.id, delta);
    load();
  }

  const columns: ColumnDef<Affiliate>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'points', header: 'Points' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => adjust(row.original, -100)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            -100
          </button>
          <button
            type="button"
            onClick={() => adjust(row.original, 100)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            +100
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Affiliate Points</h1>

      <DataTable columns={columns} data={affiliates} loading={loading} emptyState="No affiliates yet." />
    </div>
  );
}
