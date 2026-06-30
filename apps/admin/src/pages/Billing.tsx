import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getAdvertisers, getAffiliates, getInvoices, getManagers, markInvoicePaid } from '@cpatracker/mock';
import type { Advertiser, Affiliate, Invoice, Manager } from '@cpatracker/types';
import { DataTable, Select, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_OPTIONS: { value: Invoice['status']; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
];

export function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [statusFilter, setStatusFilter] = useState<Invoice['status']>();
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [invoiceRows, affiliateRows, advertiserRows, managerRows] = await Promise.all([
      getInvoices(),
      getAffiliates(),
      getAdvertisers(),
      getManagers(),
    ]);
    setInvoices(invoiceRows);
    setAffiliates(affiliateRows);
    setAdvertisers(advertiserRows);
    setManagers(managerRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const ownerName = useMemo(() => {
    const affiliateNames = new Map(affiliates.map((a) => [a.id, a.name]));
    const advertiserNames = new Map(advertisers.map((a) => [a.id, a.name]));
    const managerNames = new Map(managers.map((m) => [m.id, m.name]));
    return (invoice: Invoice) => {
      const names =
        invoice.ownerRole === 'AFFILIATE'
          ? affiliateNames
          : invoice.ownerRole === 'ADVERTISER'
            ? advertiserNames
            : managerNames;
      return names.get(invoice.ownerId) ?? invoice.ownerId;
    };
  }, [affiliates, advertisers, managers]);

  const filteredInvoices = statusFilter ? invoices.filter((i) => i.status === statusFilter) : invoices;

  async function handleMarkPaid(invoice: Invoice) {
    await markInvoicePaid(invoice.id);
    toast.success('Invoice marked as paid');
    load();
  }

  const columns: ColumnDef<Invoice>[] = [
    { id: 'owner', header: 'Owner', accessorFn: (invoice) => ownerName(invoice) },
    { accessorKey: 'ownerRole', header: 'Role' },
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <DataTable
        columns={columns}
        data={filteredInvoices}
        loading={loading} emptyState="No invoices match these filters."
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
