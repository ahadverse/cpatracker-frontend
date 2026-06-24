import { useState } from 'react';
import { AppShell, Toaster } from '@cpatracker/ui';
import { adminMenu } from './menu';

function App() {
  const [currentPath, setCurrentPath] = useState('/');

  return (
    <>
      <AppShell
        menu={adminMenu}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        userLabel="Admin"
        notificationCount={3}
      >
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Current path: {currentPath}</p>
      </AppShell>
      <Toaster />
    </>
  );
}

export default App;
