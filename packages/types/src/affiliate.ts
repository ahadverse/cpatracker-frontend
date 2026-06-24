export interface Affiliate {
  id: string;
  userId: string;
  name: string;
  company?: string;
  country: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  referredBy?: string;
  points: number;
  createdAt: string;
}
