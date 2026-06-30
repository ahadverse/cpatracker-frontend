import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAffiliates, getInvoices, markInvoicePaid } from '@cpatracker/mock';
import type { Affiliate, Invoice } from '@cpatracker/types';
import { DataTable, StatusBadge, toast } from '@cpatracker/ui';

export function AffiliatePayments() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [invoiceRows, affiliateRows] = await Promise.all([
      getInvoices(undefined, 'AFFILIATE'),
      getAffiliates(),
    ]);
    setInvoices(invoiceRows);
    setAffiliates(affiliateRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const affiliateNames = useMemo(() => new Map(affiliates.map((a) => [a.id, a.name])), [affiliates]);

  async function handleMarkPaid(invoice: Invoice) {
    await markInvoicePaid(invoice.id);
    toast.success('Invoice marked as paid');
    load();
  }

  const columns: ColumnDef<Invoice>[] = [
    { id: 'affiliate', header: 'Affiliate', accessorFn: (invoice) => affiliateNames.get(invoice.ownerId) ?? invoice.ownerId },
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
      <h1 className="text-2xl font-semibold">Affiliate Payments</h1>

      <DataTable
        columns={columns}
        data={invoices}
        loading={loading}
        emptyState="No affiliate invoices yet."
      />
    </div>
  );
}
