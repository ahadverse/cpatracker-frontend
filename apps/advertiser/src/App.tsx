import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@cpatracker/ui';
import { Shell } from './Shell';
import { Dashboard } from './pages/Dashboard';
import { AllOffers } from './pages/offers/AllOffers';
import { CreateOffer } from './pages/offers/CreateOffer';
import { Performance } from './pages/Performance';
import { Conversions } from './pages/Conversions';
import { Billing } from './pages/Billing';
import { NotFound } from './pages/NotFound';
import { PostbackSetup } from './pages/PostbackSetup';
import { Messages } from './pages/Messages';
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
          <Route path="/postback-setup" element={<PostbackSetup />} />
          <Route path="/messages" element={<Messages />} />
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
