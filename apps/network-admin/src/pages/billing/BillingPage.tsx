import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cpatracker/ui';
import { OverviewTab } from './OverviewTab';
import { AffiliatesTab } from './AffiliatesTab';
import { AdvertisersTab } from './AdvertisersTab';
import { ManagersTab } from './ManagersTab';
import { MySubscriptionTab } from './MySubscriptionTab';

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'affiliates', label: 'Affiliates' },
  { value: 'advertisers', label: 'Advertisers' },
  { value: 'managers', label: 'Managers' },
  { value: 'my-subscription', label: 'My Subscription' },
] as const;

export interface BillingPageProps {
  initialTab?: (typeof TABS)[number]['value'];
}

export function BillingPage({ initialTab = 'overview' }: BillingPageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <Tabs defaultValue={initialTab}>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="affiliates">
          <AffiliatesTab />
        </TabsContent>
        <TabsContent value="advertisers">
          <AdvertisersTab />
        </TabsContent>
        <TabsContent value="managers">
          <ManagersTab />
        </TabsContent>
        <TabsContent value="my-subscription">
          <MySubscriptionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
