export type OfferStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAUSED';
export type TrafficType = 'EMAIL' | 'SOCIAL' | 'SEARCH' | 'PUSH' | 'NATIVE' | 'INCENT';

export interface HoldSchedule {
  enabled: boolean;
  days: number;
}

export interface PayoutRule {
  id: string;
  offerId: string;
  geoTargets: string[];
  deviceTargets: string[];
  amount: number;
  dailyCap?: number;
  totalCap?: number;
  holdSchedule: HoldSchedule;
  commissionPercent: number;
}

export interface Offer {
  id: string;
  advertiserId: string;
  name: string;
  status: OfferStatus;
  trackingLink: string;
  trafficTypes: TrafficType[];
  payoutRule: PayoutRule;
  createdAt: string;
}
