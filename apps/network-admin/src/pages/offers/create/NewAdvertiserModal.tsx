import { useState } from 'react';
import { createAdvertiser } from '@cpatracker/mock';
import type { Advertiser } from '@cpatracker/types';
import { Input, Modal, toast } from '@cpatracker/ui';

export interface NewAdvertiserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (advertiser: Advertiser) => void;
}

export function NewAdvertiserModal({ open, onOpenChange, onCreated }: NewAdvertiserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const valid =
    name.trim().length > 0 && email.trim().length > 0 && company.trim().length > 0 && country.trim().length > 0;

  async function handleCreate() {
    if (!valid) return;
    setSubmitting(true);
    try {
      const advertiser = await createAdvertiser({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        country: country.trim().toUpperCase(),
      });
      toast.success('Advertiser created');
      onCreated(advertiser);
      onOpenChange(false);
      setName('');
      setEmail('');
      setCompany('');
      setCountry('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="New advertiser">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Company</label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Country</label>
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. US" maxLength={2} />
        </div>
        <button
          type="button"
          disabled={!valid || submitting}
          onClick={handleCreate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create advertiser'}
        </button>
      </div>
    </Modal>
  );
}
