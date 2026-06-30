import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAdvertisers, getOffers, updateOfferStatus, type OfferFilters } from '@cpatracker/mock';
import type { Advertiser, Offer, OfferStatus } from '@cpatracker/types';
import { DataTable, Select, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_OPTIONS: { value: OfferStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'DELETED', label: 'Deleted' },
];

const STATUS_VARIANT: Record<OfferStatus, 'warning' | 'success' | 'destructive' | 'neutral'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  PAUSED: 'neutral',
  DELETED: 'destructive',
};

export function AllOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [filters, setFilters] = useState<OfferFilters>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [offerRows, advertiserRows] = await Promise.all([getOffers(filters), getAdvertisers()]);
    setOffers(offerRows);
    setAdvertisers(advertiserRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.advertiserId]);

  const advertiserNames = useMemo(() => new Map(advertisers.map((a) => [a.id, a.name])), [advertisers]);

  async function togglePause(offer: Offer) {
    const next = offer.status === 'PAUSED' ? 'APPROVED' : 'PAUSED';
    await updateOfferStatus(offer.id, next);
    toast.success(next === 'PAUSED' ? 'Offer paused' : 'Offer resumed');
    load();
  }

  const columns: ColumnDef<Offer>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'advertiser',
      header: 'Advertiser',
      accessorFn: (offer) => advertiserNames.get(offer.advertiserId) ?? offer.advertiserId,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>
      ),
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
      header: 'Created',
      accessorFn: (offer) => new Date(offer.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const offer = row.original;
        if (offer.status !== 'APPROVED' && offer.status !== 'PAUSED') return null;
        return (
          <button
            type="button"
            onClick={() => togglePause(offer)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {offer.status === 'PAUSED' ? 'Resume' : 'Pause'}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Offers</h1>

      <DataTable
        columns={columns}
        data={offers}
        loading={loading} emptyState="No offers match these filters."
        filterBar={
          <div className="flex gap-3">
            <Select
              options={STATUS_OPTIONS}
              value={filters.status}
              onValueChange={(value) => setFilters((f) => ({ ...f, status: value as OfferStatus }))}
              placeholder="All statuses"
              className="w-44"
            />
            <Select
              options={advertisers.map((a) => ({ value: a.id, label: a.name }))}
              value={filters.advertiserId}
              onValueChange={(value) => setFilters((f) => ({ ...f, advertiserId: value }))}
              placeholder="All advertisers"
              className="w-56"
            />
          </div>
        }
      />
    </div>
  );
}
