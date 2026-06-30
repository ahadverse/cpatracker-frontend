import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getAffiliateConversions, getOffers, getPostbackLogs } from '@cpatracker/mock';
import type { Offer, PostbackLog } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

export function PostbackLogsTab() {
  const [logs, setLogs] = useState<PostbackLog[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPostbackLogs(), getAffiliateConversions(demoAffiliate.id), getOffers()]).then(
      ([logRows, conversionRows, offerRows]) => {
        const ownConversionIds = new Set(conversionRows.map((c) => c.id));
        setLogs(logRows.filter((log) => ownConversionIds.has(log.conversionId)));
        setOffers(offerRows);
        setLoading(false);
      },
    );
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);

  const columns: ColumnDef<PostbackLog>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (log) => offerNames.get(log.offerId) ?? log.offerId },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={row.original.status === 'SUCCESS' ? 'success' : 'destructive'}>
          {row.original.status}
        </StatusBadge>
      ),
    },
    { accessorKey: 'responseCode', header: 'Response Code' },
    { id: 'attemptedAt', header: 'Attempted', accessorFn: (log) => new Date(log.attemptedAt).toLocaleString() },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      loading={loading} emptyState="No postback attempts yet."
      pageSize={15}
    />
  );
}
