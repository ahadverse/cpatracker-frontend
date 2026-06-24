import type { Invoice, InvoiceOwnerRole } from '@cpatracker/types';
import { faker } from '../faker';
import { affiliates } from './affiliates';
import { advertisers } from './advertisers';
import { managers } from './managers';

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
      lineItems: [
        { description: `${period} payout`, amount },
      ],
      createdAt: faker.date.past({ years: 1 }).toISOString(),
    };
  }),
);
