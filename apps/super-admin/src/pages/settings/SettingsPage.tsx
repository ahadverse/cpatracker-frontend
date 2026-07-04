import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cpatracker/ui';
import { StaffTab } from './StaffTab';
import { RolesReferenceTab } from './RolesReferenceTab';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Tabs defaultValue="staff">
        <TabsList>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <StaffTab />
        </TabsContent>
        <TabsContent value="roles">
          <RolesReferenceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
