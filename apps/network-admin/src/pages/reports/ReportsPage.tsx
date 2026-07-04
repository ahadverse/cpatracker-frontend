import type { PerformanceGroupBy } from '@cpatracker/mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cpatracker/ui';
import { PerformanceTab } from './PerformanceTab';
import { ClicksTab } from './ClicksTab';
import { ConversionsTab } from './ConversionsTab';
import { SubIdTrackingTab } from './SubIdTrackingTab';
import { PostbackLogsTab } from './PostbackLogsTab';

const TABS = [
  { value: 'performance', label: 'Performance' },
  { value: 'clicks', label: 'Clicks' },
  { value: 'conversions', label: 'Conversions' },
  { value: 'sub-id-tracking', label: 'Sub-ID Tracking' },
  { value: 'postback-logs', label: 'Postback Logs' },
] as const;

export interface ReportsPageProps {
  title?: string;
  initialTab?: (typeof TABS)[number]['value'];
  performanceGroupBy?: PerformanceGroupBy;
  lockPerformanceGroupBy?: boolean;
  postbackDimension?: 'affiliate' | 'advertiser';
}

export function ReportsPage({
  title = 'Reports',
  initialTab = 'performance',
  performanceGroupBy,
  lockPerformanceGroupBy = false,
  postbackDimension,
}: ReportsPageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <Tabs defaultValue={initialTab}>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="performance">
          <PerformanceTab initialGroupBy={performanceGroupBy} lockGroupBy={lockPerformanceGroupBy} />
        </TabsContent>
        <TabsContent value="clicks">
          <ClicksTab />
        </TabsContent>
        <TabsContent value="conversions">
          <ConversionsTab />
        </TabsContent>
        <TabsContent value="sub-id-tracking">
          <SubIdTrackingTab />
        </TabsContent>
        <TabsContent value="postback-logs">
          <PostbackLogsTab dimension={postbackDimension} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
