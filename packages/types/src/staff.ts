export type StaffRole = 'SUPER_ADMIN' | 'OPERATIONS' | 'SUPPORT';

export type StaffStatus = 'ACTIVE' | 'SUSPENDED';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: StaffStatus;
  createdAt: string;
  lastLoginAt: string | null;
}
