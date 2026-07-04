import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAdvertisers, getInvoices, markInvoicePaid } from '@cpatracker/mock';
import type { Advertiser, Invoice } from '@cpatracker/types';
import { DataTable, Select, StatCard, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_OPTIONS: { value: Invoice['status']; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
];

export function AdvertisersTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [statusFilter, setStatusFilter] = useState<Invoice['status']>();
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [invoiceRows, advertiserRows] = await Promise.all([
      getInvoices(undefined, 'ADVERTISER'),
      getAdvertisers(),
    ]);
    setInvoices(invoiceRows);
    setAdvertisers(advertiserRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const advertiserNames = useMemo(() => new Map(advertisers.map((a) => [a.id, a.name])), [advertisers]);

  const totals = useMemo(
    () => ({
      pending: invoices.filter((i) => i.status === 'PENDING').reduce((sum, i) => sum + i.amount, 0),
      collected: invoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0),
    }),
    [invoices],
  );

  const filteredInvoices = statusFilter ? invoices.filter((i) => i.status === statusFilter) : invoices;

  async function handleMarkPaid(invoice: Invoice) {
    await markInvoicePaid(invoice.id);
    toast.success('Invoice marked as paid');
    load();
  }

  const columns: ColumnDef<Invoice>[] = [
    { id: 'advertiser', header: 'Advertiser', accessorFn: (invoice) => advertiserNames.get(invoice.ownerId) ?? invoice.ownerId },
    { accessorKey: 'period', header: 'Period' },
    { id: 'amount', header: 'Amount', accessorFn: (invoice) => `$${invoice.amount.toFixed(2)}` },
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
      accessorFn: (invoice) => new Date(invoice.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        if (row.original.status === 'PAID') return null;
        return (
          <button
            type="button"
            onClick={() => handleMarkPaid(row.original)}
            className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Mark as paid
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Revenue Pending" value={`$${totals.pending.toFixed(2)}`} />
        <StatCard label="Revenue Collected" value={`$${totals.collected.toFixed(2)}`} />
      </div>

      <DataTable
        columns={columns}
        data={filteredInvoices}
        loading={loading}
        emptyState="No advertiser invoices match these filters."
        filterBar={
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as Invoice['status'])}
            placeholder="All statuses"
            className="w-44"
          />
        }
      />
    </div>
  );
}
