import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  createTenantInvoice,
  getTenantInvoices,
  getTenants,
  markTenantInvoicePaid,
  markTenantInvoiceUnpaid,
} from '@cpatracker/mock';
import type { Tenant, TenantInvoice } from '@cpatracker/types';
import { DataTable, Input, Modal, Select, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
];

export function InvoicesTab() {
  const [invoices, setInvoices] = useState<TenantInvoice[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [statusFilter, setStatusFilter] = useState<TenantInvoice['status']>();
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formTenant, setFormTenant] = useState<string>();
  const [formPeriod, setFormPeriod] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [invoiceRows, tenantRows] = await Promise.all([getTenantInvoices(), getTenants()]);
    setInvoices(invoiceRows);
    setTenants(tenantRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const tenantName = useMemo(() => new Map(tenants.map((t) => [t.id, t.companyName])), [tenants]);
  const tenantOptions = useMemo(() => tenants.map((t) => ({ value: t.id, label: t.companyName })), [tenants]);

  const filtered = statusFilter ? invoices.filter((i) => i.status === statusFilter) : invoices;

  async function handleToggle(invoice: TenantInvoice) {
    if (invoice.status === 'PAID') {
      await markTenantInvoiceUnpaid(invoice.id);
      toast.success('Invoice marked unpaid');
    } else {
      await markTenantInvoicePaid(invoice.id);
      toast.success('Invoice marked paid');
    }
    load();
  }

  const formValid = !!formTenant && formPeriod.trim().length > 0 && Number(formAmount) > 0;

  async function handleCreate() {
    if (!formValid || !formTenant) return;
    setSaving(true);
    try {
      await createTenantInvoice({ tenantId: formTenant, period: formPeriod.trim(), amount: Number(formAmount) });
      toast.success('Invoice created');
      setModalOpen(false);
      setFormTenant(undefined);
      setFormPeriod('');
      setFormAmount('');
      load();
    } finally {
      setSaving(false);
    }
  }

  const columns: ColumnDef<TenantInvoice>[] = [
    { id: 'tenant', header: 'Tenant', accessorFn: (i) => tenantName.get(i.tenantId) ?? i.tenantId },
    { accessorKey: 'period', header: 'Period' },
    { id: 'amount', header: 'Amount', accessorFn: (i) => `$${i.amount.toFixed(2)}` },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={row.original.status === 'PAID' ? 'success' : 'warning'}>
          {row.original.status}
        </StatusBadge>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorFn: (i) => new Date(i.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => handleToggle(row.original)}
          className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {row.original.status === 'PAID' ? 'Mark unpaid' : 'Mark paid'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + New invoice
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyState="No invoices match these filters."
        pageSize={15}
        filterBar={
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as TenantInvoice['status'])}
            placeholder="All statuses"
            className="w-44"
          />
        }
      />

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="New tenant invoice">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Tenant</label>
            <Select
              options={tenantOptions}
              value={formTenant}
              onValueChange={setFormTenant}
              placeholder="Select a tenant"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Period</label>
            <Input value={formPeriod} onChange={(e) => setFormPeriod(e.target.value)} placeholder="YYYY-MM" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Amount (USD)</label>
            <Input
              type="number"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!formValid || saving}
              onClick={handleCreate}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create invoice'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
