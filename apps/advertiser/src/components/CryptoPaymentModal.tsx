import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { markInvoicePaid } from '@cpatracker/mock';
import type { Invoice } from '@cpatracker/types';
import { Input, Modal, Select, toast } from '@cpatracker/ui';

type CryptoCurrency = 'BTC' | 'ETH' | 'LTC' | 'SOL' | 'USDC' | 'BNB' | 'USDT';

const CURRENCY_OPTIONS: { value: CryptoCurrency; label: string }[] = [
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'LTC', label: 'Litecoin (LTC)' },
  { value: 'SOL', label: 'Solana (SOL)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'BNB', label: 'BNB' },
  { value: 'USDT', label: 'Tether (USDT)' },
];

// Illustrative mock deposit addresses — this is a manual, self-attested payment
// flow (no real chain verification exists anywhere in this repo).
const CRYPTO_ADDRESSES: Record<CryptoCurrency, string> = {
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  LTC: 'ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
  SOL: '5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZBTeHfB8W',
  USDC: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  BNB: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
  USDT: 'TXYZ1Nd6P5rgh8pqmR9F8Nz4bnW3dLQrz9',
};

export interface CryptoPaymentModalProps {
  invoice: Invoice | undefined;
  onOpenChange: (open: boolean) => void;
  onPaid: () => void;
}

export function CryptoPaymentModal({ invoice, onOpenChange, onPaid }: CryptoPaymentModalProps) {
  const [currency, setCurrency] = useState<CryptoCurrency>('USDT');
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    if (!invoice) return;
    setConfirming(true);
    try {
      await markInvoicePaid(invoice.id);
      toast.success('Invoice paid');
      onOpenChange(false);
      onPaid();
    } finally {
      setConfirming(false);
    }
  }

  const address = CRYPTO_ADDRESSES[currency];

  return (
    <Modal open={!!invoice} onOpenChange={onOpenChange} title="Pay with Crypto">
      {invoice && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Currency</label>
            <Select
              options={CURRENCY_OPTIONS}
              value={currency}
              onValueChange={(value) => setCurrency(value as CryptoCurrency)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Amount</label>
            <Input value={`$${invoice.amount.toFixed(2)}`} disabled />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Send to this address</label>
            <Input value={address} readOnly onFocus={(e) => e.target.select()} />
          </div>

          <div className="flex justify-center rounded-md bg-white p-4">
            <QRCodeSVG value={address} size={160} />
          </div>

          <button
            type="button"
            disabled={confirming}
            onClick={handleConfirm}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {confirming ? 'Confirming...' : "I've sent the payment"}
          </button>
        </div>
      )}
    </Modal>
  );
}
