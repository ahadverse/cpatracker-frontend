import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getPlans, getSubscriptions, getTenantInvoices, getTenants } from '@cpatracker/mock';
import type { Plan, Subscription, Tenant, TenantInvoice } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

export function Billing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invoices, setInvoices] = useState<TenantInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [planRows, subscriptionRows, tenantRows, invoiceRows] = await Promise.all([
      getPlans(),
      getSubscriptions(),
      getTenants(),
      getTenantInvoices(),
    ]);
    setPlans(planRows);
    setSubscriptions(subscriptionRows);
    setTenants(tenantRows);
    setInvoices(invoiceRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const tenantName = (tenantId: string) => tenants.find((t) => t.id === tenantId)?.companyName ?? tenantId;

  const subscriptionColumns: ColumnDef<Subscription>[] = [
    { id: 'tenant', header: 'Tenant', accessorFn: (s) => tenantName(s.tenantId) },
    { accessorKey: 'plan', header: 'Plan' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          variant={row.original.status === 'ACTIVE' ? 'success' : row.original.status === 'PAST_DUE' ? 'warning' : 'neutral'}
        >
          {row.original.status}
        </StatusBadge>
      ),
    },
    {
      id: 'nextBillingDate',
      header: 'Next Billing',
      accessorFn: (s) => new Date(s.nextBillingDate).toLocaleDateString(),
    },
  ];

  const invoiceColumns: ColumnDef<TenantInvoice>[] = [
    { id: 'tenant', header: 'Tenant', accessorFn: (i) => tenantName(i.tenantId) },
    { accessorKey: 'period', header: 'Period' },
    { id: 'amount', header: 'Amount', accessorFn: (i) => `$${i.amount.toFixed(2)}` },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={row.original.status === 'PAID' ? 'success' : 'warning'}>{row.original.status}</StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">{plan.name}</h3>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">${plan.price}/mo</p>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Subscriptions</h2>
        <DataTable columns={subscriptionColumns} data={subscriptions} loading={loading} emptyState="No subscriptions." />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <DataTable columns={invoiceColumns} data={invoices} loading={loading} emptyState="No invoices." />
      </div>
    </div>
  );
}
