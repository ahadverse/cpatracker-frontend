import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getClicks, getOffers, getSmartLinks, type ClickFilters } from '@cpatracker/mock';
import type { Click, ClickOS, Offer, SmartLink } from '@cpatracker/types';
import { DataTable, DateRangePicker, MultiSelect, Select, StatusBadge, type DateRange } from '@cpatracker/ui';

const QUALITY_VARIANT: Record<Click['qualityStatus'], 'success' | 'warning' | 'destructive' | 'neutral'> = {
  VALID: 'success',
  SUSPICIOUS: 'warning',
  BOT: 'destructive',
  PROXY: 'destructive',
  DUPLICATE: 'neutral',
};

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

export function ClicksTab() {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [smartLinks, setSmartLinks] = useState<SmartLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [offerId, setOfferId] = useState<string>();
  const [os, setOs] = useState<ClickOS>();
  const [smartLinkId, setSmartLinkId] = useState<string>();
  const [countries, setCountries] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>();

  useEffect(() => {
    getOffers().then(setOffers);
    getSmartLinks().then(setSmartLinks);
  }, []);

  useEffect(() => {
    setLoading(true);
    const filters: ClickFilters = {
      affiliateId: demoAffiliate.id,
      offerId,
      os,
      smartLinkId,
      countries: countries.length ? countries : undefined,
      devices: devices.length ? (devices as Click['device'][]) : undefined,
      dateFrom: dateRange?.from?.toISOString(),
      dateTo: dateRange?.to?.toISOString(),
    };
    getClicks(filters).then((clickRows) => {
      setClicks(clickRows);
      setLoading(false);
    });
  }, [offerId, os, smartLinkId, countries, devices, dateRange]);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);

  const columns: ColumnDef<Click>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (click) => offerNames.get(click.offerId) ?? click.offerId },
    { accessorKey: 'geo', header: 'Geo' },
    { accessorKey: 'device', header: 'Device' },
    { accessorKey: 'os', header: 'OS' },
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
    <DataTable
      columns={columns}
      data={clicks}
      loading={loading}
      emptyState="No clicks."
      pageSize={15}
      filterBar={
        <div className="flex flex-wrap gap-3">
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
        </div>
      }
    />
  );
}
