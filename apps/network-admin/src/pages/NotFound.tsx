import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-xl font-semibold">404 — Page not found</h1>
      <p className="text-sm text-muted-foreground">This page doesn't exist in the admin portal.</p>
      <Link to="/" className="text-sm font-medium text-primary hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
