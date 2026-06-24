import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@cpatracker/ui';
import { Shell } from './Shell';
import { Dashboard } from './pages/Dashboard';
import { ComingSoon } from './pages/ComingSoon';

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Shell>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
