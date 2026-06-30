import { useEffect, useState } from 'react';
import { getNetworkSettings, updateNetworkSettings } from '@cpatracker/mock';
import type { NetworkSettings } from '@cpatracker/types';
import { Input, toast } from '@cpatracker/ui';

export function NetworkTab() {
  const [settings, setSettings] = useState<NetworkSettings | null>(null);
  const [ipAllowlistText, setIpAllowlistText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNetworkSettings().then((s) => {
      setSettings(s);
      setIpAllowlistText(s.ipAllowlist.join(', '));
    });
  }, []);

  if (!settings) return null;

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const next = await updateNetworkSettings({
        rateLimitPerMinute: settings.rateLimitPerMinute,
        ipAllowlist: ipAllowlistText
          .split(',')
          .map((ip) => ip.trim())
          .filter(Boolean),
      });
      setSettings(next);
      toast.success('Network settings saved');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Rate limit (requests / minute)</label>
        <Input
          type="number"
          min="0"
          value={settings.rateLimitPerMinute}
          onChange={(e) => setSettings({ ...settings, rateLimitPerMinute: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">IP allowlist (comma-separated)</label>
        <Input
          value={ipAllowlistText}
          onChange={(e) => setIpAllowlistText(e.target.value)}
          placeholder="e.g. 203.0.113.1, 203.0.113.2"
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
