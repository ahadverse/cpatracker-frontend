import type { CapMetric, CapPeriod, PayoutMode, PayoutType, RevenueModel, TrackingPlatform, TrafficType } from '@cpatracker/types';

export const TRAFFIC_TYPE_LABELS: Record<TrafficType, string> = {
  BANNER_DISPLAY: 'Banner Display',
  BRAND_CONTEXT_AD: 'Brand Context AD',
  CLICKUNDER_POPUNDER: 'ClickUnder/PopUnder',
  CONTEXT_AD: 'Context AD',
  DOORWAYS: 'Doorways',
  EMAILING: 'Emailing',
  FACEBOOK: 'FB',
  GOOGLE_MAIL_MARKETING: 'Google Mail Marketing',
  INCENT_TRAFFIC: 'Incent Traffic',
  INSTAGRAM: 'Instagram',
  MOBILE_TRAFFIC: 'Mobile Traffic',
  NATIVE: 'Native',
  NETWORK: 'Network',
  NEWSLETTER: 'Newsletter',
  NO_INCENT: 'No Incent',
  PPV_POP: 'PPV/Pop',
  REBROKERING: 'Rebrokering',
  SEARCH_PPC: 'Search PPC',
  SEO: 'SEO',
  SMS: 'SMS',
  SOCIAL_MEDIA: 'Social Media',
  SOCIAL_NETWORKS_PUBLIC: 'Social Networks: Publics, Games, Applications',
  SOCIAL_NETWORKS_TARGETED: 'Social Networks: Targeted AD',
  TEXT_LINKS: 'TextLinks',
  VIDEO: 'Video',
  WEB_SITES: 'Web Sites',
  XXX: 'XXX',
  YOUTUBE: 'Youtube',
};

export const TRAFFIC_TYPE_OPTIONS = Object.entries(TRAFFIC_TYPE_LABELS).map(([value, label]) => ({
  value: value as TrafficType,
  label,
}));

export const GEO_OPTIONS = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'BR', 'IN', 'MX', 'IT', 'ES', 'NL'].map((geo) => ({
  value: geo,
  label: geo,
}));

export const DEVICE_OPTIONS = ['DESKTOP', 'MOBILE', 'TABLET'].map((device) => ({ value: device, label: device }));

export const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'].map((c) => ({ value: c, label: c }));

export const PAYOUT_MODE_OPTIONS: { value: PayoutMode; label: string }[] = [
  { value: 'CPA', label: 'CPA — Cost Per Action' },
  { value: 'CPC', label: 'CPC — Cost Per Click' },
  { value: 'CPL', label: 'CPL — Cost Per Lead' },
  { value: 'CPI', label: 'CPI — Cost Per Install' },
  { value: 'CPS', label: 'CPS — Cost Per Sale' },
];

export const PAYOUT_TYPE_OPTIONS: { value: PayoutType; label: string }[] = [
  { value: 'FLAT', label: 'Flat Payout' },
  { value: 'PERCENTAGE', label: 'Percentage' },
];

export const REVENUE_MODEL_OPTIONS: { value: RevenueModel; label: string }[] = [
  { value: 'RPA', label: 'RPA — Revenue Per Action' },
  { value: 'RPC', label: 'RPC — Revenue Per Click' },
  { value: 'NONE', label: 'None' },
];

export const TRACKING_PLATFORM_OPTIONS: { value: TrackingPlatform; label: string }[] = [
  { value: 'DIRECT', label: 'Direct' },
  { value: 'AFFISE', label: 'Affise' },
  { value: 'HASOFFERS', label: 'HasOffers' },
  { value: 'CAKE', label: 'Cake' },
  { value: 'OTHER', label: 'Other' },
];

export const CAP_PERIOD_OPTIONS: { value: CapPeriod; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'OVERALL', label: 'Overall' },
];

export const CAP_METRIC_OPTIONS: { value: CapMetric; label: string }[] = [
  { value: 'CLICKS', label: 'Clicks' },
  { value: 'CONVERSIONS', label: 'Conversions' },
  { value: 'PAYOUT', label: 'Payout' },
];

export const MACRO_REFERENCE = [
  { token: '{click_id}', description: 'Unique click identifier' },
  { token: '{offer_id}', description: 'This offer\'s ID' },
  { token: '{aff_id}', description: 'Affiliate ID' },
  { token: '{payout}', description: 'Payout amount for the conversion' },
  { token: '{sub1}..{sub8}', description: 'Affiliate sub-ID passthrough (S1-S8)' },
];
