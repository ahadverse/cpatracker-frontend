import { useEffect, useState } from 'react';
import { demoAffiliate, getOffers, getPerformanceReport } from '@cpatracker/mock';
import type { PerformanceReportRow } from '@cpatracker/types';
import { Chart, Skeleton, StatCard } from '@cpatracker/ui';

interface RankedRow {
  id: string;
  label: string;
  payout: number;
}

interface DashboardData {
  clicks: number;
  conversions: number;
  payout: number;
  trend: PerformanceReportRow[];
  topOffers: RankedRow[];
}

async function loadDashboardData(): Promise<DashboardData> {
  const [trendRaw, byOffer, offers] = await Promise.all([
    getPerformanceReport({ groupBy: 'date', role: 'AFFILIATE', affiliateId: demoAffiliate.id }),
    getPerformanceReport({ groupBy: 'offer', role: 'AFFILIATE', affiliateId: demoAffiliate.id }),
    getOffers(),
  ]);

  const offerNames = new Map(offers.map((o) => [o.id, o.name]));
  const trend = [...trendRaw].sort((a, b) => (a.groupKey < b.groupKey ? -1 : 1));

  return {
    clicks: trend.reduce((sum, row) => sum + row.clicks, 0),
    conversions: trend.reduce((sum, row) => sum + row.conversions, 0),
    payout: Number(trend.reduce((sum, row) => sum + row.payout, 0).toFixed(2)),
    trend,
    topOffers: byOffer
      .map((row) => ({ id: row.groupKey, label: offerNames.get(row.groupKey) ?? row.groupKey, payout: row.payout }))
      .sort((a, b) => b.payout - a.payout)
      .slice(0, 5),
  };
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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Clicks" value={data.clicks} />
        <StatCard label="Conversions" value={data.conversions} />
        <StatCard label="Payout" value={`$${data.payout.toFixed(2)}`} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Payout (14 days)</h3>
        <Chart type="line" data={data.trend} xKey="groupKey" series={[{ key: 'payout', label: 'Payout' }]} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Top Offers</h3>
        <ul className="mt-3 space-y-2">
          {data.topOffers.length === 0 && <li className="text-sm text-muted-foreground">No data.</li>}
          {data.topOffers.map((row) => (
            <li key={row.id} className="flex items-center justify-between text-sm">
              <span className="truncate text-card-foreground">{row.label}</span>
              <span className="shrink-0 font-medium text-card-foreground">${row.payout.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
