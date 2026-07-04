import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getAdvertiserSubscriptions,
  getAdvertisers,
  type AdvertiserSubscriptionFilters,
} from '@cpatracker/mock';
import type { Advertiser, AdvertiserPlanTier, AdvertiserSubscription, AdvertiserSubscriptionStatus } from '@cpatracker/types';
import { DataTable, Select, StatusBadge } from '@cpatracker/ui';

const PLAN_OPTIONS: { value: AdvertiserPlanTier; label: string }[] = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'PRO', label: 'Pro' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
];

const STATUS_OPTIONS: { value: AdvertiserSubscriptionStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAST_DUE', label: 'Past Due' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const STATUS_VARIANT: Record<AdvertiserSubscriptionStatus, 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  PAST_DUE: 'warning',
  CANCELLED: 'destructive',
};

export function AllSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<AdvertiserSubscription[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [filters, setFilters] = useState<AdvertiserSubscriptionFilters>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [subscriptionRows, advertiserRows] = await Promise.all([
      getAdvertiserSubscriptions(filters),
      getAdvertisers(),
    ]);
    setSubscriptions(subscriptionRows);
    setAdvertisers(advertiserRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.plan, filters.status]);

  const advertiserNames = useMemo(() => new Map(advertisers.map((a) => [a.id, a.name])), [advertisers]);

  const columns: ColumnDef<AdvertiserSubscription>[] = [
    {
      id: 'advertiser',
      header: 'Advertiser',
      accessorFn: (subscription) => advertiserNames.get(subscription.advertiserId) ?? subscription.advertiserId,
    },
    { accessorKey: 'plan', header: 'Plan' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: 'nextBillingDate',
      header: 'Next Billing',
      accessorFn: (subscription) => new Date(subscription.nextBillingDate).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Subscriptions</h1>

      <DataTable
        columns={columns}
        data={subscriptions}
        loading={loading}
        emptyState="No subscriptions match these filters."
        filterBar={
          <div className="flex flex-wrap gap-3">
            <Select
              options={PLAN_OPTIONS}
              value={filters.plan}
              onValueChange={(value) => setFilters((f) => ({ ...f, plan: value as AdvertiserPlanTier }))}
              placeholder="All plans"
              className="w-44"
            />
            <Select
              options={STATUS_OPTIONS}
              value={filters.status}
              onValueChange={(value) => setFilters((f) => ({ ...f, status: value as AdvertiserSubscriptionStatus }))}
              placeholder="All statuses"
              className="w-44"
            />
          </div>
        }
      />
    </div>
  );
}
