import { useEffect, useState } from 'react';
import {
  getAdminDashboardStats,
  getAdvertisers,
  getAffiliates,
  getInvoices,
  getOffers,
  getPerformanceReport,
  type AdminDashboardStats,
} from '@cpatracker/mock';
import type { Invoice, PerformanceReportRow } from '@cpatracker/types';
import { Chart, StatCard } from '@cpatracker/ui';

interface RankedRow {
  id: string;
  label: string;
  metric: number;
}

interface DashboardData {
  stats: AdminDashboardStats;
  trend: PerformanceReportRow[];
  topOffers: RankedRow[];
  topAffiliates: RankedRow[];
  topAdvertisers: RankedRow[];
  pendingInvoices: (Invoice & { ownerLabel: string })[];
}

function rankBy(
  rows: PerformanceReportRow[],
  metric: 'revenue' | 'payout',
  labels: Map<string, string>,
): RankedRow[] {
  return rows
    .map((row) => ({ id: row.groupKey, label: labels.get(row.groupKey) ?? row.groupKey, metric: row[metric] ?? 0 }))
    .sort((a, b) => b.metric - a.metric)
    .slice(0, 5);
}

async function loadDashboardData(): Promise<DashboardData> {
  const [stats, trendRaw, byOffer, byAffiliate, byAdvertiser, offers, affiliates, advertisers, invoices] =
    await Promise.all([
      getAdminDashboardStats(),
      getPerformanceReport({ groupBy: 'date', role: 'ADMIN' }),
      getPerformanceReport({ groupBy: 'offer', role: 'ADMIN' }),
      getPerformanceReport({ groupBy: 'affiliate', role: 'ADMIN' }),
      getPerformanceReport({ groupBy: 'advertiser', role: 'ADMIN' }),
      getOffers(),
      getAffiliates(),
      getAdvertisers(),
      getInvoices(),
    ]);

  const offerNames = new Map(offers.map((o) => [o.id, o.name]));
  const affiliateNames = new Map(affiliates.map((a) => [a.id, a.name]));
  const advertiserNames = new Map(advertisers.map((a) => [a.id, a.name]));
  const ownerLabel = (invoice: Invoice) => {
    const names =
      invoice.ownerRole === 'AFFILIATE'
        ? affiliateNames
        : invoice.ownerRole === 'ADVERTISER'
          ? advertiserNames
          : undefined;
    return names?.get(invoice.ownerId) ?? invoice.ownerId;
  };

  return {
    stats,
    trend: [...trendRaw].sort((a, b) => (a.groupKey < b.groupKey ? -1 : 1)),
    topOffers: rankBy(byOffer, 'revenue', offerNames),
    topAffiliates: rankBy(byAffiliate, 'payout', affiliateNames),
    topAdvertisers: rankBy(byAdvertiser, 'revenue', advertiserNames),
    pendingInvoices: invoices
      .filter((invoice) => invoice.status === 'PENDING')
      .map((invoice) => ({ ...invoice, ownerLabel: ownerLabel(invoice) })),
  };
}

function RankedList({ title, rows }: { title: string; rows: RankedRow[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 && <li className="text-sm text-muted-foreground">No data.</li>}
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between text-sm">
            <span className="truncate text-card-foreground">{row.label}</span>
            <span className="shrink-0 font-medium text-card-foreground">${row.metric.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboardData().then(setData);
  }, []);

  if (!data) return null;

  const { stats, trend, topOffers, topAffiliates, topAdvertisers, pendingInvoices } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Clicks" value={stats.clicks} />
        <StatCard label="Conversions Approved" value={stats.conversionsApproved} />
        <StatCard label="Conversions Pending" value={stats.conversionsPending} />
        <StatCard label="Conversions Rejected" value={stats.conversionsRejected} />
        <StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
        <StatCard label="Payout" value={`$${stats.payout.toFixed(2)}`} />
        <StatCard label="Profit" value={`$${stats.profit.toFixed(2)}`} />
        <StatCard label="Pending Invoices" value={stats.pendingInvoices} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Revenue vs Payout (14 days)</h3>
        <Chart
          type="line"
          data={trend}
          xKey="groupKey"
          series={[
            { key: 'revenue', label: 'Revenue' },
            { key: 'payout', label: 'Payout' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RankedList title="Top Offers" rows={topOffers} />
        <RankedList title="Top Affiliates" rows={topAffiliates} />
        <RankedList title="Top Advertisers" rows={topAdvertisers} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Pending Invoices</h3>
        <ul className="mt-3 space-y-2">
          {pendingInvoices.length === 0 && <li className="text-sm text-muted-foreground">No pending invoices.</li>}
          {pendingInvoices.map((invoice) => (
            <li key={invoice.id} className="flex items-center justify-between text-sm">
              <span className="text-card-foreground">
                {invoice.ownerLabel} <span className="text-muted-foreground">({invoice.period})</span>
              </span>
              <span className="font-medium text-card-foreground">${invoice.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
