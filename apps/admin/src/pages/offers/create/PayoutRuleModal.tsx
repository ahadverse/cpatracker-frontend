import { useEffect, useState } from 'react';
import { getAffiliateGroups, getAffiliates } from '@cpatracker/mock';
import type { Affiliate, AffiliateGroup, PayoutRule } from '@cpatracker/types';
import { Input, Modal, MultiSelect, Select, Toggle } from '@cpatracker/ui';
import {
  DEVICE_OPTIONS,
  GEO_OPTIONS,
  PAYOUT_MODE_OPTIONS,
  PAYOUT_TYPE_OPTIONS,
  REVENUE_MODEL_OPTIONS,
} from './constants';

export type PayoutRuleDraft = Omit<PayoutRule, 'id' | 'offerId'>;

export const EMPTY_PAYOUT_RULE: PayoutRuleDraft = {
  payoutMode: 'CPA',
  payoutType: 'FLAT',
  amount: 0,
  revenueModel: 'RPA',
  revenueAmount: 0,
  targeting: { countries: [], devices: [], affiliateIds: [], affiliateGroupIds: [] },
  managerCommissionPercent: 0,
  referAffiliateCommissionPercent: 0,
  holdSchedule: { enabled: false, days: 7 },
  commissionPercent: 0,
};

export interface PayoutRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: PayoutRuleDraft;
  onSave: (rule: PayoutRuleDraft) => void;
}

export function PayoutRuleModal({ open, onOpenChange, initial, onSave }: PayoutRuleModalProps) {
  const [draft, setDraft] = useState<PayoutRuleDraft>(initial);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [groups, setGroups] = useState<AffiliateGroup[]>([]);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  useEffect(() => {
    getAffiliates().then(setAffiliates);
    getAffiliateGroups().then(setGroups);
  }, []);

  function update<K extends keyof PayoutRuleDraft>(key: K, value: PayoutRuleDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function updateTargeting<K extends keyof PayoutRuleDraft['targeting']>(
    key: K,
    value: PayoutRuleDraft['targeting'][K],
  ) {
    setDraft((d) => ({ ...d, targeting: { ...d.targeting, [key]: value } }));
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Payout Rule" className="max-w-2xl">
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Payout mode</label>
            <Select
              options={PAYOUT_MODE_OPTIONS}
              value={draft.payoutMode}
              onValueChange={(v) => update('payoutMode', v as PayoutRuleDraft['payoutMode'])}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Payout type</label>
            <Select
              options={PAYOUT_TYPE_OPTIONS}
              value={draft.payoutType}
              onValueChange={(v) => update('payoutType', v as PayoutRuleDraft['payoutType'])}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Payout amount</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={draft.amount}
              onChange={(e) => update('amount', Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Revenue model</label>
            <Select
              options={REVENUE_MODEL_OPTIONS}
              value={draft.revenueModel}
              onValueChange={(v) => update('revenueModel', v as PayoutRuleDraft['revenueModel'])}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Revenue amount</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={draft.revenueAmount}
              onChange={(e) => update('revenueAmount', Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Affiliate commission (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={draft.commissionPercent}
              onChange={(e) => update('commissionPercent', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Countries (empty = ALL)</label>
            <MultiSelect
              options={GEO_OPTIONS}
              value={draft.targeting.countries}
              onValueChange={(v) => updateTargeting('countries', v)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Devices (empty = ALL)</label>
            <MultiSelect
              options={DEVICE_OPTIONS}
              value={draft.targeting.devices}
              onValueChange={(v) => updateTargeting('devices', v)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Affiliates (empty = ALL)</label>
            <MultiSelect
              options={affiliates.map((a) => ({ value: a.id, label: a.name }))}
              value={draft.targeting.affiliateIds}
              onValueChange={(v) => updateTargeting('affiliateIds', v)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Affiliate Groups (empty = ALL)</label>
            <MultiSelect
              options={groups.map((g) => ({ value: g.id, label: g.name }))}
              value={draft.targeting.affiliateGroupIds}
              onValueChange={(v) => updateTargeting('affiliateGroupIds', v)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Manager commission (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={draft.managerCommissionPercent}
              onChange={(e) => update('managerCommissionPercent', Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Refer affiliate commission (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={draft.referAffiliateCommissionPercent}
              onChange={(e) => update('referAffiliateCommissionPercent', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Toggle
            checked={draft.holdSchedule.enabled}
            onCheckedChange={(checked) => update('holdSchedule', { ...draft.holdSchedule, enabled: checked })}
            label="Hold schedule"
          />
          {draft.holdSchedule.enabled && (
            <Input
              type="number"
              min="1"
              value={draft.holdSchedule.days}
              onChange={(e) => update('holdSchedule', { ...draft.holdSchedule, days: Number(e.target.value) })}
              className="w-24"
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            onSave(draft);
            onOpenChange(false);
          }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Save payout rule
        </button>
      </div>
    </Modal>
  );
}
