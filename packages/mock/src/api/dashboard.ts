import { delay } from '../delay';
import { clicks } from '../data/clicks';
import { conversions } from '../data/conversions';
import { invoices } from '../data/invoices';
import { offers } from '../data/offers';
import { USE_MOCK } from '../config';

export interface NetworkAdminDashboardStats {
  clicks: number;
  conversionsApproved: number;
  conversionsPending: number;
  conversionsRejected: number;
  revenue: number;
  payout: number;
  profit: number;
  pendingInvoices: number;
}

export interface AffiliateDashboardStats {
  clicks: number;
  conversionsApproved: number;
  conversionsPending: number;
  payout: number;
}

export interface AdvertiserDashboardStats {
  clicks: number;
  conversionsApproved: number;
  revenueOwed: number;
}

export async function getNetworkAdminDashboardStats(): Promise<NetworkAdminDashboardStats> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const approved = conversions.filter((c) => c.status === 'APPROVED');
  return {
    clicks: clicks.length,
    conversionsApproved: approved.length,
    conversionsPending: conversions.filter((c) => c.status === 'PENDING').length,
    conversionsRejected: conversions.filter((c) => c.status === 'REJECTED').length,
    revenue: Number(approved.reduce((sum, c) => sum + c.revenue, 0).toFixed(2)),
    payout: Number(approved.reduce((sum, c) => sum + c.payout, 0).toFixed(2)),
    profit: Number(approved.reduce((sum, c) => sum + c.profit, 0).toFixed(2)),
    pendingInvoices: invoices.filter((i) => i.status === 'PENDING').length,
  };
}

export async function getAffiliateDashboardStats(affiliateId: string): Promise<AffiliateDashboardStats> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const own = conversions.filter((c) => c.affiliateId === affiliateId);
  const approved = own.filter((c) => c.status === 'APPROVED');
  return {
    clicks: clicks.filter((c) => c.affiliateId === affiliateId).length,
    conversionsApproved: approved.length,
    conversionsPending: own.filter((c) => c.status === 'PENDING').length,
    payout: Number(approved.reduce((sum, c) => sum + c.payout, 0).toFixed(2)),
  };
}

export async function getAdvertiserDashboardStats(advertiserId: string): Promise<AdvertiserDashboardStats> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const own = conversions.filter((c) => c.advertiserId === advertiserId && c.status === 'APPROVED');
  return {
    clicks: clicks.filter((c) => offers.find((o) => o.id === c.offerId)?.advertiserId === advertiserId).length,
    conversionsApproved: own.length,
    revenueOwed: Number(own.reduce((sum, c) => sum + c.revenue, 0).toFixed(2)),
  };
}
