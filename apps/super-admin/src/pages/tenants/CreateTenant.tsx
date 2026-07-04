import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTenant, getPlans } from '@cpatracker/mock';
import type { Plan } from '@cpatracker/types';
import { Input, Select, toast } from '@cpatracker/ui';

export function CreateTenant() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);

  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [plan, setPlan] = useState<string>();

  useEffect(() => {
    getPlans().then(setPlans);
  }, []);

  const planOptions = plans.map((p) => ({ value: p.id, label: p.name }));

  const valid = companyName.trim().length > 0 && contactEmail.trim().length > 0 && !!plan;

  async function handleSubmit() {
    if (!valid || !plan) return;
    setSubmitting(true);
    try {
      await createTenant({ companyName: companyName.trim(), contactEmail: contactEmail.trim(), plan });
      toast.success('Tenant created');
      navigate('/tenants/all');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Tenant</h1>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Company name</label>
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Contact email</label>
          <Input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Plan</label>
          <Select
            options={planOptions}
            value={plan}
            onValueChange={setPlan}
            placeholder="Select a plan"
          />
        </div>

        <button
          type="button"
          disabled={!valid || submitting}
          onClick={handleSubmit}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create tenant'}
        </button>
      </div>
    </div>
  );
}
