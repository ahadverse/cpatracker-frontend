import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cpatracker/ui';
import { PerformanceTab } from './PerformanceTab';
import { ClicksTab } from './ClicksTab';
import { ConversionsTab } from './ConversionsTab';

const TABS = [
  { value: 'performance', label: 'Performance' },
  { value: 'clicks', label: 'Clicks' },
  { value: 'conversions', label: 'Conversions' },
] as const;

export interface ReportsPageProps {
  initialTab?: (typeof TABS)[number]['value'];
}

export function ReportsPage({ initialTab = 'performance' }: ReportsPageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <Tabs defaultValue={initialTab}>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="performance">
          <PerformanceTab />
        </TabsContent>
        <TabsContent value="clicks">
          <ClicksTab />
        </TabsContent>
        <TabsContent value="conversions">
          <ConversionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
