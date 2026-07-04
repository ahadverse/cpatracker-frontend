import { useEffect, useState } from 'react';
import { getPlans, getSubscriptions, getTenants } from '@cpatracker/mock';
import { Chart, Skeleton, StatCard } from '@cpatracker/ui';

interface MonthlySignups {
  month: string;
  count: number;
}

interface RankedTenant {
  id: string;
  label: string;
  metric: number;
}

interface DashboardData {
  totalTenants: number;
  trialCount: number;
  activeCount: number;
  suspendedCount: number;
  cancelledCount: number;
  mrr: number;
  arr: number;
  growth: MonthlySignups[];
  topTenants: RankedTenant[];
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

async function loadDashboardData(): Promise<DashboardData> {
  const [tenants, subscriptions, plans] = await Promise.all([getTenants(), getSubscriptions(), getPlans()]);

  const priceByPlan = new Map(plans.map((p) => [p.id, p.price]));
  const activeTenantIds = new Set(subscriptions.filter((s) => s.status === 'ACTIVE').map((s) => s.tenantId));
  const mrr = tenants
    .filter((t) => activeTenantIds.has(t.id))
    .reduce((sum, t) => sum + (priceByPlan.get(t.plan) ?? 0), 0);

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d.toISOString().slice(0, 7);
  });
  const growth: MonthlySignups[] = months.map((month) => ({
    month,
    count: tenants.filter((t) => monthKey(t.createdAt) === month).length,
  }));

  const topTenants: RankedTenant[] = [...tenants]
    .sort((a, b) => b.usage.clicks - a.usage.clicks)
    .slice(0, 5)
    .map((t) => ({ id: t.id, label: t.companyName, metric: t.usage.clicks }));

  return {
    totalTenants: tenants.length,
    trialCount: tenants.filter((t) => t.status === 'TRIAL').length,
    activeCount: tenants.filter((t) => t.status === 'ACTIVE').length,
    suspendedCount: tenants.filter((t) => t.status === 'SUSPENDED').length,
    cancelledCount: tenants.filter((t) => t.status === 'CANCELLED').length,
    mrr: Number(mrr.toFixed(2)),
    arr: Number((mrr * 12).toFixed(2)),
    growth,
    topTenants,
  };
}

function TopTenantsList({ rows }: { rows: RankedTenant[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground">Top Tenants by Clicks</h3>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 && <li className="text-sm text-muted-foreground">No data.</li>}
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between text-sm">
            <span className="truncate text-card-foreground">{row.label}</span>
            <span className="shrink-0 font-medium text-card-foreground">{row.metric.toLocaleString()}</span>
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

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  const { totalTenants, trialCount, activeCount, suspendedCount, cancelledCount, mrr, arr, growth, topTenants } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Tenants" value={totalTenants} />
        <StatCard label="Active" value={activeCount} />
        <StatCard label="Trial" value={trialCount} />
        <StatCard label="Suspended" value={suspendedCount} />
        <StatCard label="Cancelled" value={cancelledCount} />
        <StatCard label="MRR" value={`$${mrr.toFixed(2)}`} />
        <StatCard label="ARR" value={`$${arr.toFixed(2)}`} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Tenant Growth (6 months)</h3>
        <Chart type="bar" data={growth} xKey="month" series={[{ key: 'count', label: 'New Tenants' }]} />
      </div>

      <TopTenantsList rows={topTenants} />
    </div>
  );
}
