import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getClicks, getOffers } from '@cpatracker/mock';
import type { Click, Offer, SubIds } from '@cpatracker/types';
import { DataTable } from '@cpatracker/ui';

const SUB_ID_KEYS: (keyof SubIds)[] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];

export function SubIdTrackingTab() {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClicks({ affiliateId: demoAffiliate.id }), getOffers()]).then(([clickRows, offerRows]) => {
      setClicks(clickRows.filter((click) => Object.keys(click.subIds).length > 0));
      setOffers(offerRows);
      setLoading(false);
    });
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);

  const columns: ColumnDef<Click>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (click) => offerNames.get(click.offerId) ?? click.offerId },
    ...SUB_ID_KEYS.map<ColumnDef<Click>>((key) => ({
      id: key,
      header: key.toUpperCase(),
      accessorFn: (click) => click.subIds[key] ?? '—',
    })),
    { id: 'createdAt', header: 'Time', accessorFn: (click) => new Date(click.createdAt).toLocaleString() },
  ];

  return (
    <DataTable
      columns={columns}
      data={clicks}
      loading={loading} emptyState="No clicks with sub-ID data."
      pageSize={15}
    />
  );
}
