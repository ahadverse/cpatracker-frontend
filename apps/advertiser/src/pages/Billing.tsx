import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAdvertiser, getInvoices, markInvoicePaid } from '@cpatracker/mock';
import type { Invoice } from '@cpatracker/types';
import { DataTable, StatusBadge, toast } from '@cpatracker/ui';

export function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setInvoices(await getInvoices(demoAdvertiser.id, 'ADVERTISER'));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePay(invoice: Invoice) {
    await markInvoicePaid(invoice.id);
    toast.success('Invoice paid');
    load();
  }

  const columns: ColumnDef<Invoice>[] = [
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
            onClick={() => handlePay(row.original)}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Pay now
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <DataTable columns={columns} data={invoices} loading={loading} emptyState="No invoices yet." />
    </div>
  );
}
