import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getNetworkAdminConversions, getAdvertisers, getAffiliates, getOffers } from '@cpatracker/mock';
import type { NetworkAdminConversion, Advertiser, Affiliate, Offer } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

const STATUS_VARIANT: Record<NetworkAdminConversion['status'], 'success' | 'warning' | 'destructive'> = {
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'destructive',
};

export function ConversionsTab() {
  const [conversions, setConversions] = useState<NetworkAdminConversion[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getNetworkAdminConversions(), getOffers(), getAffiliates(), getAdvertisers()]).then(
      ([conversionRows, offerRows, affiliateRows, advertiserRows]) => {
        setConversions(conversionRows);
        setOffers(offerRows);
        setAffiliates(affiliateRows);
        setAdvertisers(advertiserRows);
        setLoading(false);
      },
    );
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);
  const affiliateNames = useMemo(() => new Map(affiliates.map((a) => [a.id, a.name])), [affiliates]);
  const advertiserNames = useMemo(() => new Map(advertisers.map((a) => [a.id, a.name])), [advertisers]);

  const columns: ColumnDef<NetworkAdminConversion>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (c) => offerNames.get(c.offerId) ?? c.offerId },
    { id: 'affiliate', header: 'Affiliate', accessorFn: (c) => affiliateNames.get(c.affiliateId) ?? c.affiliateId },
    { id: 'advertiser', header: 'Advertiser', accessorFn: (c) => advertiserNames.get(c.advertiserId) ?? c.advertiserId },
    { accessorKey: 'goal', header: 'Goal' },
    { id: 'txnId', header: 'Txn ID', accessorFn: (c) => c.txnId ?? '—' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>,
    },
    { id: 'revenue', header: 'Revenue', accessorFn: (c) => `$${c.revenue.toFixed(2)}` },
    { id: 'payout', header: 'Payout', accessorFn: (c) => `$${c.payout.toFixed(2)}` },
    { id: 'profit', header: 'Profit', accessorFn: (c) => `$${c.profit.toFixed(2)}` },
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
