import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { createSmartLink, getOffers, getSmartLinks } from '@cpatracker/mock';
import type { Offer, SmartLink } from '@cpatracker/types';
import { DataTable, MultiSelect, Input, Modal, toast } from '@cpatracker/ui';

export function SmartLinks() {
  const [smartLinks, setSmartLinks] = useState<SmartLink[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [offerIds, setOfferIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const [linkRows, offerRows] = await Promise.all([getSmartLinks(), getOffers()]);
    setSmartLinks(linkRows);
    setOffers(offerRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const offerNames = useMemo(() => new Map(offers.map((o) => [o.id, o.name])), [offers]);
  const offerOptions = offers.map((o) => ({ value: o.id, label: o.name }));

  const valid = name.trim().length > 0 && offerIds.length >= 2;

  async function handleCreate() {
    if (!valid) return;
    setSubmitting(true);
    try {
      await createSmartLink({ name: name.trim(), offerIds });
      toast.success('Smart-link created');
      setModalOpen(false);
      setName('');
      setOfferIds([]);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  const columns: ColumnDef<SmartLink>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'alias', header: 'Alias link' },
    {
      id: 'offers',
      header: 'Offers',
      cell: ({ row }) => row.original.offerIds.map((id) => offerNames.get(id) ?? id).join(', '),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorFn: (link) => new Date(link.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Smart-Links</h1>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          New smart-link
        </button>
      </div>

      <DataTable
        columns={columns}
        data={smartLinks}
        loading={loading} emptyState="No smart-links yet."
      />

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="New smart-link">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Survey Vertical" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Offers (2 or more)</label>
            <MultiSelect options={offerOptions} value={offerIds} onValueChange={setOfferIds} />
          </div>
          <button
            type="button"
            disabled={!valid || submitting}
            onClick={handleCreate}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create smart-link'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
