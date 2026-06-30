export type AffiliateStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export interface Affiliate {
  id: string;
  userId: string;
  name: string;
  company?: string;
  country: string;
  status: AffiliateStatus;
  referredBy?: string;
  points: number;
  postbackUrl?: string;
  createdAt: string;
}
