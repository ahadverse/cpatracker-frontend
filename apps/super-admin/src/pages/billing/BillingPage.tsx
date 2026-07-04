import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cpatracker/ui';
import { OverviewTab } from './OverviewTab';
import { SubscriptionsTab } from './SubscriptionsTab';
import { InvoicesTab } from './InvoicesTab';
import { PlansTab } from './PlansTab';

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'invoices', label: 'Invoices' },
  { value: 'plans', label: 'Plans' },
] as const;

export function BillingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <Tabs defaultValue="overview">
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
        <TabsContent value="subscriptions">
          <SubscriptionsTab />
        </TabsContent>
        <TabsContent value="invoices">
          <InvoicesTab />
        </TabsContent>
        <TabsContent value="plans">
          <PlansTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
