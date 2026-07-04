import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { adminTenantId, getPlans, getSubscription, getTenantInvoices } from '@cpatracker/mock';
import type { Plan, Subscription, TenantInvoice } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

const STATUS_VARIANT: Record<Subscription['status'], 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  PAST_DUE: 'warning',
  CANCELLED: 'destructive',
};

export function MySubscriptionTab() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription>();
  const [invoices, setInvoices] = useState<TenantInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [planRows, subscriptionRow, invoiceRows] = await Promise.all([
        getPlans(),
        getSubscription(adminTenantId),
        getTenantInvoices(adminTenantId),
      ]);
      setPlans(planRows);
      setSubscription(subscriptionRow);
      setInvoices(invoiceRows);
      setLoading(false);
    }
    load();
  }, []);

  const currentPlan = plans.find((p) => p.id === subscription?.plan);

  const columns: ColumnDef<TenantInvoice>[] = [
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
    <div className="space-y-4">
      {subscription && currentPlan && (
        <div className="rounded-lg border border-primary/40 bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Current Plan</h3>
            <StatusBadge variant={STATUS_VARIANT[subscription.status]}>{subscription.status}</StatusBadge>
          </div>
          <p className="mt-1 text-2xl font-semibold text-card-foreground">
            {currentPlan.name} — ${currentPlan.price}/mo
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}
          </p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {currentPlan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Subscription Invoices</h2>
        <DataTable columns={columns} data={invoices} loading={loading} emptyState="No subscription invoices yet." />
      </div>
    </div>
  );
}
