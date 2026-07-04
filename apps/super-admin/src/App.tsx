import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@cpatracker/ui';
import { Shell } from './Shell';
import { Dashboard } from './pages/Dashboard';
import { AllTenants } from './pages/tenants/AllTenants';
import { CreateTenant } from './pages/tenants/CreateTenant';
import { TenantDetail } from './pages/tenants/TenantDetail';
import { Billing } from './pages/Billing';
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

          <Route path="/billing" element={<Billing />} />

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
