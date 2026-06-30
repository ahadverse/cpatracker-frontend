import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@cpatracker/ui';
import { Shell } from './Shell';
import { Dashboard } from './pages/Dashboard';
import { ComingSoon } from './pages/ComingSoon';
import { NotFound } from './pages/NotFound';
import { AllOffers } from './pages/offers/AllOffers';
import { CreateOffer } from './pages/offers/CreateOffer';
import { OfferApprovals } from './pages/offers/OfferApprovals';
import { SmartLinks } from './pages/offers/SmartLinks';
import { AllAffiliates } from './pages/affiliates/AllAffiliates';
import { CreateAffiliate } from './pages/affiliates/CreateAffiliate';
import { PendingAffiliates } from './pages/affiliates/PendingAffiliates';
import { AllAdvertisers } from './pages/advertisers/AllAdvertisers';
import { CreateAdvertiser } from './pages/advertisers/CreateAdvertiser';
import { PendingAdvertisers } from './pages/advertisers/PendingAdvertisers';
import { AllManagers } from './pages/managers/AllManagers';
import { CreateManager } from './pages/managers/CreateManager';
import { ReportsPage } from './pages/reports/ReportsPage';
import { Billing } from './pages/Billing';
import { Notifications } from './pages/Notifications';
import { MessagesPage } from './pages/messages/MessagesPage';
import { Logout } from './pages/Logout';
import { Profile } from './pages/Profile';
import { SettingsPage } from './pages/settings/SettingsPage';
import { CrOptimizer } from './pages/CrOptimizer';
import { AffiliatePayments } from './pages/affiliates/AffiliatePayments';
import { AffiliatePoints } from './pages/affiliates/AffiliatePoints';
import { ReferralProgram } from './pages/affiliates/ReferralProgram';
import { AffiliateGroups } from './pages/affiliates/AffiliateGroups';
import { ManagerPayments } from './pages/managers/ManagerPayments';
import { AccessRequests } from './pages/offers/AccessRequests';

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/offers/all" element={<AllOffers />} />
          <Route path="/offers/create" element={<CreateOffer />} />
          <Route path="/offers/approvals" element={<OfferApprovals />} />
          <Route path="/offers/smart-links" element={<SmartLinks />} />
          <Route path="/offers/access-requests" element={<AccessRequests />} />
          <Route path="/offers/cr-optimizer" element={<CrOptimizer title="Offer CR Optimizer" dimension="offer" />} />
          <Route
            path="/offers/affiliate-offer-cr"
            element={
              <ReportsPage
                title="Affiliate + Offer CR"
                initialTab="performance"
                performanceGroupBy="affiliate-offer"
                lockPerformanceGroupBy
              />
            }
          />

          <Route path="/affiliates/all" element={<AllAffiliates />} />
          <Route path="/affiliates/create" element={<CreateAffiliate />} />
          <Route path="/affiliates/pending" element={<PendingAffiliates />} />
          <Route path="/affiliates/messages" element={<MessagesPage title="Affiliate Messages" role="AFFILIATE" />} />
          <Route path="/affiliates/referral-program" element={<ReferralProgram />} />
          <Route path="/affiliates/groups" element={<AffiliateGroups />} />
          <Route
            path="/affiliates/cr-optimizer"
            element={<CrOptimizer title="Affiliate CR Optimizer" dimension="affiliate" />}
          />
          <Route path="/affiliates/payments" element={<AffiliatePayments />} />
          <Route path="/affiliates/points" element={<AffiliatePoints />} />

          <Route path="/advertisers/all" element={<AllAdvertisers />} />
          <Route path="/advertisers/create" element={<CreateAdvertiser />} />
          <Route path="/advertisers/pending" element={<PendingAdvertisers />} />
          <Route
            path="/advertisers/messages"
            element={<MessagesPage title="Advertiser Messages" role="ADVERTISER" />}
          />

          <Route path="/managers/create" element={<CreateManager />} />
          <Route
            path="/managers/affiliate-managers"
            element={<AllManagers title="Affiliate Managers" initialKind="AFFILIATE_MANAGER" />}
          />
          <Route
            path="/managers/account-managers"
            element={<AllManagers title="Account Managers" initialKind="ACCOUNT_MANAGER" />}
          />
          <Route
            path="/managers/general-managers"
            element={<AllManagers title="General Managers" initialKind="GENERAL_MANAGER" />}
          />
          <Route path="/managers/payments" element={<ManagerPayments />} />

          <Route path="/reports/performance" element={<ReportsPage initialTab="performance" />} />
          <Route path="/reports/clicks" element={<ReportsPage initialTab="clicks" />} />
          <Route path="/reports/conversions" element={<ReportsPage initialTab="conversions" />} />
          <Route path="/reports/sub-id-tracking" element={<ReportsPage initialTab="sub-id-tracking" />} />
          <Route path="/reports/postback-logs" element={<ReportsPage initialTab="postback-logs" />} />
          <Route
            path="/reports/offer"
            element={
              <ReportsPage title="Offer Reports" performanceGroupBy="offer" lockPerformanceGroupBy />
            }
          />
          <Route
            path="/reports/affiliate"
            element={
              <ReportsPage title="Affiliate Reports" performanceGroupBy="affiliate" lockPerformanceGroupBy />
            }
          />
          <Route
            path="/reports/advertiser"
            element={
              <ReportsPage title="Advertiser Reports" performanceGroupBy="advertiser" lockPerformanceGroupBy />
            }
          />
          <Route
            path="/reports/conversion"
            element={<ReportsPage title="Conversion Reports" initialTab="conversions" />}
          />
          <Route
            path="/reports/advanced"
            element={
              <ReportsPage
                title="Advanced Reports"
                performanceGroupBy="affiliate-offer"
                lockPerformanceGroupBy
              />
            }
          />
          <Route path="/reports/click-logs" element={<ReportsPage title="Click Logs" initialTab="clicks" />} />
          <Route
            path="/reports/affiliate-postback-logs"
            element={
              <ReportsPage
                title="Affiliate Postback Logs"
                initialTab="postback-logs"
                postbackDimension="affiliate"
              />
            }
          />
          <Route
            path="/reports/advertiser-postback-logs"
            element={
              <ReportsPage
                title="Advertiser Postback Logs"
                initialTab="postback-logs"
                postbackDimension="advertiser"
              />
            }
          />

          <Route path="/billing" element={<Billing />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/marketplace" element={<ComingSoon />} />
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
