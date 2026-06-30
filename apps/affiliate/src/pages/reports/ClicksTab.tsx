import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getClicks, getOffers } from '@cpatracker/mock';
import type { Click, Offer } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

const QUALITY_VARIANT: Record<Click['qualityStatus'], 'success' | 'warning' | 'destructive' | 'neutral'> = {
  VALID: 'success',
  SUSPICIOUS: 'warning',
  BOT: 'destructive',
  PROXY: 'destructive',
  DUPLICATE: 'neutral',
};

export function ClicksTab() {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClicks({ affiliateId: demoAffiliate.id }), getOffers()]).then(([clickRows, offerRows]) => {
      setClicks(clickRows);
      setOffers(offerRows);
      setLoading(false);
    });
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);

  const columns: ColumnDef<Click>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (click) => offerNames.get(click.offerId) ?? click.offerId },
    { accessorKey: 'geo', header: 'Geo' },
    { accessorKey: 'device', header: 'Device' },
    { id: 'unique', header: 'Unique', accessorFn: (click) => (click.isUnique ? 'Yes' : 'No') },
    {
      accessorKey: 'qualityStatus',
      header: 'Quality',
      cell: ({ row }) => (
        <StatusBadge variant={QUALITY_VARIANT[row.original.qualityStatus]}>
          {row.original.qualityStatus}
        </StatusBadge>
      ),
    },
    { id: 'createdAt', header: 'Time', accessorFn: (click) => new Date(click.createdAt).toLocaleString() },
  ];

  return (
    <DataTable columns={columns} data={clicks} loading={loading} emptyState="No clicks." pageSize={15} />
  );
}
