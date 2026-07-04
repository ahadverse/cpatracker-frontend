import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SortableBlockProps {
  id: string;
  label: string;
  onRemove: () => void;
  children: ReactNode;
}

export function SortableBlock({ id, label, onRemove, children }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-2 rounded-lg border border-border bg-card p-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
            className="flex size-6 cursor-grab items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>
          <span className="text-xs font-medium uppercase text-muted-foreground">{label}</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove block"
          className="flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
