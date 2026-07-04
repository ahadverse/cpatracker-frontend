import type { Click, PerformanceReportRow, Role } from '@cpatracker/types';
import { delay } from '../delay';
import { clicks } from '../data/clicks';
import { conversions } from '../data/conversions';
import { offers } from '../data/offers';
import { USE_MOCK } from '../config';

export type PerformanceGroupBy = 'offer' | 'affiliate' | 'advertiser' | 'geo' | 'date' | 'affiliate-offer';

export interface PerformanceQuery {
  groupBy: PerformanceGroupBy;
  role: Role;
  affiliateId?: string;
  advertiserId?: string;
  offerId?: string;
  os?: Click['os'];
  smartLinkId?: string;
  countries?: string[];
  devices?: Click['device'][];
  dateFrom?: string;
  dateTo?: string;
}

function clickMatchesQuery(click: Click, query: PerformanceQuery): boolean {
  if (query.offerId && click.offerId !== query.offerId) return false;
  if (query.os && click.os !== query.os) return false;
  if (query.smartLinkId && click.smartLinkId !== query.smartLinkId) return false;
  if (query.countries?.length && !query.countries.includes(click.geo)) return false;
  if (query.devices?.length && !query.devices.includes(click.device)) return false;
  if (query.dateFrom && click.createdAt < query.dateFrom) return false;
  if (query.dateTo && click.createdAt > query.dateTo) return false;
  return true;
}

function groupKeyForClick(click: (typeof clicks)[number], groupBy: PerformanceGroupBy): string {
  switch (groupBy) {
    case 'offer':
      return click.offerId;
    case 'affiliate':
      return click.affiliateId;
    case 'advertiser':
      return offers.find((o) => o.id === click.offerId)?.advertiserId ?? 'unknown';
    case 'geo':
      return click.geo;
    case 'date':
      return click.createdAt.slice(0, 10);
    case 'affiliate-offer':
      return `${click.affiliateId}::${click.offerId}`;
  }
}

function groupKeyForConversion(
  conversion: (typeof conversions)[number],
  groupBy: PerformanceGroupBy,
): string {
  switch (groupBy) {
    case 'offer':
      return conversion.offerId;
    case 'affiliate':
      return conversion.affiliateId;
    case 'advertiser':
      return conversion.advertiserId;
    case 'geo':
      return clicks.find((c) => c.id === conversion.clickId)?.geo ?? 'unknown';
    case 'date':
      return conversion.createdAt.slice(0, 10);
    case 'affiliate-offer':
      return `${conversion.affiliateId}::${conversion.offerId}`;
  }
}

export async function getPerformanceReport(query: PerformanceQuery): Promise<PerformanceReportRow[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const scopedClicks = clicks.filter((click) => {
    if (query.affiliateId && click.affiliateId !== query.affiliateId) return false;
    if (query.advertiserId && offers.find((o) => o.id === click.offerId)?.advertiserId !== query.advertiserId)
      return false;
    return clickMatchesQuery(click, query);
  });
  const scopedConversions = conversions.filter((conversion) => {
    if (query.affiliateId && conversion.affiliateId !== query.affiliateId) return false;
    if (query.advertiserId && conversion.advertiserId !== query.advertiserId) return false;
    if (query.offerId && conversion.offerId !== query.offerId) return false;
    if (query.dateFrom && conversion.createdAt < query.dateFrom) return false;
    if (query.dateTo && conversion.createdAt > query.dateTo) return false;
    if (query.os || query.smartLinkId || query.countries?.length || query.devices?.length) {
      const click = clicks.find((c) => c.id === conversion.clickId);
      if (!click) return false;
      if (query.os && click.os !== query.os) return false;
      if (query.smartLinkId && click.smartLinkId !== query.smartLinkId) return false;
      if (query.countries?.length && !query.countries.includes(click.geo)) return false;
      if (query.devices?.length && !query.devices.includes(click.device)) return false;
    }
    return true;
  });

  const rows = new Map<string, PerformanceReportRow>();

  function rowFor(groupKey: string): PerformanceReportRow {
    let row = rows.get(groupKey);
    if (!row) {
      row = {
        groupKey,
        clicks: 0,
        uniqueClicks: 0,
        conversions: 0,
        payout: 0,
        revenue: query.role === 'NETWORK_ADMIN' || query.role === 'ADVERTISER' ? 0 : undefined,
        profit: query.role === 'NETWORK_ADMIN' ? 0 : undefined,
        crPercent: 0,
        epc: 0,
      };
      rows.set(groupKey, row);
    }
    return row;
  }

  for (const click of scopedClicks) {
    const row = rowFor(groupKeyForClick(click, query.groupBy));
    row.clicks += 1;
    if (click.isUnique) row.uniqueClicks += 1;
  }

  for (const conversion of scopedConversions) {
    if (conversion.status !== 'APPROVED') continue;
    const row = rowFor(groupKeyForConversion(conversion, query.groupBy));
    row.conversions += 1;
    row.payout += conversion.payout;
    if (query.role === 'NETWORK_ADMIN' || query.role === 'ADVERTISER') {
      row.revenue = (row.revenue ?? 0) + conversion.revenue;
    }
    if (query.role === 'NETWORK_ADMIN') {
      row.profit = (row.profit ?? 0) + conversion.profit;
    }
  }

  for (const row of rows.values()) {
    row.crPercent = row.clicks > 0 ? Number(((row.conversions / row.clicks) * 100).toFixed(2)) : 0;
    row.epc = row.clicks > 0 ? Number((row.payout / row.clicks).toFixed(2)) : 0;
    row.payout = Number(row.payout.toFixed(2));
    if (row.revenue !== undefined) row.revenue = Number(row.revenue.toFixed(2));
    if (row.profit !== undefined) row.profit = Number(row.profit.toFixed(2));
  }

  return Array.from(rows.values()).sort((a, b) => b.clicks - a.clicks);
}
