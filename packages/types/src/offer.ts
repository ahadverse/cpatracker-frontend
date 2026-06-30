export type OfferStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAUSED' | 'DELETED';

export type TrafficType =
  | 'BANNER_DISPLAY'
  | 'BRAND_CONTEXT_AD'
  | 'CLICKUNDER_POPUNDER'
  | 'CONTEXT_AD'
  | 'DOORWAYS'
  | 'EMAILING'
  | 'FACEBOOK'
  | 'GOOGLE_MAIL_MARKETING'
  | 'INCENT_TRAFFIC'
  | 'INSTAGRAM'
  | 'MOBILE_TRAFFIC'
  | 'NATIVE'
  | 'NETWORK'
  | 'NEWSLETTER'
  | 'NO_INCENT'
  | 'PPV_POP'
  | 'REBROKERING'
  | 'SEARCH_PPC'
  | 'SEO'
  | 'SMS'
  | 'SOCIAL_MEDIA'
  | 'SOCIAL_NETWORKS_PUBLIC'
  | 'SOCIAL_NETWORKS_TARGETED'
  | 'TEXT_LINKS'
  | 'VIDEO'
  | 'WEB_SITES'
  | 'XXX'
  | 'YOUTUBE';

export type PayoutMode = 'CPA' | 'CPC' | 'CPL' | 'CPI' | 'CPS';
export type PayoutType = 'FLAT' | 'PERCENTAGE';
export type RevenueModel = 'RPA' | 'RPC' | 'NONE';
export type TrackingPlatform = 'DIRECT' | 'AFFISE' | 'HASOFFERS' | 'CAKE' | 'OTHER';

export interface HoldSchedule {
  enabled: boolean;
  days: number;
}

// Empty array on any of these means "ALL" (unrestricted) for that dimension.
export interface PayoutRuleTargeting {
  countries: string[];
  devices: string[];
  affiliateIds: string[];
  affiliateGroupIds: string[];
}

export interface PayoutRule {
  id: string;
  offerId: string;
  payoutMode: PayoutMode;
  payoutType: PayoutType;
  amount: number;
  revenueModel: RevenueModel;
  revenueAmount: number;
  targeting: PayoutRuleTargeting;
  managerCommissionPercent: number;
  referAffiliateCommissionPercent: number;
  holdSchedule: HoldSchedule;
  // Kept distinct from payout/revenue — this is what's shown to affiliates as
  // "your commission" independent of the network's payout/revenue split.
  commissionPercent: number;
}

export type CapPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'OVERALL';
export type CapMetric = 'CLICKS' | 'CONVERSIONS' | 'PAYOUT';

export interface OfferCap {
  id: string;
  period: CapPeriod;
  metric: CapMetric;
  limit: number;
}

export interface Offer {
  id: string;
  advertiserId: string;
  name: string;
  previewLink?: string;
  description?: string;
  kpi?: string;
  category?: string;
  iconUrl?: string;
  startDate?: string;
  endDate?: string;
  currency: string;
  status: OfferStatus;
  trackingLink: string;
  trackingPlatform: TrackingPlatform;
  trafficTypes: TrafficType[];
  featured: boolean;
  networkOfferId?: string;
  autoApproveConversions: boolean;
  allowDeepLinking: boolean;
  remarksForAdmin?: string;
  remarksForAffiliateManager?: string;
  payoutRules: PayoutRule[];
  caps: OfferCap[];
  createdAt: string;
}
