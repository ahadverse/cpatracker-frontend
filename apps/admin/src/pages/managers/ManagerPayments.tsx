import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getInvoices, getManagers, markInvoicePaid } from '@cpatracker/mock';
import type { Invoice, Manager } from '@cpatracker/types';
import { DataTable, StatusBadge, toast } from '@cpatracker/ui';

export function ManagerPayments() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [invoiceRows, managerRows] = await Promise.all([getInvoices(undefined, 'MANAGER'), getManagers()]);
    setInvoices(invoiceRows);
    setManagers(managerRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const managerNames = useMemo(() => new Map(managers.map((m) => [m.id, m.name])), [managers]);

  async function handleMarkPaid(invoice: Invoice) {
    await markInvoicePaid(invoice.id);
    toast.success('Invoice marked as paid');
    load();
  }

  const columns: ColumnDef<Invoice>[] = [
    { id: 'manager', header: 'Manager', accessorFn: (invoice) => managerNames.get(invoice.ownerId) ?? invoice.ownerId },
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manager Payments</h1>

      <DataTable columns={columns} data={invoices} loading={loading} emptyState="No manager invoices yet." />
    </div>
  );
}
