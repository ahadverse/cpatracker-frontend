import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  getAffiliates,
  getOfferAccessRequests,
  getOffers,
  updateOfferAccessRequestStatus,
} from '@cpatracker/mock';
import type { Affiliate, Offer, OfferAccessRequest } from '@cpatracker/types';
import { DataTable, toast } from '@cpatracker/ui';

export function AccessRequests() {
  const [requests, setRequests] = useState<OfferAccessRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [selected, setSelected] = useState<OfferAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [requestRows, offerRows, affiliateRows] = await Promise.all([
      getOfferAccessRequests(),
      getOffers(),
      getAffiliates(),
    ]);
    setRequests(requestRows.filter((r) => r.status === 'PENDING'));
    setOffers(offerRows);
    setAffiliates(affiliateRows);
    setSelected([]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);
  const affiliateNames = useMemo(() => new Map(affiliates.map((a) => [a.id, a.name])), [affiliates]);

  async function decide(status: 'APPROVED' | 'REJECTED') {
    await Promise.all(selected.map((r) => updateOfferAccessRequestStatus(r.id, status)));
    toast.success(`${selected.length} request(s) ${status.toLowerCase()}`);
    load();
  }

  const columns: ColumnDef<OfferAccessRequest>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
      ),
    },
    { id: 'offer', header: 'Offer', accessorFn: (r) => offerNames.get(r.offerId) ?? r.offerId },
    { id: 'affiliate', header: 'Affiliate', accessorFn: (r) => affiliateNames.get(r.affiliateId) ?? r.affiliateId },
    { id: 'createdAt', header: 'Requested', accessorFn: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Offer Access Requests</h1>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => decide('REJECTED')}
            className="rounded-md border border-destructive/50 px-3 py-1.5 text-sm font-medium text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            Reject selected
          </button>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => decide('APPROVED')}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            Approve selected
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        enableRowSelection
        onRowSelectionChange={setSelected}
        loading={loading}
        emptyState="No pending access requests."
      />
    </div>
  );
}
