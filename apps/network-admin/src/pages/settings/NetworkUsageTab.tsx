import { useEffect, useState } from 'react';
import { getPerformanceReport } from '@cpatracker/mock';
import type { PerformanceReportRow } from '@cpatracker/types';
import { Chart, Skeleton } from '@cpatracker/ui';

export function NetworkUsageTab() {
  const [trend, setTrend] = useState<PerformanceReportRow[] | null>(null);

  useEffect(() => {
    getPerformanceReport({ groupBy: 'date', role: 'NETWORK_ADMIN' }).then((rows) => {
      setTrend([...rows].sort((a, b) => (a.groupKey < b.groupKey ? -1 : 1)));
    });
  }, []);

  if (!trend) return <Skeleton className="h-64" />;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Network Click Volume (14 days)</h3>
      <Chart type="line" data={trend} xKey="groupKey" series={[{ key: 'clicks', label: 'Clicks' }]} />
    </div>
  );
}
