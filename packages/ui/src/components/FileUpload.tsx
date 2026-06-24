import { useId, useState, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({ onFilesSelected, accept, multiple, className }: FileUploadProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    onFilesSelected(Array.from(e.dataTransfer.files));
  }

  return (
    <label
      htmlFor={inputId}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-background p-6 text-center',
        isDragging && 'border-primary bg-accent/40',
        className,
      )}
    >
      <UploadCloud className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Click to upload</span> or drag and drop
      </p>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => onFilesSelected(Array.from(e.target.files ?? []))}
      />
    </label>
  );
}
