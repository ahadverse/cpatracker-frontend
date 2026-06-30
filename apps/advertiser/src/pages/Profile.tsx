import { useEffect, useState } from 'react';
import { changePassword, demoAdvertiser, getOffers, getUser, updateAdvertiserProfile } from '@cpatracker/mock';
import type { User } from '@cpatracker/types';
import { Input, Skeleton, StatCard, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_VARIANT: Record<typeof demoAdvertiser.status, 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  SUSPENDED: 'destructive',
};

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [offerCount, setOfferCount] = useState<number | null>(null);

  const [name, setName] = useState(demoAdvertiser.name);
  const [company, setCompany] = useState(demoAdvertiser.company);
  const [country, setCountry] = useState(demoAdvertiser.country);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    getUser(demoAdvertiser.userId).then((u) => setUser(u ?? null));
    getOffers({ advertiserId: demoAdvertiser.id }).then((offers) => setOfferCount(offers.length));
  }, []);

  const valid = name.trim().length > 0 && company.trim().length > 0 && country.trim().length > 0;

  async function handleSave() {
    if (!valid) return;
    setSaving(true);
    try {
      await updateAdvertiserProfile(demoAdvertiser.id, {
        name: name.trim(),
        company: company.trim(),
        country: country.trim().toUpperCase(),
      });
      toast.success('Profile updated');
    } finally {
      setSaving(false);
    }
  }

  const passwordValid =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  async function handleChangePassword() {
    if (!passwordValid) return;
    setChangingPassword(true);
    try {
      await changePassword(demoAdvertiser.userId, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed');
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-semibold text-secondary-foreground">
          {initials(demoAdvertiser.name)}
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-card-foreground">{demoAdvertiser.name}</h2>
            <StatusBadge variant={STATUS_VARIANT[demoAdvertiser.status]}>{demoAdvertiser.status}</StatusBadge>
          </div>
          {user ? (
            <p className="text-sm text-muted-foreground">{user.email}</p>
          ) : (
            <Skeleton className="h-4 w-40" />
          )}
          <p className="text-xs text-muted-foreground">
            Advertiser ID {demoAdvertiser.id} · Member since{' '}
            {new Date(demoAdvertiser.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Company" value={demoAdvertiser.company} />
        <StatCard label="Active Offers" value={offerCount === null ? '—' : offerCount} />
        <StatCard label="Country" value={demoAdvertiser.country} />
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Account details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Company</label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Country</label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} maxLength={2} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input value={user?.email ?? ''} disabled placeholder="Loading..." />
            <p className="text-xs text-muted-foreground">Contact the network admin to change your email.</p>
          </div>
        </div>

        <button
          type="button"
          disabled={!valid || saving}
          onClick={handleSave}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Security</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Current password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">New password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Confirm new password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          At least 8 characters. {newPassword.length > 0 && newPassword !== confirmPassword && (
            <span className="text-destructive">Passwords don't match.</span>
          )}
        </p>

        <button
          type="button"
          disabled={!passwordValid || changingPassword}
          onClick={handleChangePassword}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {changingPassword ? 'Changing...' : 'Change password'}
        </button>
      </div>
    </div>
  );
}
