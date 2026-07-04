import type { SubIds } from './click';

export type ConversionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Money visibility is locked at the type level: each role-scoped type below only
// carries the money fields that role is allowed to see (CLAUDE.md "Money
// visibility"). A screen consuming AffiliateConversion literally cannot reference
// `.revenue` — the property doesn't exist on that type.
export interface ConversionBase {
  id: string;
  clickId: string;
  offerId: string;
  affiliateId: string;
  advertiserId: string;
  goal: string;
  txnId?: string;
  status: ConversionStatus;
  subIds: SubIds;
  createdAt: string;
}

export interface NetworkAdminConversion extends ConversionBase {
  revenue: number;
  payout: number;
  profit: number;
}

export interface AffiliateConversion extends ConversionBase {
  payout: number;
}

export interface AdvertiserConversion extends ConversionBase {
  revenue: number;
}
