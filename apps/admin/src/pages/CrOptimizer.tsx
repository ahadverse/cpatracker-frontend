import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAffiliates, getOffers, getPerformanceReport } from '@cpatracker/mock';
import type { PerformanceReportRow } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

export interface CrOptimizerProps {
  title: string;
  dimension: 'offer' | 'affiliate';
}

interface Row extends PerformanceReportRow {
  label: string;
}

function crVariant(crPercent: number): 'success' | 'warning' | 'destructive' {
  if (crPercent >= 5) return 'success';
  if (crPercent >= 2) return 'warning';
  return 'destructive';
}

export function CrOptimizer({ title, dimension }: CrOptimizerProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPerformanceReport({ groupBy: dimension, role: 'ADMIN' }),
      dimension === 'offer' ? getOffers() : getAffiliates(),
    ]).then(([report, entities]) => {
      const names = new Map(entities.map((e) => [e.id, e.name]));
      setRows(
        [...report]
          .map((row) => ({ ...row, label: names.get(row.groupKey) ?? row.groupKey }))
          .sort((a, b) => b.crPercent - a.crPercent),
      );
      setLoading(false);
    });
  }, [dimension]);

  const columns: ColumnDef<Row>[] = [
    { accessorKey: 'label', header: dimension === 'offer' ? 'Offer' : 'Affiliate' },
    { accessorKey: 'clicks', header: 'Clicks' },
    { accessorKey: 'conversions', header: 'Conversions' },
    {
      id: 'crPercent',
      header: 'CR %',
      cell: ({ row }) => (
        <StatusBadge variant={crVariant(row.original.crPercent)}>{row.original.crPercent.toFixed(2)}%</StatusBadge>
      ),
    },
    { id: 'epc', header: 'EPC', accessorFn: (row) => `$${row.epc.toFixed(2)}` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">
        Ranked by conversion rate — green is performing well, red needs attention.
      </p>

      <DataTable columns={columns} data={rows} loading={loading} emptyState="No data yet." />
    </div>
  );
}
