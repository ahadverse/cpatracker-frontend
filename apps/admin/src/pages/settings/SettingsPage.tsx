import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cpatracker/ui';
import { PreferencesTab } from './PreferencesTab';
import { NetworkTab } from './NetworkTab';
import { EmailTab } from './EmailTab';
import { SystemTab } from './SystemTab';
import { LoginLogsTab } from './LoginLogsTab';
import { NetworkUsageTab } from './NetworkUsageTab';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Tabs defaultValue="preferences">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="login-logs">Login Logs</TabsTrigger>
          <TabsTrigger value="network-usage">Network Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
        <TabsContent value="network">
          <NetworkTab />
        </TabsContent>
        <TabsContent value="email">
          <EmailTab />
        </TabsContent>
        <TabsContent value="system">
          <SystemTab />
        </TabsContent>
        <TabsContent value="login-logs">
          <LoginLogsTab />
        </TabsContent>
        <TabsContent value="network-usage">
          <NetworkUsageTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
