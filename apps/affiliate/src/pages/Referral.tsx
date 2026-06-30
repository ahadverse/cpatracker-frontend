import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getAffiliates } from '@cpatracker/mock';
import type { Affiliate } from '@cpatracker/types';
import { DataTable, Input, toast } from '@cpatracker/ui';

export function Referral() {
  const [referred, setReferred] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const referralLink = `https://cpatracker.dev/join?ref=${demoAffiliate.id}`;

  useEffect(() => {
    getAffiliates().then((affiliates) => {
      setReferred(affiliates.filter((a) => a.referredBy === demoAffiliate.id));
      setLoading(false);
    });
  }, []);

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied');
  }

  const columns: ColumnDef<Affiliate>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'country', header: 'Country' },
    { accessorKey: 'status', header: 'Status' },
    {
      id: 'createdAt',
      header: 'Joined',
      accessorFn: (affiliate) => new Date(affiliate.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Referral Program</h1>

      <div className="space-y-2 rounded-lg border border-border bg-card p-4">
        <label className="text-sm font-medium text-foreground">Your referral link</label>
        <div className="flex gap-2">
          <Input value={referralLink} readOnly />
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Affiliates you've referred</h2>
        <DataTable columns={columns} data={referred} loading={loading} emptyState="No referrals yet." />
      </div>
    </div>
  );
}
