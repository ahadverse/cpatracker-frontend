import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { changeTenantPlan, getPlans, getSubscriptions, getTenants } from '@cpatracker/mock';
import type { Plan, Subscription, Tenant } from '@cpatracker/types';
import { DataTable, Select, StatusBadge, toast } from '@cpatracker/ui';

export function SubscriptionsTab() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [subscriptionRows, tenantRows, planRows] = await Promise.all([
      getSubscriptions(),
      getTenants(),
      getPlans(),
    ]);
    setSubscriptions(subscriptionRows);
    setTenants(tenantRows);
    setPlans(planRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const tenantName = useMemo(() => new Map(tenants.map((t) => [t.id, t.companyName])), [tenants]);
  const planOptions = useMemo(() => plans.map((p) => ({ value: p.id, label: p.name })), [plans]);

  async function handleChangePlan(tenantId: string, plan: string) {
    await changeTenantPlan(tenantId, plan);
    toast.success('Plan updated');
    load();
  }

  const columns: ColumnDef<Subscription>[] = [
    { id: 'tenant', header: 'Tenant', accessorFn: (s) => tenantName.get(s.tenantId) ?? s.tenantId },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          variant={
            row.original.status === 'ACTIVE' ? 'success' : row.original.status === 'PAST_DUE' ? 'warning' : 'neutral'
          }
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
    {
      id: 'plan',
      header: 'Plan',
      cell: ({ row }) => (
        <Select
          options={planOptions}
          value={row.original.plan}
          onValueChange={(value) => handleChangePlan(row.original.tenantId, value)}
          className="w-40"
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={subscriptions}
      loading={loading}
      emptyState="No subscriptions."
      pageSize={15}
    />
  );
}
