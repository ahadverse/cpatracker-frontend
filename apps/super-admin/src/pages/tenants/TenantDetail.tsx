import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubscription, getTenant, getTenantInvoices, updateTenantStatus } from '@cpatracker/mock';
import type { Subscription, Tenant, TenantInvoice, TenantStatus } from '@cpatracker/types';
import { Skeleton, StatusBadge, toast } from '@cpatracker/ui';
import { buildImpersonationUrl } from '../../lib/urls';

const STATUS_VARIANT: Record<TenantStatus, 'success' | 'warning' | 'destructive' | 'neutral'> = {
  TRIAL: 'warning',
  ACTIVE: 'success',
  SUSPENDED: 'destructive',
  CANCELLED: 'neutral',
};

export function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<TenantInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    const [tenantRow, subscriptionRow, invoiceRows] = await Promise.all([
      getTenant(id),
      getSubscription(id),
      getTenantInvoices(id),
    ]);
    setTenant(tenantRow ?? null);
    setSubscription(subscriptionRow ?? null);
    setInvoices(invoiceRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status: TenantStatus) {
    if (!id) return;
    setUpdating(true);
    try {
      await updateTenantStatus(id, status);
      toast.success(`Tenant ${status.toLowerCase()}`);
      load();
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Tenant not found</h1>
        <button
          type="button"
          onClick={() => navigate('/tenants/all')}
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to Tenants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{tenant.companyName}</h1>
        <StatusBadge variant={STATUS_VARIANT[tenant.status]}>{tenant.status}</StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Contact</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.contactEmail}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Plan</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.plan}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Joined</p>
          <p className="text-sm font-medium text-card-foreground">{new Date(tenant.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Offers</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.offers}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Affiliates</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.affiliates}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Advertisers</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.advertisers}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Clicks</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.clicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Conversions</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.conversions.toLocaleString()}</p>
        </div>
      </div>

      {subscription && (
        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Subscription</h3>
          <p className="text-sm text-card-foreground">
            Status: <span className="font-medium">{subscription.status}</span> · Next billing:{' '}
            {new Date(subscription.nextBillingDate).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="space-y-2 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Invoices</h3>
        <ul className="divide-y divide-border">
          {invoices.length === 0 && <li className="py-2 text-sm text-muted-foreground">No invoices.</li>}
          {invoices.map((invoice) => (
            <li key={invoice.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-card-foreground">{invoice.period}</span>
              <span className="text-card-foreground">${invoice.amount.toFixed(2)}</span>
              <StatusBadge variant={invoice.status === 'PAID' ? 'success' : 'warning'}>{invoice.status}</StatusBadge>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        {tenant.status === 'ACTIVE' && (
          <button
            type="button"
            onClick={() => window.open(buildImpersonationUrl(tenant), '_blank')}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View as Tenant
          </button>
        )}
        {tenant.status !== 'ACTIVE' && tenant.status !== 'CANCELLED' && (
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStatusChange('ACTIVE')}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Activate
          </button>
        )}
        {tenant.status === 'ACTIVE' && (
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStatusChange('SUSPENDED')}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Suspend
          </button>
        )}
        {tenant.status !== 'CANCELLED' && (
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStatusChange('CANCELLED')}
            className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
