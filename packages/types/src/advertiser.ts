export interface Advertiser {
  id: string;
  userId: string;
  name: string;
  company: string;
  country: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt: string;
}
