import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdvertiser } from '@cpatracker/mock';
import { Input, toast } from '@cpatracker/ui';

export function CreateAdvertiser() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');

  const valid =
    name.trim().length > 0 && email.trim().length > 0 && company.trim().length > 0 && country.trim().length > 0;

  async function handleSubmit() {
    if (!valid) return;
    setSubmitting(true);
    try {
      await createAdvertiser({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        country: country.trim().toUpperCase(),
      });
      toast.success('Advertiser created');
      navigate('/advertisers/all');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Advertiser</h1>

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
          onClick={handleSubmit}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create advertiser'}
        </button>
      </div>
    </div>
  );
}
