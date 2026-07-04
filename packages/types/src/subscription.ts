export type PlanTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE';

export interface Plan {
  id: PlanTier;
  name: string;
  price: number;
  features: string[];
}

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

export interface Subscription {
  tenantId: string;
  plan: PlanTier;
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
