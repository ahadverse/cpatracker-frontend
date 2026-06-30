import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getOffers, getSmartLinks } from '@cpatracker/mock';
import type { Offer, SmartLink } from '@cpatracker/types';
import { DataTable, toast } from '@cpatracker/ui';

export function SmartLinks() {
  const [smartLinks, setSmartLinks] = useState<SmartLink[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSmartLinks(), getOffers()]).then(([linkRows, offerRows]) => {
      setSmartLinks(linkRows);
      setOffers(offerRows);
      setLoading(false);
    });
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);

  async function copyLink(alias: string) {
    await navigator.clipboard.writeText(alias);
    toast.success('Link copied');
  }

  const columns: ColumnDef<SmartLink>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'offers',
      header: 'Offers',
      cell: ({ row }) => row.original.offerIds.map((id) => offerNames.get(id) ?? id).join(', '),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => copyLink(row.original.alias)}
          className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Copy link
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Smart-Links</h1>

      <DataTable
        columns={columns}
        data={smartLinks}
        loading={loading} emptyState="No smart-links available."
      />
    </div>
  );
}
