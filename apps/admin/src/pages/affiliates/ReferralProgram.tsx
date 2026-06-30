import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAffiliates } from '@cpatracker/mock';
import type { Affiliate } from '@cpatracker/types';
import { DataTable } from '@cpatracker/ui';

interface ReferralRow extends Affiliate {
  referredByName: string;
  referredCount: number;
}

export function ReferralProgram() {
  const [rows, setRows] = useState<ReferralRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAffiliates().then((affiliates) => {
      const names = new Map(affiliates.map((a) => [a.id, a.name]));
      const referredCounts = new Map<string, number>();
      for (const affiliate of affiliates) {
        if (affiliate.referredBy) {
          referredCounts.set(affiliate.referredBy, (referredCounts.get(affiliate.referredBy) ?? 0) + 1);
        }
      }
      setRows(
        affiliates.map((affiliate) => ({
          ...affiliate,
          referredByName: affiliate.referredBy ? names.get(affiliate.referredBy) ?? affiliate.referredBy : '—',
          referredCount: referredCounts.get(affiliate.id) ?? 0,
        })),
      );
      setLoading(false);
    });
  }, []);

  const columns: ColumnDef<ReferralRow>[] = useMemo(
    () => [
      { accessorKey: 'name', header: 'Affiliate' },
      { accessorKey: 'referredByName', header: 'Referred By' },
      { accessorKey: 'referredCount', header: 'Affiliates Referred' },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Referral Program</h1>

      <DataTable columns={columns} data={rows} loading={loading} emptyState="No affiliates yet." />
    </div>
  );
}
