import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  demoAffiliate,
  getAdvertisers,
  getOfferAccessRequests,
  getOfferCategories,
  getOffers,
  requestOfferAccess,
} from '@cpatracker/mock';
import type { Advertiser, Offer, OfferAccessRequest, TrafficType } from '@cpatracker/types';
import { DataTable, Select, StatusBadge, toast } from '@cpatracker/ui';

const TRAFFIC_TYPE_OPTIONS: { value: TrafficType; label: string }[] = [
  'BANNER_DISPLAY',
  'SOCIAL_MEDIA',
  'SEARCH_PPC',
  'EMAILING',
  'NATIVE',
  'MOBILE_TRAFFIC',
  'INCENT_TRAFFIC',
  'NO_INCENT',
].map((value) => ({ value: value as TrafficType, label: value.replace(/_/g, ' ') }));

export function BrowseOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [requests, setRequests] = useState<OfferAccessRequest[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>();
  const [trafficType, setTrafficType] = useState<TrafficType>();
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [offerRows, advertiserRows, requestRows] = await Promise.all([
      getOffers({ status: 'APPROVED', category, trafficType }),
      getAdvertisers(),
      getOfferAccessRequests(demoAffiliate.id),
    ]);
    setOffers(offerRows);
    setAdvertisers(advertiserRows);
    setRequests(requestRows);
    setLoading(false);
  }

  useEffect(() => {
    getOfferCategories().then(setCategories);
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, trafficType]);

  const advertiserNames = useMemo(() => new Map(advertisers.map((a) => [a.id, a.name])), [advertisers]);
  const requestByOffer = useMemo(() => new Map(requests.map((r) => [r.offerId, r])), [requests]);

  async function handleRequest(offer: Offer) {
    await requestOfferAccess(offer.id, demoAffiliate.id);
    toast.success('Access requested');
    load();
  }

  const columns: ColumnDef<Offer>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'advertiser',
      header: 'Advertiser',
      accessorFn: (offer) => advertiserNames.get(offer.advertiserId) ?? offer.advertiserId,
    },
    { id: 'payout', header: 'Payout', accessorFn: (offer) => `$${(offer.payoutRules[0]?.amount ?? 0).toFixed(2)}` },
    { id: 'trafficTypes', header: 'Traffic Types', accessorFn: (offer) => offer.trafficTypes.map((t) => t.replace(/_/g, ' ')).join(', ') },
    {
      id: 'access',
      header: 'Access',
      cell: ({ row }) => {
        const request = requestByOffer.get(row.original.id);
        if (!request) return null;
        const variant = request.status === 'APPROVED' ? 'success' : request.status === 'PENDING' ? 'warning' : 'destructive';
        return <StatusBadge variant={variant}>{request.status}</StatusBadge>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const request = requestByOffer.get(row.original.id);
        if (!request) {
          return (
            <button
              type="button"
              onClick={() => handleRequest(row.original)}
              className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Request access
            </button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Browse Offers</h1>

      <DataTable
        columns={columns}
        data={offers}
        loading={loading}
        emptyState="No offers available."
        filterBar={
          <div className="flex flex-wrap gap-3">
            <Select
              options={categories.map((c) => ({ value: c, label: c }))}
              value={category}
              onValueChange={setCategory}
              placeholder="All categories"
              className="w-48"
            />
            <Select
              options={TRAFFIC_TYPE_OPTIONS}
              value={trafficType}
              onValueChange={(value) => setTrafficType(value as TrafficType)}
              placeholder="All traffic types"
              className="w-52"
            />
          </div>
        }
      />
    </div>
  );
}
