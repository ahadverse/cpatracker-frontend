import { Link } from 'react-router-dom';

export function Logout() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-xl font-semibold">You've been logged out</h1>
      <p className="text-sm text-muted-foreground">There's no real session yet — this is a stand-in screen.</p>
      <Link to="/" className="text-sm font-medium text-primary hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
