import { demoSuperAdmin } from '@cpatracker/mock';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Profile() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-semibold text-secondary-foreground">
          {initials(demoSuperAdmin.name)}
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold text-card-foreground">{demoSuperAdmin.name}</h2>
          <p className="text-sm text-muted-foreground">{demoSuperAdmin.email}</p>
          <p className="text-xs text-muted-foreground">Role: Super Admin</p>
        </div>
      </div>
    </div>
  );
}
