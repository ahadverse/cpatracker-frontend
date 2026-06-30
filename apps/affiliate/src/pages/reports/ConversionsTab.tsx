import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getAffiliateConversions, getOffers } from '@cpatracker/mock';
import type { AffiliateConversion, Offer } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

const STATUS_VARIANT: Record<AffiliateConversion['status'], 'success' | 'warning' | 'destructive'> = {
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'destructive',
};

export function ConversionsTab() {
  const [conversions, setConversions] = useState<AffiliateConversion[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAffiliateConversions(demoAffiliate.id), getOffers()]).then(([conversionRows, offerRows]) => {
      setConversions(conversionRows);
      setOffers(offerRows);
      setLoading(false);
    });
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);

  const columns: ColumnDef<AffiliateConversion>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (c) => offerNames.get(c.offerId) ?? c.offerId },
    { accessorKey: 'goal', header: 'Goal' },
    { id: 'txnId', header: 'Txn ID', accessorFn: (c) => c.txnId ?? '—' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>,
    },
    { id: 'payout', header: 'Payout', accessorFn: (c) => `$${c.payout.toFixed(2)}` },
    { id: 'createdAt', header: 'Time', accessorFn: (c) => new Date(c.createdAt).toLocaleString() },
  ];

  return (
    <DataTable
      columns={columns}
      data={conversions}
      loading={loading} emptyState="No conversions."
      pageSize={15}
    />
  );
}
