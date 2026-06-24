import * as RTabs from '@radix-ui/react-tabs';
import { cn } from '../lib/cn';

export const Tabs = RTabs.Root;

export function TabsList({ className, ...props }: RTabs.TabsListProps) {
  return (
    <RTabs.List
      className={cn('inline-flex items-center gap-1 rounded-md bg-secondary p-1', className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: RTabs.TabsTriggerProps) {
  return (
    <RTabs.Trigger
      className={cn(
        'rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors',
        'data-[state=active]:bg-background data-[state=active]:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: RTabs.TabsContentProps) {
  return <RTabs.Content className={cn('mt-3', className)} {...props} />;
}
