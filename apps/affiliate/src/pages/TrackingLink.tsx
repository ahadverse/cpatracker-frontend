import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getAdvertisers, getOfferAccessRequests, getOffers } from '@cpatracker/mock';
import type { Advertiser, Offer } from '@cpatracker/types';
import { DataTable, Modal, toast } from '@cpatracker/ui';

export function TrackingLink() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkOffer, setLinkOffer] = useState<Offer | null>(null);

  useEffect(() => {
    Promise.all([getOfferAccessRequests(demoAffiliate.id), getOffers(), getAdvertisers()]).then(
      ([requests, allOffers, advertiserRows]) => {
        const approvedOfferIds = new Set(
          requests.filter((r) => r.status === 'APPROVED').map((r) => r.offerId),
        );
        setOffers(allOffers.filter((o) => approvedOfferIds.has(o.id)));
        setAdvertisers(advertiserRows);
        setLoading(false);
      },
    );
  }, []);

  const advertiserNames = useMemo(() => new Map(advertisers.map((a) => [a.id, a.name])), [advertisers]);
  const trackingLink = linkOffer ? linkOffer.trackingLink.replace('{click_id}', demoAffiliate.id) : '';

  async function copyLink() {
    await navigator.clipboard.writeText(trackingLink);
    toast.success('Link copied');
  }

  const columns: ColumnDef<Offer>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'advertiser',
      header: 'Advertiser',
      accessorFn: (offer) => advertiserNames.get(offer.advertiserId) ?? offer.advertiserId,
    },
    { id: 'payout', header: 'Payout', accessorFn: (offer) => `$${(offer.payoutRules[0]?.amount ?? 0).toFixed(2)}` },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setLinkOffer(row.original)}
          className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Get tracking link
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tracking Link</h1>
      <p className="text-sm text-muted-foreground">
        Offers you have approved access to. Request access to more from Browse Offers.
      </p>

      <DataTable
        columns={columns}
        data={offers}
        loading={loading}
        emptyState="No approved offers yet — request access first."
      />

      <Modal open={!!linkOffer} onOpenChange={(open) => !open && setLinkOffer(null)} title={linkOffer?.name}>
        <div className="space-y-3">
          <p className="break-all rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">
            {trackingLink}
          </p>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Copy link
          </button>
        </div>
      </Modal>
    </div>
  );
}
