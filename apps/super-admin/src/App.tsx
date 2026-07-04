import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@cpatracker/ui';
import { Shell } from './Shell';
import { Dashboard } from './pages/Dashboard';
import { AllTenants } from './pages/tenants/AllTenants';
import { CreateTenant } from './pages/tenants/CreateTenant';
import { TenantDetail } from './pages/tenants/TenantDetail';
import { ReportsPage } from './pages/reports/ReportsPage';
import { BillingPage } from './pages/billing/BillingPage';
import { EmailTemplatesList } from './pages/emailTemplates/EmailTemplatesList';
import { TemplateEditor } from './pages/emailTemplates/TemplateEditor';
import { NewsList } from './pages/news/NewsList';
import { NewsEditor } from './pages/news/NewsEditor';
import { SettingsPage } from './pages/settings/SettingsPage';
import { NotFound } from './pages/NotFound';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Logout } from './pages/Logout';

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/tenants/all" element={<AllTenants />} />
          <Route path="/tenants/create" element={<CreateTenant />} />
          <Route path="/tenants/:id" element={<TenantDetail />} />

          <Route path="/billing" element={<BillingPage />} />

          <Route path="/reports/performance" element={<ReportsPage initialTab="performance" />} />
          <Route path="/reports/clicks" element={<ReportsPage initialTab="clicks" />} />
          <Route path="/reports/conversions" element={<ReportsPage initialTab="conversions" />} />
          <Route path="/reports/sub-id-tracking" element={<ReportsPage initialTab="sub-id-tracking" />} />
          <Route path="/reports/postback-logs" element={<ReportsPage initialTab="postback-logs" />} />
          <Route
            path="/reports/offer"
            element={<ReportsPage title="Offer Reports" performanceGroupBy="offer" lockPerformanceGroupBy />}
          />
          <Route
            path="/reports/affiliate"
            element={<ReportsPage title="Affiliate Reports" performanceGroupBy="affiliate" lockPerformanceGroupBy />}
          />
          <Route
            path="/reports/advertiser"
            element={<ReportsPage title="Advertiser Reports" performanceGroupBy="advertiser" lockPerformanceGroupBy />}
          />
          <Route
            path="/reports/conversion"
            element={<ReportsPage title="Conversion Reports" initialTab="conversions" />}
          />
          <Route
            path="/reports/advanced"
            element={<ReportsPage title="Advanced Reports" performanceGroupBy="affiliate-offer" lockPerformanceGroupBy />}
          />
          <Route path="/reports/click-logs" element={<ReportsPage title="Click Logs" initialTab="clicks" />} />
          <Route
            path="/reports/affiliate-postback-logs"
            element={<ReportsPage title="Affiliate Postback Logs" initialTab="postback-logs" postbackDimension="affiliate" />}
          />
          <Route
            path="/reports/advertiser-postback-logs"
            element={<ReportsPage title="Advertiser Postback Logs" initialTab="postback-logs" postbackDimension="advertiser" />}
          />

          <Route path="/email-templates" element={<EmailTemplatesList />} />
          <Route path="/email-templates/:trigger" element={<TemplateEditor />} />

          <Route path="/news" element={<NewsList />} />
          <Route path="/news/create" element={<NewsEditor />} />
          <Route path="/news/:id" element={<NewsEditor />} />

          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
