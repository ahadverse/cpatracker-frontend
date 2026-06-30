import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getInvoices } from '@cpatracker/mock';
import type { Invoice } from '@cpatracker/types';
import { DataTable, StatCard, StatusBadge } from '@cpatracker/ui';

export function Payments() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoices(demoAffiliate.id, 'AFFILIATE').then((rows) => {
      setInvoices(rows);
      setLoading(false);
    });
  }, []);

  const payable = invoices.filter((i) => i.status === 'PENDING').reduce((sum, i) => sum + i.amount, 0);
  const paid = invoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0);

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
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Payments</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Payable Balance" value={`$${payable.toFixed(2)}`} />
        <StatCard label="Total Paid" value={`$${paid.toFixed(2)}`} />
      </div>

      <DataTable columns={columns} data={invoices} loading={loading} emptyState="No invoices yet." />
    </div>
  );
}
