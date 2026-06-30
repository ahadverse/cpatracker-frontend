import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getAdminConversions,
  getAdvertisers,
  getAffiliates,
  getOffers,
  getPostbackLogs,
} from '@cpatracker/mock';
import type { AdminConversion, Advertiser, Affiliate, Offer, PostbackLog } from '@cpatracker/types';
import { DataTable, Select, StatusBadge } from '@cpatracker/ui';

export interface PostbackLogsTabProps {
  dimension?: 'affiliate' | 'advertiser';
}

export function PostbackLogsTab({ dimension }: PostbackLogsTabProps) {
  const [logs, setLogs] = useState<PostbackLog[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [conversions, setConversions] = useState<AdminConversion[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [filterId, setFilterId] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPostbackLogs(), getOffers(), getAdminConversions(), getAffiliates(), getAdvertisers()]).then(
      ([logRows, offerRows, conversionRows, affiliateRows, advertiserRows]) => {
        setLogs(logRows);
        setOffers(offerRows);
        setConversions(conversionRows);
        setAffiliates(affiliateRows);
        setAdvertisers(advertiserRows);
        setLoading(false);
      },
    );
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);
  const conversionById = useMemo(() => new Map(conversions.map((c) => [c.id, c])), [conversions]);

  const filteredLogs = useMemo(() => {
    if (!dimension || !filterId) return logs;
    return logs.filter((log) => {
      const conversion = conversionById.get(log.conversionId);
      if (!conversion) return false;
      return dimension === 'affiliate' ? conversion.affiliateId === filterId : conversion.advertiserId === filterId;
    });
  }, [logs, dimension, filterId, conversionById]);

  const dimensionOptions =
    dimension === 'affiliate'
      ? affiliates.map((a) => ({ value: a.id, label: a.name }))
      : dimension === 'advertiser'
        ? advertisers.map((a) => ({ value: a.id, label: a.name }))
        : [];

  const columns: ColumnDef<PostbackLog>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (log) => offerNames.get(log.offerId) ?? log.offerId },
    { accessorKey: 'url', header: 'URL', cell: ({ row }) => <span className="break-all">{row.original.url}</span> },
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
    {
      id: 'attemptedAt',
      header: 'Attempted',
      accessorFn: (log) => new Date(log.attemptedAt).toLocaleString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredLogs}
      loading={loading}
      emptyState="No postback attempts yet."
      pageSize={15}
      filterBar={
        dimension && (
          <Select
            options={dimensionOptions}
            value={filterId}
            onValueChange={setFilterId}
            placeholder={dimension === 'affiliate' ? 'All affiliates' : 'All advertisers'}
            className="w-56"
          />
        )
      }
    />
  );
}
