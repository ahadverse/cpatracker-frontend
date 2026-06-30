import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getOffers, getPerformanceReport, type PerformanceGroupBy } from '@cpatracker/mock';
import type { Offer, PerformanceReportRow } from '@cpatracker/types';
import { DataTable, MultiSelect, Select } from '@cpatracker/ui';

const GROUP_BY_OPTIONS: { value: PerformanceGroupBy; label: string }[] = [
  { value: 'offer', label: 'Offer' },
  { value: 'geo', label: 'Geo' },
  { value: 'date', label: 'Date' },
];

type OptionalColumn = 'uniqueClicks' | 'crPercent' | 'epc';

const OPTIONAL_COLUMN_OPTIONS: { value: OptionalColumn; label: string }[] = [
  { value: 'uniqueClicks', label: 'Unique Clicks' },
  { value: 'crPercent', label: 'CR %' },
  { value: 'epc', label: 'EPC' },
];

export function PerformanceTab() {
  const [groupBy, setGroupBy] = useState<PerformanceGroupBy>('offer');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['crPercent']);
  const [rows, setRows] = useState<PerformanceReportRow[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOffers().then(setOffers);
  }, []);

  useEffect(() => {
    setLoading(true);
    getPerformanceReport({ groupBy, role: 'AFFILIATE', affiliateId: demoAffiliate.id }).then((report) => {
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
    ...(visibleColumns.includes('uniqueClicks')
      ? [{ accessorKey: 'uniqueClicks', header: 'Unique Clicks' } as ColumnDef<PerformanceReportRow>]
      : []),
    { accessorKey: 'conversions', header: 'Conversions' },
    { id: 'payout', header: 'Payout', accessorFn: (row) => `$${row.payout.toFixed(2)}` },
    ...(visibleColumns.includes('crPercent')
      ? [
          {
            id: 'crPercent',
            header: 'CR %',
            accessorFn: (row: PerformanceReportRow) => `${row.crPercent.toFixed(2)}%`,
          } as ColumnDef<PerformanceReportRow>,
        ]
      : []),
    ...(visibleColumns.includes('epc')
      ? [
          {
            id: 'epc',
            header: 'EPC',
            accessorFn: (row: PerformanceReportRow) => `$${row.epc.toFixed(2)}`,
          } as ColumnDef<PerformanceReportRow>,
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      loading={loading} emptyState="No data for this grouping."
      pageSize={15}
      filterBar={
        <div className="flex gap-3">
          <Select
            options={GROUP_BY_OPTIONS}
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as PerformanceGroupBy)}
            className="w-44"
          />
          <MultiSelect
            options={OPTIONAL_COLUMN_OPTIONS}
            value={visibleColumns}
            onValueChange={setVisibleColumns}
            placeholder="Columns"
            className="w-56"
          />
        </div>
      }
    />
  );
}
