import { useState } from 'react';
import { createOffer, demoAdvertiser } from '@cpatracker/mock';
import type { TrafficType } from '@cpatracker/types';
import { FileUpload, Modal, toast } from '@cpatracker/ui';
import { EMPTY_PAYOUT_RULE } from './PayoutRuleModal';

export interface ImportOffersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
}

interface ParsedRow {
  name: string;
  amount: number;
  commissionPercent: number;
  trafficTypes: TrafficType[];
}

// Naive CSV parsing (no quoted-comma support) — proportionate to a mock-data
// import feature with no real backend behind it. Expected columns:
// name,payoutAmount,commissionPercent,trafficTypes (semicolon-separated codes)
function parseCsv(text: string): ParsedRow[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const dataLines = lines.slice(1); // skip header row

  return dataLines.map((line) => {
    const [name, amount, commissionPercent, trafficTypes] = line.split(',');
    return {
      name: (name ?? '').trim(),
      amount: Number(amount ?? 0),
      commissionPercent: Number(commissionPercent ?? 0),
      trafficTypes: (trafficTypes ?? '')
        .split(';')
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean) as TrafficType[],
    };
  });
}

export function ImportOffersModal({ open, onOpenChange, onImported }: ImportOffersModalProps) {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    const text = await file.text();
    setRows(parseCsv(text).filter((row) => row.name.length > 0));
  }

  async function handleImport() {
    if (rows.length === 0) return;
    setImporting(true);
    try {
      await Promise.all(
        rows.map((row) => {
          const id = `imported-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          return createOffer({
            id,
            advertiserId: demoAdvertiser.id,
            name: row.name,
            currency: 'USD',
            status: 'PENDING',
            trackingLink: `https://track.cpatracker.dev/click?offer_id=${id}&aff_id={click_id}`,
            trackingPlatform: 'DIRECT',
            trafficTypes: row.trafficTypes.length > 0 ? row.trafficTypes : ['NETWORK'],
            featured: false,
            autoApproveConversions: false,
            allowDeepLinking: true,
            payoutRules: [
              {
                ...EMPTY_PAYOUT_RULE,
                id: `payout-rule-${id}`,
                offerId: id,
                amount: row.amount,
                commissionPercent: row.commissionPercent,
              },
            ],
            caps: [],
          });
        }),
      );
      toast.success(`Submitted ${rows.length} offer(s) for approval`);
      setRows([]);
      onOpenChange(false);
      onImported();
    } finally {
      setImporting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Import offers">
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">
          CSV columns: <code>name,payoutAmount,commissionPercent,trafficTypes</code> (semicolon-separated
          traffic type codes). First row is treated as a header and skipped. Imported offers are submitted as
          pending, same as the form below.
        </p>

        <FileUpload accept=".csv" onFilesSelected={handleFile} />

        {rows.length > 0 && (
          <p className="text-sm text-muted-foreground">{rows.length} offer(s) ready to import.</p>
        )}

        <button
          type="button"
          disabled={rows.length === 0 || importing}
          onClick={handleImport}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {importing ? 'Importing...' : `Import ${rows.length || ''} offer(s)`}
        </button>
      </div>
    </Modal>
  );
}
