const INFO: { label: string; value: string }[] = [
  { label: 'Application', value: 'CPATracker Admin' },
  { label: 'Environment', value: 'Development (mock data)' },
  { label: 'Frontend stack', value: 'React + Vite + TypeScript' },
  { label: 'Data layer', value: 'Mock (USE_MOCK = true)' },
];

export function SystemTab() {
  return (
    <div className="max-w-lg space-y-3 rounded-lg border border-border bg-card p-4">
      {INFO.map((row) => (
        <div key={row.label} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{row.label}</span>
          <span className="font-medium text-card-foreground">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
