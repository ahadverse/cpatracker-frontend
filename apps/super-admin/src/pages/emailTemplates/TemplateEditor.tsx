import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { getEmailTemplate, updateEmailTemplate } from '@cpatracker/mock';
import type { EmailBlock, EmailBlockStyle, EmailTemplate, EmailTriggerEvent } from '@cpatracker/types';
import { FileUpload, Input, RichText, Skeleton, toast } from '@cpatracker/ui';
import { SortableBlock } from './SortableBlock';
import { BlockStyleControls } from './BlockStyleControls';
import { renderPreviewHtml, SAMPLE_VARIABLES } from './preview';

const TRIGGER_LABELS: Record<EmailTriggerEvent, string> = {
  WELCOME: 'Welcome',
  TRIAL_ENDING: 'Trial Ending',
  SUSPENDED: 'Suspended',
  CANCELLED: 'Cancelled',
  INVOICE_REMINDER: 'Invoice Reminder',
};

const BLOCK_LABELS: Record<EmailBlock['type'], string> = {
  header: 'Header',
  text: 'Text',
  button: 'Button',
  divider: 'Divider',
  footer: 'Footer',
  image: 'Image',
};

function newBlock(type: EmailBlock['type']): EmailBlock {
  const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  switch (type) {
    case 'header':
      return { id, type: 'header', text: 'New heading' };
    case 'text':
      return { id, type: 'text', html: '<p>New paragraph</p>' };
    case 'button':
      return { id, type: 'button', label: 'Click here', url: '{{ctaUrl}}' };
    case 'divider':
      return { id, type: 'divider' };
    case 'footer':
      return { id, type: 'footer', text: 'Footer text' };
    case 'image':
      return { id, type: 'image', src: '', alt: 'Image' };
  }
}

function appendVariable(block: EmailBlock, variable: string): EmailBlock {
  const token = `{{${variable}}}`;
  switch (block.type) {
    case 'header':
      return { ...block, text: `${block.text} ${token}` };
    case 'footer':
      return { ...block, text: `${block.text} ${token}` };
    case 'text':
      return { ...block, html: `${block.html} ${token}` };
    case 'button':
      return { ...block, label: `${block.label} ${token}` };
    case 'image':
      return { ...block, alt: `${block.alt} ${token}` };
    case 'divider':
      return block;
  }
}

export function TemplateEditor() {
  const { trigger } = useParams<{ trigger: EmailTriggerEvent }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [subject, setSubject] = useState('');
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (!trigger) return;
    setLoading(true);
    getEmailTemplate(trigger).then((row) => {
      setTemplate(row ?? null);
      if (row) {
        setSubject(row.subject);
        setBlocks(row.blocks);
      }
      setLoading(false);
    });
  }, [trigger]);

  function addBlock(type: EmailBlock['type']) {
    setBlocks((current) => [...current, newBlock(type)]);
  }

  function removeBlock(id: string) {
    setBlocks((current) => current.filter((b) => b.id !== id));
  }

  function updateBlock(id: string, updater: (block: EmailBlock) => EmailBlock) {
    setBlocks((current) => current.map((b) => (b.id === id ? updater(b) : b)));
  }

  function updateBlockStyle(id: string, style: EmailBlockStyle) {
    setBlocks((current) => current.map((b) => (b.id === id ? { ...b, style } : b)));
  }

  function insertVariable(variable: string) {
    if (!focusedBlockId) {
      toast.error('Click into a block first, then pick a variable to insert it there.');
      return;
    }
    setBlocks((current) => current.map((b) => (b.id === focusedBlockId ? appendVariable(b, variable) : b)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((current) => {
      const oldIndex = current.findIndex((b) => b.id === active.id);
      const newIndex = current.findIndex((b) => b.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  }

  async function handleSave() {
    if (!trigger) return;
    setSaving(true);
    try {
      await updateEmailTemplate(trigger, { subject, blocks });
      toast.success('Template saved');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!template || !trigger) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Template not found</h1>
        <button
          type="button"
          onClick={() => navigate('/email-templates')}
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to Email Templates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{TRIGGER_LABELS[trigger]} email</h1>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save template'}
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Subject</label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr_1fr]">
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border border-border bg-card p-3">
            <h3 className="text-xs font-medium uppercase text-muted-foreground">Add block</h3>
            {(['header', 'text', 'button', 'image', 'divider', 'footer'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="block w-full rounded-md border border-border px-2 py-1.5 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card p-3">
            <h3 className="text-xs font-medium uppercase text-muted-foreground">Variables</h3>
            <p className="text-xs text-muted-foreground">Click a block, then a variable, to insert it.</p>
            {Object.keys(SAMPLE_VARIABLES).map((variable) => (
              <button
                key={variable}
                type="button"
                onClick={() => insertVariable(variable)}
                className="block w-full rounded-md border border-border px-2 py-1.5 text-left font-mono text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {`{{${variable}}}`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.length === 0 && (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No blocks yet — add one from the palette.
                </p>
              )}
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  id={block.id}
                  label={BLOCK_LABELS[block.type]}
                  onRemove={() => removeBlock(block.id)}
                >
                  {block.type === 'header' && (
                    <Input
                      value={block.text}
                      onFocus={() => setFocusedBlockId(block.id)}
                      onChange={(e) => updateBlock(block.id, (b) => (b.type === 'header' ? { ...b, text: e.target.value } : b))}
                    />
                  )}
                  {block.type === 'text' && (
                    <div onFocus={() => setFocusedBlockId(block.id)}>
                      <RichText
                        defaultValue={block.html}
                        onValueChange={(html) => updateBlock(block.id, (b) => (b.type === 'text' ? { ...b, html } : b))}
                      />
                    </div>
                  )}
                  {block.type === 'button' && (
                    <div className="space-y-2">
                      <Input
                        value={block.label}
                        placeholder="Button label"
                        onFocus={() => setFocusedBlockId(block.id)}
                        onChange={(e) =>
                          updateBlock(block.id, (b) => (b.type === 'button' ? { ...b, label: e.target.value } : b))
                        }
                      />
                      <Input
                        value={block.url}
                        placeholder="Button URL"
                        onFocus={() => setFocusedBlockId(block.id)}
                        onChange={(e) =>
                          updateBlock(block.id, (b) => (b.type === 'button' ? { ...b, url: e.target.value } : b))
                        }
                      />
                    </div>
                  )}
                  {block.type === 'footer' && (
                    <Input
                      value={block.text}
                      onFocus={() => setFocusedBlockId(block.id)}
                      onChange={(e) => updateBlock(block.id, (b) => (b.type === 'footer' ? { ...b, text: e.target.value } : b))}
                    />
                  )}
                  {block.type === 'image' && (
                    <div className="space-y-2" onFocus={() => setFocusedBlockId(block.id)}>
                      {block.src && (
                        <img src={block.src} alt={block.alt} className="max-h-32 rounded-md border border-border object-contain" />
                      )}
                      <FileUpload
                        accept="image/*"
                        onFilesSelected={(files) => {
                          const file = files[0];
                          if (!file) return;
                          const src = URL.createObjectURL(file);
                          updateBlock(block.id, (b) => (b.type === 'image' ? { ...b, src } : b));
                        }}
                      />
                      <Input
                        value={block.alt}
                        placeholder="Alt text"
                        onChange={(e) => updateBlock(block.id, (b) => (b.type === 'image' ? { ...b, alt: e.target.value } : b))}
                      />
                    </div>
                  )}
                  <BlockStyleControls block={block} onChange={(style) => updateBlockStyle(block.id, style)} />
                </SortableBlock>
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 text-xs font-medium uppercase text-muted-foreground">Preview</h3>
          <div
            className="rounded-md bg-white p-4"
            dangerouslySetInnerHTML={{ __html: renderPreviewHtml(subject, blocks) }}
          />
        </div>
      </div>
    </div>
  );
}
