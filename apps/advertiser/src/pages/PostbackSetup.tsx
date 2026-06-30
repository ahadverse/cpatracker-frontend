import { useState } from 'react';
import { demoAdvertiser, updateAdvertiserPostbackUrl } from '@cpatracker/mock';
import { Input, toast } from '@cpatracker/ui';

export function PostbackSetup() {
  const [url, setUrl] = useState(demoAdvertiser.postbackUrl ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateAdvertiserPostbackUrl(demoAdvertiser.id, url.trim());
      toast.success('Postback URL saved');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Postback Setup</h1>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Conversion postback URL</label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youradserver.com/postback?click_id={click_id}&status={status}"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Available macros: <code>{'{click_id}'}</code>, <code>{'{status}'}</code>, <code>{'{offer_id}'}</code>,{' '}
          <code>{'{revenue}'}</code>
        </p>

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
