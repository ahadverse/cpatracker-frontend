import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createManager } from '@cpatracker/mock';
import type { ManagerKind } from '@cpatracker/types';
import { Input, Select, toast } from '@cpatracker/ui';

const KIND_OPTIONS: { value: ManagerKind; label: string }[] = [
  { value: 'AFFILIATE_MANAGER', label: 'Affiliate Manager' },
  { value: 'ACCOUNT_MANAGER', label: 'Account Manager' },
  { value: 'GENERAL_MANAGER', label: 'General Manager' },
];

export function CreateManager() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [kind, setKind] = useState<ManagerKind>();

  const valid = name.trim().length > 0 && email.trim().length > 0 && !!kind;

  async function handleSubmit() {
    if (!valid || !kind) return;
    setSubmitting(true);
    try {
      await createManager({ name: name.trim(), email: email.trim(), kind });
      toast.success('Manager created');
      navigate('/managers/affiliate-managers');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Manager</h1>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Role</label>
          <Select options={KIND_OPTIONS} value={kind} onValueChange={(value) => setKind(value as ManagerKind)} />
        </div>

        <button
          type="button"
          disabled={!valid || submitting}
          onClick={handleSubmit}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create manager'}
        </button>
      </div>
    </div>
  );
}
