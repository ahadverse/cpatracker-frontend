import type { Invoice, InvoiceLineItem, InvoiceOwnerRole } from '@cpatracker/types';
import { faker } from '../faker';
import { affiliates } from './affiliates';
import { advertisers } from './advertisers';
import { managers } from './managers';
import { offers } from './offers';

function periodsFor(): string[] {
  const now = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return d.toISOString().slice(0, 7);
  });
}

const owners: { id: string; role: InvoiceOwnerRole }[] = [
  ...affiliates.map((a) => ({ id: a.id, role: 'AFFILIATE' as const })),
  ...advertisers.map((a) => ({ id: a.id, role: 'ADVERTISER' as const })),
  ...managers.map((m) => ({ id: m.id, role: 'MANAGER' as const })),
];

function advertiserLineItems(advertiserId: string, period: string, amount: number): InvoiceLineItem[] {
  const ownOffers = offers.filter((o) => o.advertiserId === advertiserId);
  if (ownOffers.length === 0) {
    return [{ description: `${period} spend`, amount }];
  }

  const picked = faker.helpers.arrayElements(ownOffers, { min: 1, max: Math.min(4, ownOffers.length) });
  const lineItems: InvoiceLineItem[] = picked.map((offer) => ({
    description: `${offer.name} — ${period}`,
    amount: 0,
    offerId: offer.id,
    offerName: offer.name,
  }));

  // Split the invoice total unevenly across offers, rounding the last item so
  // the line items always sum exactly to the invoice amount.
  let remaining = amount;
  lineItems.forEach((item, i) => {
    if (i === lineItems.length - 1) {
      item.amount = Number(remaining.toFixed(2));
      return;
    }
    const share = Number((remaining * faker.number.float({ min: 0.2, max: 0.6, fractionDigits: 2 })).toFixed(2));
    item.amount = share;
    remaining -= share;
  });

  return lineItems;
}

export const invoices: Invoice[] = owners.flatMap((owner) =>
  periodsFor().map((period, i) => {
    const amount = faker.number.float({ min: 50, max: 5000, fractionDigits: 2 });
    return {
      id: `invoice-${owner.role.toLowerCase()}-${owner.id}-${period}`,
      ownerId: owner.id,
      ownerRole: owner.role,
      period,
      amount,
      status: i === 0 ? 'PENDING' : 'PAID',
      lineItems:
        owner.role === 'ADVERTISER'
          ? advertiserLineItems(owner.id, period, amount)
          : [{ description: `${period} payout`, amount }],
      createdAt: faker.date.past({ years: 1 }).toISOString(),
    };
  }),
);
