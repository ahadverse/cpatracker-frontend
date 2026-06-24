export type ManagerKind = 'AFFILIATE_MANAGER' | 'ACCOUNT_MANAGER' | 'GENERAL_MANAGER';

export interface Manager {
  id: string;
  userId: string;
  name: string;
  kind: ManagerKind;
  createdAt: string;
}
