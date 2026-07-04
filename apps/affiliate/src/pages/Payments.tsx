import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { demoAffiliate, getInvoices } from '@cpatracker/mock';
import type { Invoice } from '@cpatracker/types';
import { Chart, DataTable, Select, StatCard, StatusBadge } from '@cpatracker/ui';

const STATUS_OPTIONS: { value: Invoice['status']; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
];

export function Payments() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<Invoice['status']>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoices(demoAffiliate.id, 'AFFILIATE').then((rows) => {
      setInvoices(rows);
      setLoading(false);
    });
  }, []);

  const payable = invoices.filter((i) => i.status === 'PENDING').reduce((sum, i) => sum + i.amount, 0);
  const paid = invoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0);

  const lastPayoutDate = useMemo(() => {
    const paidInvoices = invoices.filter((i) => i.status === 'PAID');
    if (paidInvoices.length === 0) return undefined;
    return paidInvoices.reduce((latest, i) => (i.createdAt > latest ? i.createdAt : latest), paidInvoices[0]!.createdAt);
  }, [invoices]);

  const trendData = useMemo(
    () =>
      [...invoices]
        .sort((a, b) => a.period.localeCompare(b.period))
        .map((i) => ({ period: i.period, amount: i.amount })),
    [invoices],
  );

  const filteredInvoices = statusFilter ? invoices.filter((i) => i.status === statusFilter) : invoices;

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Payable Balance" value={`$${payable.toFixed(2)}`} />
        <StatCard label="Total Paid" value={`$${paid.toFixed(2)}`} />
        <StatCard
          label="Last Payout Date"
          value={lastPayoutDate ? new Date(lastPayoutDate).toLocaleDateString() : '—'}
        />
      </div>

      {trendData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-2 text-lg font-semibold">Payout Trend</h2>
          <Chart type="line" data={trendData} xKey="period" series={[{ key: 'amount', label: 'Payout' }]} height={220} />
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredInvoices}
        loading={loading}
        emptyState="No invoices match these filters."
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
