import { useEffect, useState } from 'react';
import {
  demoAdvertiser,
  getAdvertiserPlans,
  getAdvertiserSubscription,
  updateAdvertiserSubscriptionPlan,
} from '@cpatracker/mock';
import type { AdvertiserPlan, AdvertiserPlanTier, AdvertiserSubscription } from '@cpatracker/types';
import { Select, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_VARIANT: Record<AdvertiserSubscription['status'], 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  PAST_DUE: 'warning',
  CANCELLED: 'destructive',
};

export function Subscription() {
  const [plans, setPlans] = useState<AdvertiserPlan[]>([]);
  const [subscription, setSubscription] = useState<AdvertiserSubscription>();
  const [selectedPlan, setSelectedPlan] = useState<AdvertiserPlanTier>();
  const [changing, setChanging] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [planRows, subscriptionRow] = await Promise.all([
      getAdvertiserPlans(),
      getAdvertiserSubscription(demoAdvertiser.id),
    ]);
    setPlans(planRows);
    setSubscription(subscriptionRow);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const currentPlan = plans.find((p) => p.id === subscription?.plan);

  async function handleChangePlan() {
    if (!selectedPlan || selectedPlan === subscription?.plan) return;
    setChanging(true);
    try {
      await updateAdvertiserSubscriptionPlan(demoAdvertiser.id, selectedPlan);
      toast.success('Plan updated');
      setSelectedPlan(undefined);
      load();
    } finally {
      setChanging(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Subscription</h1>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : subscription && currentPlan ? (
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
      ) : (
        <p className="text-sm text-muted-foreground">No subscription found.</p>
      )}

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Change Plan</h3>
        <div className="flex items-center gap-3">
          <Select
            options={plans.map((p) => ({ value: p.id, label: `${p.name} — $${p.price}/mo` }))}
            value={selectedPlan}
            onValueChange={(value) => setSelectedPlan(value as AdvertiserPlanTier)}
            placeholder="Select a plan"
            className="w-64"
          />
          <button
            type="button"
            disabled={!selectedPlan || selectedPlan === subscription?.plan || changing}
            onClick={handleChangePlan}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {changing ? 'Updating...' : 'Change plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
