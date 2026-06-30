import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getOfferAccessRequests, getOffers } from '@cpatracker/mock';
import type { Offer, OfferAccessRequest } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

export function RequestAccess() {
  const [requests, setRequests] = useState<OfferAccessRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOfferAccessRequests(demoAffiliate.id), getOffers()]).then(([requestRows, offerRows]) => {
      setRequests(requestRows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
      setOffers(offerRows);
      setLoading(false);
    });
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);

  const columns: ColumnDef<OfferAccessRequest>[] = [
    { id: 'offer', header: 'Offer', accessorFn: (r) => offerNames.get(r.offerId) ?? r.offerId },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          variant={
            row.original.status === 'APPROVED'
              ? 'success'
              : row.original.status === 'PENDING'
                ? 'warning'
                : 'destructive'
          }
        >
          {row.original.status}
        </StatusBadge>
      ),
    },
    { id: 'createdAt', header: 'Requested', accessorFn: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Request Access</h1>
      <p className="text-sm text-muted-foreground">
        Track the status of offers you've requested access to. Request access from Browse Offers.
      </p>

      <DataTable columns={columns} data={requests} loading={loading} emptyState="No access requests yet." />
    </div>
  );
}
