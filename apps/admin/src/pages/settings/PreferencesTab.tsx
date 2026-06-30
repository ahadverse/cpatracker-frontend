import { useEffect, useState } from 'react';
import { getNetworkSettings, updateNetworkSettings } from '@cpatracker/mock';
import type { NetworkSettings } from '@cpatracker/types';
import { Input, toast } from '@cpatracker/ui';

export function PreferencesTab() {
  const [settings, setSettings] = useState<NetworkSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNetworkSettings().then(setSettings);
  }, []);

  if (!settings) return null;

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const next = await updateNetworkSettings({
        defaultCurrency: settings.defaultCurrency,
        defaultHoldDays: settings.defaultHoldDays,
        postbackRetryCount: settings.postbackRetryCount,
      });
      setSettings(next);
      toast.success('Preferences saved');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Default currency</label>
        <Input
          value={settings.defaultCurrency}
          onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value.toUpperCase() })}
          maxLength={3}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Default hold days</label>
        <Input
          type="number"
          min="0"
          value={settings.defaultHoldDays}
          onChange={(e) => setSettings({ ...settings, defaultHoldDays: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Postback retry count</label>
        <Input
          type="number"
          min="0"
          value={settings.postbackRetryCount}
          onChange={(e) => setSettings({ ...settings, postbackRetryCount: Number(e.target.value) })}
        />
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  );
}
