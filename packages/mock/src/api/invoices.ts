import type { Invoice, InvoiceOwnerRole } from '@cpatracker/types';
import { delay } from '../delay';
import { invoices } from '../data/invoices';
import { USE_MOCK } from '../config';

export async function getInvoices(ownerId?: string, ownerRole?: InvoiceOwnerRole): Promise<Invoice[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return invoices.filter((invoice) => {
    if (ownerId && invoice.ownerId !== ownerId) return false;
    if (ownerRole && invoice.ownerRole !== ownerRole) return false;
    return true;
  });
}

export async function markInvoicePaid(id: string): Promise<Invoice> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const invoice = invoices.find((i) => i.id === id);
  if (!invoice) throw new Error(`Invoice ${id} not found`);
  invoice.status = 'PAID';
  return invoice;
}
