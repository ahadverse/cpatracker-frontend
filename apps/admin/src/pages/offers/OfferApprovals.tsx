import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAdvertisers, getOffers, updateOfferStatus } from '@cpatracker/mock';
import type { Advertiser, Offer } from '@cpatracker/types';
import { DataTable, toast } from '@cpatracker/ui';

export function OfferApprovals() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [selected, setSelected] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [offerRows, advertiserRows] = await Promise.all([
      getOffers({ status: 'PENDING' }),
      getAdvertisers(),
    ]);
    setOffers(offerRows);
    setAdvertisers(advertiserRows);
    setSelected([]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const advertiserNames = useMemo(() => new Map(advertisers.map((a) => [a.id, a.name])), [advertisers]);

  async function decide(status: 'APPROVED' | 'REJECTED') {
    await Promise.all(selected.map((offer) => updateOfferStatus(offer.id, status)));
    toast.success(`${selected.length} offer(s) ${status.toLowerCase()}`);
    load();
  }

  const columns: ColumnDef<Offer>[] = [
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
    {
      id: 'advertiser',
      header: 'Advertiser',
      accessorFn: (offer) => advertiserNames.get(offer.advertiserId) ?? offer.advertiserId,
    },
    {
      id: 'payout',
      header: 'Payout',
      accessorFn: (offer) => (offer.payoutRules[0]?.amount ?? 0),
      cell: ({ row }) => `$${(row.original.payoutRules[0]?.amount ?? 0).toFixed(2)}`,
    },
    {
      id: 'trafficTypes',
      header: 'Traffic Types',
      accessorFn: (offer) => offer.trafficTypes.map((t) => t.replace(/_/g, ' ')).join(', '),
    },
    {
      id: 'createdAt',
      header: 'Submitted',
      accessorFn: (offer) => new Date(offer.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Offer Approvals</h1>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => decide('REJECTED')}
            className="rounded-md border border-destructive/50 px-3 py-1.5 text-sm font-medium text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            Reject selected
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => decide('APPROVED')}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            Approve selected
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={offers}
        enableRowSelection
        onRowSelectionChange={setSelected}
        loading={loading} emptyState="No pending offers."
      />
    </div>
  );
}
