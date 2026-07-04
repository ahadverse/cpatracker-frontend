export type TenantStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

export interface TenantUsage {
  offers: number;
  affiliates: number;
  advertisers: number;
  clicks: number;
  conversions: number;
}

export interface Tenant {
  id: string;
  companyName: string;
  contactEmail: string;
  plan: string;
  status: TenantStatus;
  usage: TenantUsage;
  createdAt: string;
}
