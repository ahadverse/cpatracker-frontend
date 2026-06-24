export type Role = 'ADMIN' | 'AFFILIATE' | 'ADVERTISER' | 'MANAGER';

export interface User {
  id: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLoginAt: string | null;
}
