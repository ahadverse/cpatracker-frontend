export type AdvertiserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export interface Advertiser {
  id: string;
  userId: string;
  name: string;
  company: string;
  country: string;
  status: AdvertiserStatus;
  postbackUrl?: string;
  createdAt: string;
}
