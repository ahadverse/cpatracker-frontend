import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@cpatracker/ui';
import { Shell } from './Shell';
import { Dashboard } from './pages/Dashboard';
import { AllOffers } from './pages/offers/AllOffers';
import { CreateOffer } from './pages/offers/CreateOffer';
import { Performance } from './pages/Performance';
import { Conversions } from './pages/Conversions';
import { Billing } from './pages/Billing';
import { Subscription } from './pages/Subscription';
import { NotFound } from './pages/NotFound';
import { PostbackSetup } from './pages/PostbackSetup';
import { Messages } from './pages/Messages';
import { News } from './pages/News';
import { Profile } from './pages/Profile';
import { Logout } from './pages/Logout';

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/offers" element={<AllOffers />} />
          <Route path="/offers/create" element={<CreateOffer />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/conversions" element={<Conversions />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/postback-setup" element={<PostbackSetup />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/news" element={<News />} />
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
