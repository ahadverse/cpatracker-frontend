import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getLoginLogs, type LoginLogRow } from '@cpatracker/mock';
import { DataTable, StatusBadge } from '@cpatracker/ui';

export function LoginLogsTab() {
  const [rows, setRows] = useState<LoginLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoginLogs().then((logs) => {
      setRows(logs);
      setLoading(false);
    });
  }, []);

  const columns: ColumnDef<LoginLogRow>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'role', header: 'Role' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={row.original.status === 'ACTIVE' ? 'success' : 'destructive'}>
          {row.original.status}
        </StatusBadge>
      ),
    },
    {
      id: 'lastLoginAt',
      header: 'Last Login',
      accessorFn: (row) => (row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : 'Never'),
    },
  ];

  return (
    <DataTable columns={columns} data={rows} loading={loading} emptyState="No login activity." pageSize={15} />
  );
}
