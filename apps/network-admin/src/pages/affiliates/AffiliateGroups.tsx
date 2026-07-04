import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { createAffiliateGroup, getAffiliateGroups, getAffiliates } from '@cpatracker/mock';
import type { Affiliate, AffiliateGroup } from '@cpatracker/types';
import { DataTable, Input, Modal, MultiSelect, toast } from '@cpatracker/ui';

export function AffiliateGroups() {
  const [groups, setGroups] = useState<AffiliateGroup[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [affiliateIds, setAffiliateIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const [groupRows, affiliateRows] = await Promise.all([getAffiliateGroups(), getAffiliates()]);
    setGroups(groupRows);
    setAffiliates(affiliateRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const affiliateNames = new Map(affiliates.map((a) => [a.id, a.name]));
  const affiliateOptions = affiliates.map((a) => ({ value: a.id, label: a.name }));
  const valid = name.trim().length > 0 && affiliateIds.length > 0;

  async function handleCreate() {
    if (!valid) return;
    setSubmitting(true);
    try {
      await createAffiliateGroup({ name: name.trim(), affiliateIds });
      toast.success('Group created');
      setModalOpen(false);
      setName('');
      setAffiliateIds([]);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  const columns: ColumnDef<AffiliateGroup>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'members',
      header: 'Members',
      cell: ({ row }) => row.original.affiliateIds.map((id) => affiliateNames.get(id) ?? id).join(', '),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Affiliate Groups</h1>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          New group
        </button>
      </div>

      <DataTable columns={columns} data={groups} loading={loading} emptyState="No groups yet." />

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="New affiliate group">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Top Performers" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Affiliates</label>
            <MultiSelect options={affiliateOptions} value={affiliateIds} onValueChange={setAffiliateIds} />
          </div>
          <button
            type="button"
            disabled={!valid || submitting}
            onClick={handleCreate}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create group'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
