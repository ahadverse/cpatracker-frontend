import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAffiliateConversions, getAffiliates } from '@cpatracker/mock';
import type { Affiliate } from '@cpatracker/types';
import { DataTable } from '@cpatracker/ui';

interface AffiliatePointsRow {
  affiliate: Affiliate;
  points: number;
}

export function AffiliatePoints() {
  const [rows, setRows] = useState<AffiliatePointsRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const affiliates = await getAffiliates();
    const withPoints = await Promise.all(
      affiliates.map(async (affiliate) => {
        const conversions = await getAffiliateConversions(affiliate.id);
        const totalEarned = conversions
          .filter((c) => c.status === 'APPROVED')
          .reduce((sum, c) => sum + c.payout, 0);
        return { affiliate, points: Math.floor(totalEarned / 50) };
      }),
    );
    setRows(withPoints);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const columns: ColumnDef<AffiliatePointsRow>[] = [
    { id: 'name', header: 'Name', accessorFn: (row) => row.affiliate.name },
    { accessorKey: 'points', header: 'Points' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Affiliate Points</h1>
      <p className="text-sm text-muted-foreground">
        Points are derived automatically — 1 point per $50 of approved payout. There's no manual override.
      </p>

      <DataTable columns={columns} data={rows} loading={loading} emptyState="No affiliates yet." />
    </div>
  );
}
