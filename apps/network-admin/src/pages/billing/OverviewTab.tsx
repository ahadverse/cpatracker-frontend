import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  adminTenantId,
  getAdvertisers,
  getAffiliates,
  getInvoices,
  getManagers,
  getSubscription,
  getTenantInvoices,
} from '@cpatracker/mock';
import type { Advertiser, Affiliate, Invoice, Manager, Subscription, TenantInvoice } from '@cpatracker/types';
import { Chart, DataTable, StatCard, StatusBadge } from '@cpatracker/ui';

interface ActivityRow {
  id: string;
  role: string;
  name: string;
  period: string;
  amount: number;
  status: 'PAID' | 'PENDING';
  createdAt: string;
}

export function OverviewTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [subscription, setSubscription] = useState<Subscription>();
  const [tenantInvoices, setTenantInvoices] = useState<TenantInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [invoiceRows, affiliateRows, advertiserRows, managerRows, subscriptionRow, tenantInvoiceRows] =
        await Promise.all([
          getInvoices(),
          getAffiliates(),
          getAdvertisers(),
          getManagers(),
          getSubscription(adminTenantId),
          getTenantInvoices(adminTenantId),
        ]);
      setInvoices(invoiceRows);
      setAffiliates(affiliateRows);
      setAdvertisers(advertiserRows);
      setManagers(managerRows);
      setSubscription(subscriptionRow);
      setTenantInvoices(tenantInvoiceRows);
      setLoading(false);
    }
    load();
  }, []);

  const ownerName = useMemo(() => {
    const affiliateNames = new Map(affiliates.map((a) => [a.id, a.name]));
    const advertiserNames = new Map(advertisers.map((a) => [a.id, a.name]));
    const managerNames = new Map(managers.map((m) => [m.id, m.name]));
    return (invoice: Invoice) => {
      const names =
        invoice.ownerRole === 'AFFILIATE'
          ? affiliateNames
          : invoice.ownerRole === 'ADVERTISER'
            ? advertiserNames
            : managerNames;
      return names.get(invoice.ownerId) ?? invoice.ownerId;
    };
  }, [affiliates, advertisers, managers]);

  const totals = useMemo(() => {
    const sumPending = (role: Invoice['ownerRole']) =>
      invoices.filter((i) => i.ownerRole === role && i.status === 'PENDING').reduce((sum, i) => sum + i.amount, 0);
    return {
      payableToAffiliates: sumPending('AFFILIATE'),
      payableToManagers: sumPending('MANAGER'),
      dueFromAdvertisers: sumPending('ADVERTISER'),
    };
  }, [invoices]);

  // The platform subscription (tens of dollars) is shown in its own stat card
  // above — charting it alongside network payables (thousands of dollars)
  // would render as an invisible sliver, so it's excluded from this chart.
  const chartData = useMemo(
    () => [
      { role: 'Affiliates', amount: Number(totals.payableToAffiliates.toFixed(2)) },
      { role: 'Advertisers', amount: Number(totals.dueFromAdvertisers.toFixed(2)) },
      { role: 'Managers', amount: Number(totals.payableToManagers.toFixed(2)) },
    ],
    [totals],
  );

  const recentActivity = useMemo<ActivityRow[]>(() => {
    const invoiceRows: ActivityRow[] = invoices.map((invoice) => ({
      id: invoice.id,
      role: invoice.ownerRole.charAt(0) + invoice.ownerRole.slice(1).toLowerCase(),
      name: ownerName(invoice),
      period: invoice.period,
      amount: invoice.amount,
      status: invoice.status,
      createdAt: invoice.createdAt,
    }));
    const subscriptionRows: ActivityRow[] = tenantInvoices.map((invoice) => ({
      id: invoice.id,
      role: 'Subscription',
      name: 'Platform subscription',
      period: invoice.period,
      amount: invoice.amount,
      status: invoice.status,
      createdAt: invoice.createdAt,
    }));
    return [...invoiceRows, ...subscriptionRows]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [invoices, tenantInvoices, ownerName]);

  const activityColumns: ColumnDef<ActivityRow>[] = [
    { accessorKey: 'role', header: 'Type' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'period', header: 'Period' },
    { id: 'amount', header: 'Amount', accessorFn: (row) => `$${row.amount.toFixed(2)}` },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={row.original.status === 'PAID' ? 'success' : 'warning'}>
          {row.original.status}
        </StatusBadge>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Payable to Affiliates" value={`$${totals.payableToAffiliates.toFixed(2)}`} />
        <StatCard label="Due from Advertisers" value={`$${totals.dueFromAdvertisers.toFixed(2)}`} />
        <StatCard
          label="Current Plan"
          value={subscription ? `${subscription.plan} — ${subscription.status}` : '—'}
        />
        <StatCard
          label="Next Subscription Payment"
          value={subscription ? new Date(subscription.nextBillingDate).toLocaleDateString() : '—'}
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-lg font-semibold">Pending Amounts by Category</h2>
        <Chart type="bar" data={chartData} xKey="role" series={[{ key: 'amount', label: 'Pending' }]} height={260} />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <DataTable
          columns={activityColumns}
          data={recentActivity}
          loading={loading}
          emptyState="No billing activity yet."
        />
      </div>
    </div>
  );
}
