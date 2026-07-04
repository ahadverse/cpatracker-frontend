import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getManagers } from '@cpatracker/mock';
import type { Manager, ManagerKind } from '@cpatracker/types';
import { DataTable, DateRangePicker, Select, type DateRange } from '@cpatracker/ui';

const KIND_OPTIONS: { value: ManagerKind; label: string }[] = [
  { value: 'AFFILIATE_MANAGER', label: 'Affiliate Manager' },
  { value: 'ACCOUNT_MANAGER', label: 'Account Manager' },
  { value: 'GENERAL_MANAGER', label: 'General Manager' },
];

const KIND_LABEL: Record<ManagerKind, string> = {
  AFFILIATE_MANAGER: 'Affiliate Manager',
  ACCOUNT_MANAGER: 'Account Manager',
  GENERAL_MANAGER: 'General Manager',
};

export interface AllManagersProps {
  title: string;
  initialKind?: ManagerKind;
}

export function AllManagers({ title, initialKind }: AllManagersProps) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [kind, setKind] = useState<ManagerKind | undefined>(initialKind);
  const [dateRange, setDateRange] = useState<DateRange>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setKind(initialKind);
  }, [initialKind]);

  useEffect(() => {
    setLoading(true);
    getManagers({ kind, dateFrom: dateRange?.from?.toISOString(), dateTo: dateRange?.to?.toISOString() }).then((rows) => {
      setManagers(rows);
      setLoading(false);
    });
  }, [kind, dateRange]);

  const columns: ColumnDef<Manager>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'kind',
      header: 'Role',
      accessorFn: (manager) => KIND_LABEL[manager.kind],
    },
    {
      id: 'createdAt',
      header: 'Joined',
      accessorFn: (manager) => new Date(manager.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <DataTable
        columns={columns}
        data={managers}
        loading={loading} emptyState="No managers match these filters."
        filterBar={
          <div className="flex flex-wrap gap-3">
            <Select
              options={KIND_OPTIONS}
              value={kind}
              onValueChange={(value) => setKind(value as ManagerKind)}
              placeholder="All roles"
              className="w-48"
            />
            <DateRangePicker value={dateRange} onValueChange={setDateRange} />
          </div>
        }
      />
    </div>
  );
}
