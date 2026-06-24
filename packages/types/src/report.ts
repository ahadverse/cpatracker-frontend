import type { SubIds } from './click';

// revenue/profit are optional so the same row type serves the admin report
// builder (populated) and the affiliate/advertiser report builders (omitted) —
// see CLAUDE.md "Money visibility".
export interface PerformanceReportRow {
  groupKey: string;
  clicks: number;
  uniqueClicks: number;
  conversions: number;
  payout: number;
  revenue?: number;
  profit?: number;
  subIds?: Partial<SubIds>;
  crPercent: number;
  epc: number;
}
