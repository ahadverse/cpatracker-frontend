// Seed tier ids for the default plans. Plan ids are widened to `string` so the
// super-admin can create additional plans beyond these three.
export type PlanTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE';

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

export interface Subscription {
  tenantId: string;
  plan: string;
  status: SubscriptionStatus;
  nextBillingDate: string;
}

export type TenantInvoiceStatus = 'PAID' | 'PENDING';

export interface TenantInvoice {
  id: string;
  tenantId: string;
  period: string;
  amount: number;
  status: TenantInvoiceStatus;
  createdAt: string;
}
