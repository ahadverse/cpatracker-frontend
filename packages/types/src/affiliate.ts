import type { RegistrationInfo } from './registration';

export type AffiliateStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export interface Affiliate {
  id: string;
  userId: string;
  name: string;
  company?: string;
  country: string;
  status: AffiliateStatus;
  referredBy?: string;
  postbackUrl?: string;
  registration: RegistrationInfo;
  createdAt: string;
}
