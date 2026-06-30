import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAdvertiser, getOffers, getPerformanceReport, type PerformanceGroupBy } from '@cpatracker/mock';
import type { Offer, PerformanceReportRow } from '@cpatracker/types';
import { DataTable, Select } from '@cpatracker/ui';

const GROUP_BY_OPTIONS: { value: PerformanceGroupBy; label: string }[] = [
  { value: 'offer', label: 'Offer' },
  { value: 'geo', label: 'Geo' },
  { value: 'date', label: 'Date' },
];

export function Performance() {
  const [groupBy, setGroupBy] = useState<PerformanceGroupBy>('offer');
  const [rows, setRows] = useState<PerformanceReportRow[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOffers({ advertiserId: demoAdvertiser.id }).then(setOffers);
  }, []);

  useEffect(() => {
    setLoading(true);
    getPerformanceReport({ groupBy, role: 'ADVERTISER', advertiserId: demoAdvertiser.id }).then((report) => {
      setRows(report);
      setLoading(false);
    });
  }, [groupBy]);

  const groupKeyLabel = useMemo(() => {
    const offerNames = new Map(offers.map((o) => [o.id, o.name]));
    return (key: string) => (groupBy === 'offer' ? offerNames.get(key) ?? key : key);
  }, [groupBy, offers]);

  const columns: ColumnDef<PerformanceReportRow>[] = [
    {
      id: 'groupKey',
      header: GROUP_BY_OPTIONS.find((o) => o.value === groupBy)?.label ?? 'Group',
      accessorFn: (row) => groupKeyLabel(row.groupKey),
    },
    { accessorKey: 'clicks', header: 'Clicks' },
    { accessorKey: 'conversions', header: 'Conversions' },
    { id: 'revenue', header: 'Revenue', accessorFn: (row) => `$${(row.revenue ?? 0).toFixed(2)}` },
    { id: 'crPercent', header: 'CR %', accessorFn: (row) => `${row.crPercent.toFixed(2)}%` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Performance</h1>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        emptyState="No data for this grouping."
        filterBar={
          <Select
            options={GROUP_BY_OPTIONS}
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as PerformanceGroupBy)}
            className="w-44"
          />
        }
      />
    </div>
  );
}
