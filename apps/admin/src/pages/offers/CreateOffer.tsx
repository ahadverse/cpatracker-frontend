import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { createOffer, createOfferCategory, getAdvertisers, getOfferCategories } from '@cpatracker/mock';
import type { Advertiser, OfferCap, OfferStatus, TrackingPlatform, TrafficType } from '@cpatracker/types';
import { FileUpload, Input, RichText, Select, Toggle, toast } from '@cpatracker/ui';
import {
  CAP_METRIC_OPTIONS,
  CAP_PERIOD_OPTIONS,
  CURRENCY_OPTIONS,
  MACRO_REFERENCE,
  TRACKING_PLATFORM_OPTIONS,
  TRAFFIC_TYPE_OPTIONS,
} from './create/constants';
import { EMPTY_PAYOUT_RULE, PayoutRuleModal, type PayoutRuleDraft } from './create/PayoutRuleModal';
import { NewAdvertiserModal } from './create/NewAdvertiserModal';
import { ImportOffersModal } from './create/ImportOffersModal';

const STATUS_OPTIONS: { value: OfferStatus; label: string }[] = [
  { value: 'APPROVED', label: 'Active' },
  { value: 'PAUSED', label: 'Pause' },
  { value: 'PENDING', label: 'In-Active' },
  { value: 'DELETED', label: 'Deleted' },
];

export function CreateOffer() {
  const navigate = useNavigate();
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Basic details
  const [advertiserId, setAdvertiserId] = useState<string>();
  const [previewLink, setPreviewLink] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [kpi, setKpi] = useState('');
  const [category, setCategory] = useState<string>();
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [status, setStatus] = useState<OfferStatus>('APPROVED');
  const [iconFile, setIconFile] = useState<File>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [trafficTypes, setTrafficTypes] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [networkOfferId, setNetworkOfferId] = useState('');

  // Tracking link section
  const [trackingLink, setTrackingLink] = useState('');
  const [trackingPlatform, setTrackingPlatform] = useState('DIRECT');
  const [showMacros, setShowMacros] = useState(false);

  // Payout settings
  const [payoutRules, setPayoutRules] = useState<PayoutRuleDraft[]>([]);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);

  // Caps
  const [caps, setCaps] = useState<OfferCap[]>([]);

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoApproveConversions, setAutoApproveConversions] = useState(false);
  const [allowDeepLinking, setAllowDeepLinking] = useState(true);

  // Remarks
  const [remarksForAdmin, setRemarksForAdmin] = useState('');
  const [remarksForAffiliateManager, setRemarksForAffiliateManager] = useState('');

  // Modals
  const [newAdvertiserOpen, setNewAdvertiserOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    getAdvertisers().then(setAdvertisers);
    getOfferCategories().then(setCategories);
  }, []);

  const valid = name.trim().length > 0 && !!advertiserId && trafficTypes.length > 0 && payoutRules.length > 0;

  async function handleAddCategory() {
    if (newCategory.trim().length === 0) return;
    const updated = await createOfferCategory(newCategory.trim());
    setCategories(updated);
    setCategory(newCategory.trim());
    setNewCategory('');
    setShowNewCategory(false);
  }

  function openNewRule() {
    setEditingRuleIndex(null);
    setRuleModalOpen(true);
  }

  function openEditRule(index: number) {
    setEditingRuleIndex(index);
    setRuleModalOpen(true);
  }

  function saveRule(rule: PayoutRuleDraft) {
    setPayoutRules((rules) => {
      if (editingRuleIndex === null) return [...rules, rule];
      const next = [...rules];
      next[editingRuleIndex] = rule;
      return next;
    });
  }

  function copyRule(index: number) {
    setPayoutRules((rules) => [...rules, rules[index]!]);
  }

  function removeRule(index: number) {
    setPayoutRules((rules) => rules.filter((_, i) => i !== index));
  }

  function addCap() {
    setCaps((c) => [...c, { id: `cap-${Date.now()}-${c.length}`, period: 'DAILY', metric: 'CONVERSIONS', limit: 0 }]);
  }

  function updateCap(index: number, patch: Partial<OfferCap>) {
    setCaps((c) => c.map((cap, i) => (i === index ? { ...cap, ...patch } : cap)));
  }

  function removeCap(index: number) {
    setCaps((c) => c.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!valid || !advertiserId) return;
    setSubmitting(true);
    try {
      const id = `offer-${Date.now()}`;
      const iconUrl = iconFile ? URL.createObjectURL(iconFile) : undefined;
      await createOffer({
        id,
        advertiserId,
        name: name.trim(),
        previewLink: previewLink.trim() || undefined,
        description: description || undefined,
        kpi: kpi || undefined,
        category,
        iconUrl,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        currency,
        status,
        trackingLink:
          trackingLink.trim() || `https://track.cpatracker.dev/click?offer_id=${id}&aff_id={click_id}`,
        trackingPlatform: trackingPlatform as TrackingPlatform,
        trafficTypes: trafficTypes as TrafficType[],
        featured,
        networkOfferId: networkOfferId.trim() || undefined,
        autoApproveConversions,
        allowDeepLinking,
        remarksForAdmin: remarksForAdmin.trim() || undefined,
        remarksForAffiliateManager: remarksForAffiliateManager.trim() || undefined,
        payoutRules: payoutRules.map((rule, i) => ({ ...rule, id: `payout-rule-${id}-${i}`, offerId: id })),
        caps,
      });
      toast.success('Offer created');
      navigate('/offers/all');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Offer</h1>
        <button
          type="button"
          onClick={() => setImportOpen(true)}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Import Offers
        </button>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Basic Details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Advertiser</label>
            <div className="flex gap-2">
              <Select
                options={advertisers.map((a) => ({ value: a.id, label: a.name }))}
                value={advertiserId}
                onValueChange={setAdvertiserId}
                placeholder="Select offer advertiser"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setNewAdvertiserOpen(true)}
                className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                + New Advertiser
              </button>
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Preview Link</label>
            <Input
              value={previewLink}
              onChange={(e) => setPreviewLink(e.target.value)}
              placeholder="Provide a link to preview the offer's landing page"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Example: My US Offer" />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <RichText onValueChange={setDescription} placeholder="Enter a detailed description for the offer" />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Offer KPI</label>
            <RichText onValueChange={setKpi} placeholder="List any important KPIs for the offer" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Offer Category</label>
            <div className="flex gap-2">
              <Select
                options={categories.map((c) => ({ value: c, label: c }))}
                value={category}
                onValueChange={setCategory}
                placeholder="Choose a category"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setShowNewCategory((s) => !s)}
                className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                + Add Category
              </button>
            </div>
            {showNewCategory && (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Offer Status</label>
            <div className="flex gap-1 rounded-md border border-border p-1">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={
                    status === opt.value
                      ? 'flex-1 rounded-sm bg-accent px-2 py-1 text-xs font-medium text-accent-foreground'
                      : 'flex-1 rounded-sm px-2 py-1 text-xs text-muted-foreground hover:bg-accent/50'
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Icon</label>
            <FileUpload accept="image/*" onFilesSelected={(files) => setIconFile(files[0])} />
            {iconFile && <p className="text-xs text-muted-foreground">Selected: {iconFile.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Currency</label>
            <Select options={CURRENCY_OPTIONS} value={currency} onValueChange={setCurrency} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Traffic Allowed</label>
            <div className="flex max-h-48 flex-wrap gap-3 overflow-y-auto rounded-md border border-border p-3">
              {TRAFFIC_TYPE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={trafficTypes.includes(opt.value)}
                    onChange={(e) =>
                      setTrafficTypes((t) =>
                        e.target.checked ? [...t, opt.value] : t.filter((v) => v !== opt.value),
                      )
                    }
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Toggle checked={featured} onCheckedChange={setFeatured} label="Set as Featured Offer" />
            <p className="mt-1 text-xs text-muted-foreground">
              Featured offers appear in the Featured Offers section of the affiliate dashboard.
            </p>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Advertiser Network Offer ID (Optional)</label>
            <Input value={networkOfferId} onChange={(e) => setNetworkOfferId(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Offer Tracking Link Section</h2>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Offer Tracking Link</label>
          <textarea
            value={trackingLink}
            onChange={(e) => setTrackingLink(e.target.value)}
            placeholder="Paste your tracking link here. Example: https://myoffertrackinglink.com?aff=1112&offer_id=5354&click_id=[click_id]&source=[source]"
            className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Select Partner / Advertiser</label>
          <Select
            options={TRACKING_PLATFORM_OPTIONS}
            value={trackingPlatform}
            onValueChange={setTrackingPlatform}
            className="max-w-sm"
          />
          <p className="text-xs text-muted-foreground">
            Choose your advertiser's tracking software or network name.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowMacros((s) => !s)}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View List of Macros/Tokens
          <ChevronDown className={showMacros ? 'size-4 rotate-180 transition-transform' : 'size-4 transition-transform'} />
        </button>
        {showMacros && (
          <div className="space-y-1 rounded-md bg-secondary p-3 text-sm">
            {MACRO_REFERENCE.map((m) => (
              <p key={m.token}>
                <code className="text-foreground">{m.token}</code>{' '}
                <span className="text-muted-foreground">— {m.description}</span>
              </p>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Offer Payout Settings</h2>

        <div className="space-y-3">
          {payoutRules.map((rule, i) => (
            <div key={i} className="rounded-md border border-border p-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p>
                    Payout Mode: <span className="font-medium text-foreground">{rule.payoutMode}</span> · Payout
                    Type: {rule.payoutType} · Payout: ${rule.amount.toFixed(2)}
                  </p>
                  <p>
                    Revenue Model: <span className="font-medium text-foreground">{rule.revenueModel}</span> ·
                    Revenue: ${rule.revenueAmount.toFixed(2)}
                  </p>
                  <p className="text-muted-foreground">
                    Countries: {rule.targeting.countries.length ? rule.targeting.countries.join(', ') : 'ALL'} ·
                    Devices: {rule.targeting.devices.length ? rule.targeting.devices.join(', ') : 'ALL'}
                  </p>
                  <p className="text-muted-foreground">
                    Manager Commission: {rule.managerCommissionPercent}% · Refer Affiliate Commission:{' '}
                    {rule.referAffiliateCommissionPercent}%
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditRule(i)}
                    className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => copyRule(i)}
                    className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRule(i)}
                    className="rounded-md border border-destructive/50 px-2 py-1 text-xs text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {payoutRules.length === 0 && <p className="text-sm text-muted-foreground">No payout rules yet.</p>}
        </div>

        <button
          type="button"
          onClick={openNewRule}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + Add More Payout
        </button>
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Cap Limit Options</h2>
        <p className="text-sm text-muted-foreground">
          Manage how many conversions, clicks, or payout this offer can accrue using daily, weekly, monthly, or
          overall limits ("capping").
        </p>

        <div className="space-y-2">
          {caps.map((cap, i) => (
            <div key={cap.id} className="flex flex-wrap items-end gap-2">
              <Select
                options={CAP_PERIOD_OPTIONS}
                value={cap.period}
                onValueChange={(v) => updateCap(i, { period: v as OfferCap['period'] })}
                className="w-32"
              />
              <Select
                options={CAP_METRIC_OPTIONS}
                value={cap.metric}
                onValueChange={(v) => updateCap(i, { metric: v as OfferCap['metric'] })}
                className="w-36"
              />
              <Input
                type="number"
                min="0"
                value={cap.limit}
                onChange={(e) => updateCap(i, { limit: Number(e.target.value) })}
                className="w-28"
              />
              <button
                type="button"
                onClick={() => removeCap(i)}
                className="rounded-md border border-destructive/50 px-2 py-1.5 text-xs text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCap}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          + Add New Cap
        </button>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
        >
          Advanced Options
          <ChevronDown className={showAdvanced ? 'size-4 rotate-180 transition-transform' : 'size-4 transition-transform'} />
        </button>
        {showAdvanced && (
          <div className="mt-4 space-y-3">
            <Toggle
              checked={autoApproveConversions}
              onCheckedChange={setAutoApproveConversions}
              label="Auto-approve conversions"
            />
            <Toggle checked={allowDeepLinking} onCheckedChange={setAllowDeepLinking} label="Allow deep linking" />
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Offer Remarks (Optional)</h2>
        <p className="text-sm text-muted-foreground">Just for the reminders — put the offer remarks if any.</p>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Remarks for Admin</label>
          <textarea
            value={remarksForAdmin}
            onChange={(e) => setRemarksForAdmin(e.target.value)}
            className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Remarks for Affiliate Manager</label>
          <textarea
            value={remarksForAffiliateManager}
            onChange={(e) => setRemarksForAffiliateManager(e.target.value)}
            className="h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!valid || submitting}
          onClick={handleSubmit}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Offer'}
        </button>
      </div>

      <PayoutRuleModal
        open={ruleModalOpen}
        onOpenChange={setRuleModalOpen}
        initial={editingRuleIndex !== null ? payoutRules[editingRuleIndex]! : EMPTY_PAYOUT_RULE}
        onSave={saveRule}
      />

      <NewAdvertiserModal
        open={newAdvertiserOpen}
        onOpenChange={setNewAdvertiserOpen}
        onCreated={(advertiser) => {
          setAdvertisers((a) => [...a, advertiser]);
          setAdvertiserId(advertiser.id);
        }}
      />

      <ImportOffersModal
        open={importOpen}
        onOpenChange={setImportOpen}
        advertiserId={advertiserId}
        onImported={() => navigate('/offers/all')}
      />
    </div>
  );
}
