import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAdvertiser, getOffers } from '@cpatracker/mock';
import type { Offer, OfferStatus } from '@cpatracker/types';
import { DataTable, DateRangePicker, Select, StatusBadge, type DateRange } from '@cpatracker/ui';

const STATUS_VARIANT: Record<Offer['status'], 'warning' | 'success' | 'destructive' | 'neutral'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  PAUSED: 'neutral',
  DELETED: 'destructive',
};

const STATUS_OPTIONS: { value: OfferStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'DELETED', label: 'Deleted' },
];

export function AllOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [status, setStatus] = useState<OfferStatus>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOffers({
      advertiserId: demoAdvertiser.id,
      status,
      dateFrom: dateRange?.from?.toISOString(),
      dateTo: dateRange?.to?.toISOString(),
    }).then((rows) => {
      setOffers(rows);
      setLoading(false);
    });
  }, [status, dateRange]);

  const columns: ColumnDef<Offer>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>,
    },
    { id: 'payout', header: 'Payout Rate', accessorFn: (offer) => `$${(offer.payoutRules[0]?.amount ?? 0).toFixed(2)}` },
    { id: 'trafficTypes', header: 'Traffic Types', accessorFn: (offer) => offer.trafficTypes.map((t) => t.replace(/_/g, ' ')).join(', ') },
    {
      id: 'createdAt',
      header: 'Created',
      accessorFn: (offer) => new Date(offer.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Offers</h1>
        <button
          type="button"
          onClick={() => navigate('/offers/create')}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Create offer
        </button>
      </div>

      <DataTable
        columns={columns}
        data={offers}
        loading={loading}
        emptyState="No offers yet."
        filterBar={
          <div className="flex flex-wrap gap-3">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onValueChange={(value) => setStatus(value as OfferStatus)}
              placeholder="All statuses"
              className="w-44"
            />
            <DateRangePicker value={dateRange} onValueChange={setDateRange} />
          </div>
        }
      />
    </div>
  );
}
