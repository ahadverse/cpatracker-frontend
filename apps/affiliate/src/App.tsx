import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@cpatracker/ui';
import { Shell } from './Shell';
import { Dashboard } from './pages/Dashboard';
import { BrowseOffers } from './pages/BrowseOffers';
import { RequestAccess } from './pages/RequestAccess';
import { TrackingLink } from './pages/TrackingLink';
import { SmartLinks } from './pages/SmartLinks';
import { ReportsPage } from './pages/reports/ReportsPage';
import { NotFound } from './pages/NotFound';
import { Payments } from './pages/Payments';
import { Messages } from './pages/Messages';
import { Referral } from './pages/Referral';
import { Profile } from './pages/Profile';
import { PostbackSetup } from './pages/PostbackSetup';
import { Logout } from './pages/Logout';

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/offers/browse" element={<BrowseOffers />} />
          <Route path="/offers/request-access" element={<RequestAccess />} />
          <Route path="/offers/tracking-link" element={<TrackingLink />} />
          <Route path="/offers/smart-links" element={<SmartLinks />} />

          <Route path="/reports/performance" element={<ReportsPage initialTab="performance" />} />
          <Route path="/reports/clicks" element={<ReportsPage initialTab="clicks" />} />
          <Route path="/reports/conversions" element={<ReportsPage initialTab="conversions" />} />
          <Route path="/reports/sub-id-tracking" element={<ReportsPage initialTab="sub-id-tracking" />} />
          <Route path="/reports/postback-logs" element={<ReportsPage initialTab="postback-logs" />} />

          <Route path="/payments" element={<Payments />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/postback-setup" element={<PostbackSetup />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
