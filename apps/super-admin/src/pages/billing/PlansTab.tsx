import { useEffect, useState } from 'react';
import { createPlan, getPlans, updatePlan } from '@cpatracker/mock';
import type { Plan } from '@cpatracker/types';
import { Input, Modal, Skeleton, toast } from '@cpatracker/ui';

interface PlanForm {
  id: string;
  name: string;
  price: string;
  features: string;
}

const EMPTY_FORM: PlanForm = { id: '', name: '', price: '', features: '' };

export function PlansTab() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<PlanForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setPlans(await getPlans());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setCreating(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function openEdit(plan: Plan) {
    setCreating(false);
    setEditingId(plan.id);
    setForm({ id: plan.id, name: plan.name, price: String(plan.price), features: plan.features.join('\n') });
  }

  function closeModal() {
    setCreating(false);
    setEditingId(null);
  }

  const open = creating || editingId !== null;
  const formValid =
    form.name.trim().length > 0 && Number(form.price) >= 0 && (creating ? form.id.trim().length > 0 : true);

  async function handleSave() {
    if (!formValid) return;
    setSaving(true);
    try {
      const features = form.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);
      if (creating) {
        await createPlan({ id: form.id.trim(), name: form.name.trim(), price: Number(form.price), features });
        toast.success('Plan created');
      } else if (editingId) {
        await updatePlan(editingId, { name: form.name.trim(), price: Number(form.price), features });
        toast.success('Plan updated');
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + New plan
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">{plan.name}</h3>
                <button
                  type="button"
                  onClick={() => openEdit(plan)}
                  className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Edit
                </button>
              </div>
              <p className="mt-1 text-2xl font-semibold text-card-foreground">${plan.price}/mo</p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onOpenChange={(o) => !o && closeModal()} title={creating ? 'New plan' : 'Edit plan'}>
        <div className="space-y-4">
          {creating && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Plan ID</label>
              <Input
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                placeholder="e.g. SCALE"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Plan name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Price (USD/mo)</label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Features (one per line)</label>
            <textarea
              value={form.features}
              onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
              rows={5}
              placeholder="One feature per line"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!formValid || saving}
              onClick={handleSave}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {saving ? 'Saving...' : creating ? 'Create plan' : 'Save changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
