import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAdvertiser, getAdvertiserConversions, getOffers } from '@cpatracker/mock';
import type { AdvertiserConversion, Offer } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

const STATUS_VARIANT: Record<AdvertiserConversion['status'], 'success' | 'warning' | 'destructive'> = {
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'destructive',
};

export function Conversions() {
  const [conversions, setConversions] = useState<AdvertiserConversion[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdvertiserConversions(demoAdvertiser.id), getOffers({ advertiserId: demoAdvertiser.id })]).then(
      ([conversionRows, offerRows]) => {
        setConversions(conversionRows);
        setOffers(offerRows);
        setLoading(false);
      },
    );
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);

  const columns: ColumnDef<AdvertiserConversion>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (c) => offerNames.get(c.offerId) ?? c.offerId },
    { accessorKey: 'goal', header: 'Goal' },
    { id: 'txnId', header: 'Txn ID', accessorFn: (c) => c.txnId ?? '—' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>,
    },
    { id: 'revenue', header: 'Revenue', accessorFn: (c) => `$${c.revenue.toFixed(2)}` },
    { id: 'createdAt', header: 'Time', accessorFn: (c) => new Date(c.createdAt).toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Conversions</h1>

      <DataTable
        columns={columns}
        data={conversions}
        loading={loading}
        emptyState="No conversions yet."
        pageSize={15}
      />
    </div>
  );
}
