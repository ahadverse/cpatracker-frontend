export type InvoiceOwnerRole = 'AFFILIATE' | 'ADVERTISER' | 'MANAGER';
export type InvoiceStatus = 'PAID' | 'PENDING';

export interface InvoiceLineItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  ownerId: string;
  ownerRole: InvoiceOwnerRole;
  period: string;
  amount: number;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  createdAt: string;
}
