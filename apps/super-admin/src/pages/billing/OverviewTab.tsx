import { useEffect, useMemo, useState } from 'react';
import { getPlans, getSubscriptions, getTenantInvoices } from '@cpatracker/mock';
import type { Plan, Subscription, TenantInvoice } from '@cpatracker/types';
import { Chart, Skeleton, StatCard } from '@cpatracker/ui';

export function OverviewTab() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<TenantInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [planRows, subscriptionRows, invoiceRows] = await Promise.all([
        getPlans(),
        getSubscriptions(),
        getTenantInvoices(),
      ]);
      setPlans(planRows);
      setSubscriptions(subscriptionRows);
      setInvoices(invoiceRows);
      setLoading(false);
    }
    load();
  }, []);

  const priceByPlan = useMemo(() => new Map(plans.map((p) => [p.id, p.price])), [plans]);

  const activeCount = subscriptions.filter((s) => s.status === 'ACTIVE').length;
  const mrr = subscriptions
    .filter((s) => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + (priceByPlan.get(s.plan) ?? 0), 0);
  const pendingTotal = invoices.filter((i) => i.status === 'PENDING').reduce((sum, i) => sum + i.amount, 0);
  const paidTotal = invoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0);

  const chartData = useMemo(
    () =>
      plans.map((plan) => ({
        plan: plan.name,
        mrr: Number(
          (subscriptions.filter((s) => s.status === 'ACTIVE' && s.plan === plan.id).length * plan.price).toFixed(2),
        ),
      })),
    [plans, subscriptions],
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="MRR" value={`$${mrr.toFixed(2)}`} />
        <StatCard label="Active Subscriptions" value={activeCount} />
        <StatCard label="Pending Invoices" value={`$${pendingTotal.toFixed(2)}`} />
        <StatCard label="Collected" value={`$${paidTotal.toFixed(2)}`} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-lg font-semibold">MRR by Plan</h2>
        <Chart type="bar" data={chartData} xKey="plan" series={[{ key: 'mrr', label: 'MRR' }]} height={260} />
      </div>
    </div>
  );
}
