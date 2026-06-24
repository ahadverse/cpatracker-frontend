import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '../lib/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, delta, icon, className }: StatCardProps) {
  const isPositive = (delta ?? 0) >= 0;

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold text-card-foreground">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            'mt-1 flex items-center gap-1 text-xs font-medium',
            isPositive ? 'text-success' : 'text-destructive',
          )}
        >
          {isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
          {Math.abs(delta)}%
        </p>
      )}
    </div>
  );
}
