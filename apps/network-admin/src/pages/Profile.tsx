import { useState } from 'react';
import { adminUser, changePassword } from '@cpatracker/mock';
import { Input, StatusBadge, toast } from '@cpatracker/ui';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Profile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const passwordValid =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  async function handleChangePassword() {
    if (!passwordValid) return;
    setChangingPassword(true);
    try {
      await changePassword(adminUser.id, newPassword);
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
          {initials('Network Admin User')}
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-card-foreground">Network Admin User</h2>
            <StatusBadge variant={adminUser.status === 'ACTIVE' ? 'success' : 'destructive'}>
              {adminUser.status}
            </StatusBadge>
          </div>
          <p className="text-sm text-muted-foreground">{adminUser.email}</p>
          <p className="text-xs text-muted-foreground">Role: Network Admin</p>
        </div>
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
          At least 8 characters.{' '}
          {newPassword.length > 0 && newPassword !== confirmPassword && (
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
