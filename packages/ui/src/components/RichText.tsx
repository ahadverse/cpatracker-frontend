import { useRef } from 'react';
import { Bold, Italic, List } from 'lucide-react';
import { cn } from '../lib/cn';

export interface RichTextProps {
  defaultValue?: string;
  onValueChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

// Lightweight contentEditable + execCommand toolbar — proportionate to a Stage 1
// primitive. Upgrade to a real editor library (Tiptap, etc.) if a screen later
// needs more than bold/italic/lists.
//
// Deliberately uncontrolled: contentEditable + a controlled `value` synced via
// dangerouslySetInnerHTML on every render resets the cursor to the start on each
// keystroke. `defaultValue` (set once) + onValueChange (read-only notification)
// avoids that class of bug entirely.
export function RichText({ defaultValue, onValueChange, placeholder, className }: RichTextProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  function exec(command: string) {
    editorRef.current?.focus();
    document.execCommand(command);
    if (editorRef.current) onValueChange(editorRef.current.innerHTML);
  }

  return (
    <div className={cn('rounded-md border border-input bg-background', className)}>
      <div className="flex gap-1 border-b border-border p-1">
        <button
          type="button"
          onClick={() => exec('bold')}
          className="flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Bold"
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Italic"
        >
          <Italic className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className="flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Bulleted list"
        >
          <List className="size-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline
        data-placeholder={placeholder}
        onInput={(e) => onValueChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: defaultValue ?? '' }}
        className={cn(
          'min-h-24 px-3 py-2 text-sm text-foreground outline-none',
          'empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
        )}
      />
    </div>
  );
}
