import { useState } from 'react';
import { AppShell } from '@cpatracker/ui';
import { affiliateMenu } from './menu';

function App() {
  const [currentPath, setCurrentPath] = useState('/');

  return (
    <AppShell
      menu={affiliateMenu}
      currentPath={currentPath}
      onNavigate={setCurrentPath}
      userLabel="Affiliate"
      notificationCount={1}
    >
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Current path: {currentPath}</p>
    </AppShell>
  );
}

export default App;
