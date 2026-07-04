import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getOffers, getPerformanceReport, getSmartLinks, type PerformanceGroupBy } from '@cpatracker/mock';
import type { Click, ClickOS, Offer, PerformanceReportRow, SmartLink } from '@cpatracker/types';
import { DataTable, DateRangePicker, MultiSelect, Select, type DateRange } from '@cpatracker/ui';

const GROUP_BY_OPTIONS: { value: PerformanceGroupBy; label: string }[] = [
  { value: 'offer', label: 'Offer' },
  { value: 'geo', label: 'Geo' },
  { value: 'date', label: 'Date' },
];

const OS_OPTIONS: { value: ClickOS; label: string }[] = [
  { value: 'WINDOWS', label: 'Windows' },
  { value: 'MACOS', label: 'macOS' },
  { value: 'IOS', label: 'iOS' },
  { value: 'ANDROID', label: 'Android' },
  { value: 'LINUX', label: 'Linux' },
];

const COUNTRY_OPTIONS = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'BR', 'IN'].map((code) => ({
  value: code,
  label: code,
}));

const DEVICE_OPTIONS: { value: Click['device']; label: string }[] = [
  { value: 'DESKTOP', label: 'Desktop' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'TABLET', label: 'Tablet' },
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
  const [offerId, setOfferId] = useState<string>();
  const [os, setOs] = useState<ClickOS>();
  const [smartLinkId, setSmartLinkId] = useState<string>();
  const [countries, setCountries] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>();
  const [rows, setRows] = useState<PerformanceReportRow[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [smartLinks, setSmartLinks] = useState<SmartLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOffers().then(setOffers);
    getSmartLinks().then(setSmartLinks);
  }, []);

  useEffect(() => {
    setLoading(true);
    getPerformanceReport({
      groupBy,
      role: 'AFFILIATE',
      affiliateId: demoAffiliate.id,
      offerId,
      os,
      smartLinkId,
      countries: countries.length ? countries : undefined,
      devices: devices.length ? (devices as Click['device'][]) : undefined,
      dateFrom: dateRange?.from?.toISOString(),
      dateTo: dateRange?.to?.toISOString(),
    }).then((report) => {
      setRows(report);
      setLoading(false);
    });
  }, [groupBy, offerId, os, smartLinkId, countries, devices, dateRange]);

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
        <div className="flex flex-wrap gap-3">
          <Select
            options={GROUP_BY_OPTIONS}
            value={groupBy}
            onValueChange={(value) => setGroupBy(value as PerformanceGroupBy)}
            className="w-44"
          />
          <Select
            options={offers.map((o) => ({ value: o.id, label: o.name }))}
            value={offerId}
            onValueChange={setOfferId}
            placeholder="All offers"
            className="w-48"
          />
          <DateRangePicker value={dateRange} onValueChange={setDateRange} />
          <Select options={OS_OPTIONS} value={os} onValueChange={(value) => setOs(value as ClickOS)} placeholder="All OS" className="w-36" />
          <MultiSelect options={COUNTRY_OPTIONS} value={countries} onValueChange={setCountries} placeholder="Countries" className="w-44" />
          <MultiSelect options={DEVICE_OPTIONS} value={devices} onValueChange={setDevices} placeholder="Devices" className="w-40" />
          <Select
            options={smartLinks.map((s) => ({ value: s.id, label: s.name }))}
            value={smartLinkId}
            onValueChange={setSmartLinkId}
            placeholder="All smart-links"
            className="w-52"
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
