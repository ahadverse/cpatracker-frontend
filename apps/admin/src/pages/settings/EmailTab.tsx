import { useEffect, useState } from 'react';
import { getNetworkSettings, updateNetworkSettings } from '@cpatracker/mock';
import type { NetworkSettings } from '@cpatracker/types';
import { Input, toast } from '@cpatracker/ui';

export function EmailTab() {
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
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUser: settings.smtpUser,
        fromEmail: settings.fromEmail,
      });
      setSettings(next);
      toast.success('Email settings saved');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">SMTP host</label>
        <Input value={settings.smtpHost} onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })} />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">SMTP port</label>
        <Input
          type="number"
          value={settings.smtpPort}
          onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">SMTP user</label>
        <Input value={settings.smtpUser} onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })} />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">From email</label>
        <Input
          type="email"
          value={settings.fromEmail}
          onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
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
