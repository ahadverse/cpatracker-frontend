import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAdvertiser, getInvoices } from '@cpatracker/mock';
import type { Invoice, InvoiceLineItem } from '@cpatracker/types';
import { Chart, DataTable, Drawer, StatCard, StatusBadge } from '@cpatracker/ui';
import { CryptoPaymentModal } from '../components/CryptoPaymentModal';

interface OfferSpend {
  offerId: string;
  offerName: string;
  total: number;
  invoiceCount: number;
}

export function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [breakdownInvoice, setBreakdownInvoice] = useState<Invoice>();
  const [payingInvoice, setPayingInvoice] = useState<Invoice>();

  async function load() {
    setLoading(true);
    setInvoices(await getInvoices(demoAdvertiser.id, 'ADVERTISER'));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(
    () => ({
      owed: invoices.filter((i) => i.status === 'PENDING').reduce((sum, i) => sum + i.amount, 0),
      paid: invoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0),
    }),
    [invoices],
  );

  const offerSpend = useMemo<OfferSpend[]>(() => {
    const byOffer = new Map<string, OfferSpend>();
    for (const invoice of invoices) {
      for (const item of invoice.lineItems) {
        const key = item.offerId ?? 'other';
        const existing = byOffer.get(key);
        if (existing) {
          existing.total += item.amount;
          existing.invoiceCount += 1;
        } else {
          byOffer.set(key, {
            offerId: key,
            offerName: item.offerName ?? 'Other',
            total: item.amount,
            invoiceCount: 1,
          });
        }
      }
    }
    return Array.from(byOffer.values()).sort((a, b) => b.total - a.total);
  }, [invoices]);

  const activeOfferCount = offerSpend.filter((o) => o.offerId !== 'other').length;

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
      id: 'breakdown',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => setBreakdownInvoice(row.original)}
          className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View breakdown
        </button>
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
            onClick={() => setPayingInvoice(row.original)}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Pay now
          </button>
        );
      },
    },
  ];

  const offerColumns: ColumnDef<OfferSpend>[] = [
    { accessorKey: 'offerName', header: 'Offer' },
    { id: 'total', header: 'Total Spend', accessorFn: (o) => `$${o.total.toFixed(2)}` },
    { accessorKey: 'invoiceCount', header: 'Line Items' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Owed" value={`$${totals.owed.toFixed(2)}`} />
        <StatCard label="Total Paid" value={`$${totals.paid.toFixed(2)}`} />
        <StatCard label="Offers Billed" value={activeOfferCount} />
      </div>

      {offerSpend.length > 0 ? (
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-2 text-lg font-semibold">Spend by Offer</h2>
          <Chart
            type="bar"
            data={offerSpend.slice(0, 8)}
            xKey="offerName"
            series={[{ key: 'total', label: 'Spend' }]}
            height={260}
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No offer-linked spend yet.</p>
      )}

      {offerSpend.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Spend Summary</h2>
          <DataTable columns={offerColumns} data={offerSpend} emptyState="No offer spend yet." />
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <DataTable columns={columns} data={invoices} loading={loading} emptyState="No invoices yet." />
      </div>

      <Drawer
        open={!!breakdownInvoice}
        onOpenChange={(open) => !open && setBreakdownInvoice(undefined)}
        title={breakdownInvoice ? `Breakdown — ${breakdownInvoice.period}` : undefined}
      >
        {breakdownInvoice && (
          <ul className="space-y-3">
            {breakdownInvoice.lineItems.map((item: InvoiceLineItem, i) => (
              <li key={i} className="flex items-center justify-between border-b border-border pb-2 text-sm">
                <span className="text-card-foreground">{item.offerName ?? item.description}</span>
                <span className="font-medium text-card-foreground">${item.amount.toFixed(2)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between pt-1 text-sm font-semibold">
              <span>Total</span>
              <span>${breakdownInvoice.amount.toFixed(2)}</span>
            </li>
          </ul>
        )}
      </Drawer>

      <CryptoPaymentModal
        invoice={payingInvoice}
        onOpenChange={(open) => !open && setPayingInvoice(undefined)}
        onPaid={load}
      />
    </div>
  );
}
