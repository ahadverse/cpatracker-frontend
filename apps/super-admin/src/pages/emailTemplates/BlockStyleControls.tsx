import type { EmailBlock, EmailBlockStyle } from '@cpatracker/types';
import { Select } from '@cpatracker/ui';

type StyleField = keyof EmailBlockStyle;

const FIELDS_BY_TYPE: Record<EmailBlock['type'], StyleField[]> = {
  header: ['backgroundColor', 'textColor', 'fontSize', 'fontWeight', 'align', 'paddingY'],
  text: ['backgroundColor', 'textColor', 'fontSize', 'fontWeight', 'align', 'paddingY'],
  footer: ['backgroundColor', 'textColor', 'fontSize', 'fontWeight', 'align', 'paddingY'],
  button: ['backgroundColor', 'textColor', 'fontSize', 'fontWeight', 'align', 'paddingY'],
  divider: ['backgroundColor', 'paddingY'],
  image: ['backgroundColor', 'align', 'paddingY'],
};

const FONT_SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'base', label: 'Base' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'bold', label: 'Bold' },
];

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const PADDING_Y_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

export interface BlockStyleControlsProps {
  block: EmailBlock;
  onChange: (style: EmailBlockStyle) => void;
}

export function BlockStyleControls({ block, onChange }: BlockStyleControlsProps) {
  const fields = FIELDS_BY_TYPE[block.type];
  const style = block.style ?? {};

  function set<K extends StyleField>(key: K, value: EmailBlockStyle[K]) {
    onChange({ ...style, [key]: value });
  }

  return (
    <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
      {fields.includes('backgroundColor') && (
        <label className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          Background
          <input
            type="color"
            value={style.backgroundColor ?? '#000000'}
            onChange={(e) => set('backgroundColor', e.target.value)}
            className="h-7 w-12 cursor-pointer rounded border border-input bg-background"
          />
        </label>
      )}
      {fields.includes('textColor') && (
        <label className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          Text color
          <input
            type="color"
            value={style.textColor ?? '#000000'}
            onChange={(e) => set('textColor', e.target.value)}
            className="h-7 w-12 cursor-pointer rounded border border-input bg-background"
          />
        </label>
      )}
      {fields.includes('fontSize') && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Font size</span>
          <Select
            options={FONT_SIZE_OPTIONS}
            value={style.fontSize}
            onValueChange={(value) => set('fontSize', value as EmailBlockStyle['fontSize'])}
            placeholder="Base"
          />
        </div>
      )}
      {fields.includes('fontWeight') && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Font weight</span>
          <Select
            options={FONT_WEIGHT_OPTIONS}
            value={style.fontWeight}
            onValueChange={(value) => set('fontWeight', value as EmailBlockStyle['fontWeight'])}
            placeholder="Normal"
          />
        </div>
      )}
      {fields.includes('align') && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Align</span>
          <Select
            options={ALIGN_OPTIONS}
            value={style.align}
            onValueChange={(value) => set('align', value as EmailBlockStyle['align'])}
            placeholder="Left"
          />
        </div>
      )}
      {fields.includes('paddingY') && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Spacing</span>
          <Select
            options={PADDING_Y_OPTIONS}
            value={style.paddingY}
            onValueChange={(value) => set('paddingY', value as EmailBlockStyle['paddingY'])}
            placeholder="None"
          />
        </div>
      )}
    </div>
  );
}
