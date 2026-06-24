import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker, type DateRange } from 'react-day-picker';
import { CalendarRange } from 'lucide-react';
import { cn } from '../lib/cn';
import 'react-day-picker/style.css';

export interface DateRangePickerProps {
  value?: DateRange;
  onValueChange: (range: DateRange | undefined) => void;
  className?: string;
}

function formatRange(range?: DateRange) {
  if (!range?.from) return 'Pick a date range';
  if (!range.to) return range.from.toLocaleDateString();
  return `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`;
}

export function DateRangePicker({ value, onValueChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            className,
          )}
        >
          <CalendarRange className="size-4 text-muted-foreground" />
          {formatRange(value)}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md"
        >
          <DayPicker
            mode="range"
            selected={value}
            onSelect={onValueChange}
            defaultMonth={value?.from}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
