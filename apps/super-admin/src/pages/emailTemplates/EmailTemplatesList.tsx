import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { getEmailTemplates } from '@cpatracker/mock';
import type { EmailTemplate, EmailTriggerEvent } from '@cpatracker/types';
import { DataTable, Skeleton } from '@cpatracker/ui';

const TRIGGER_LABELS: Record<EmailTriggerEvent, string> = {
  WELCOME: 'Welcome',
  TRIAL_ENDING: 'Trial Ending',
  SUSPENDED: 'Suspended',
  CANCELLED: 'Cancelled',
  INVOICE_REMINDER: 'Invoice Reminder',
};

export function EmailTemplatesList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmailTemplates().then((rows) => {
      setTemplates(rows);
      setLoading(false);
    });
  }, []);

  const columns: ColumnDef<EmailTemplate>[] = [
    {
      id: 'trigger',
      header: 'Trigger',
      accessorFn: (template) => TRIGGER_LABELS[template.trigger],
    },
    { accessorKey: 'subject', header: 'Subject' },
    {
      id: 'updatedAt',
      header: 'Last Updated',
      accessorFn: (template) => new Date(template.updatedAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => navigate(`/email-templates/${row.original.trigger}`)}
          className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Edit
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Email Templates</h1>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Email Templates</h1>
      <DataTable columns={columns} data={templates} emptyState="No email templates." />
    </div>
  );
}
