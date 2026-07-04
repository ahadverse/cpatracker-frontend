# Super Admin app — design

## Context

CPATracker's frontend currently has three portals: `network-admin` (runs one affiliate network — offers, affiliates, advertisers, conversions, billing to advertisers), `affiliate`, and `advertiser`. All three are built against a mock data layer first, with the real backend wired in later (see `frontend/CLAUDE.md`).

CPATracker itself intends to sell "network-admin" instances to multiple businesses as a SaaS product. That requires a fourth, CPATracker-internal portal — a **super admin** — that sits one level above every tenant network: it provisions/manages tenant accounts and handles the subscription billing CPATracker charges those tenants. This is distinct from `network-admin`'s existing billing, which is the tenant charging *its own* advertisers.

Per the same mock-first convention as the other three apps, this design covers **only the new frontend app and its mock data layer**. The real multi-tenancy backend (tenant-scoping the database, provisioning APIs, real subscription billing) is an explicitly separate, later project — building it now would be premature since the UI/data shape should stabilize first, exactly as happened with the other three portals.

## Scope (v1)

Three screens: **Dashboard**, **Tenants**, **Billing**. No staff/permissions management, no impersonation-of-tenant view — those are deferred to a later phase once v1 ships.

## Architecture

Scaffold `apps/super-admin` as a straight structural copy of `apps/network-admin`:

- Same `package.json` shape (deps: `@cpatracker/{mock,types,ui,config}`, `react-router-dom`, `recharts`, etc.), renamed to `"super-admin"`.
- Same `vite.config.ts`, `tsconfig.json`/`tsconfig.app.json` (extending `@cpatracker/config/tsconfig.base.json`), `postcss.config.js`, `tailwind.config.js` (importing the shared preset), `index.html`, `vercel.json`.
- Same `main.tsx` → `App.tsx` → `Shell.tsx` structure: `ThemeProvider` → `BrowserRouter` → `Shell` (fetches notifications, wraps `AppShell` with `menu={superAdminMenu}`, `userLabel="Super Admin"`, `userName="Super Admin User"`) → `Routes`.
- Register `"dev:super-admin": "pnpm --filter super-admin dev"` in the root `package.json`. `pnpm-workspace.yaml`'s `apps/*` glob picks it up automatically — no other root config changes needed.
- Reuses `packages/ui` primitives as-is (`AppShell`, `DataTable`, `StatCard`, `Chart`, `Tabs`, `StatusBadge`, `Skeleton`, form primitives) — no new shared components required for v1.

## Data model (mock only)

New files in `packages/types/src/`:
- `tenant.ts` — `Tenant`: `id`, `companyName`, `contactEmail`, `plan: PlanTier`, `status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'`, `createdAt`, and a `usage` sub-object (`offers`, `affiliates`, `advertisers`, `clicks`, `conversions` counts) — enough for list/detail screens without retrofitting tenant-scoping onto every existing entity.
- `subscription.ts` — `PlanTier` (`STARTER | GROWTH | ENTERPRISE`, each with a fixed monthly price), `Subscription` (tenantId, plan, status, `nextBillingDate`), `TenantInvoice` (tenantId, period, amount, status) — mirrors the shape of the existing `Invoice` type in `network-admin`'s billing, just scoped to tenants instead of advertisers/affiliates.

Both get exported from `packages/types/src/index.ts`'s barrel.

New files in `packages/mock/src/data/`: `tenants.ts` (≈15 faker-generated tenants across all statuses/plans), `subscriptions.ts`, `tenantInvoices.ts` — following the exact pattern of `data/offers.ts` (faker-driven arrays, small set of fixed enums, helper functions for derived fields).

New files in `packages/mock/src/api/`: `tenants.ts` (`getTenants(filters?)`, `getTenant(id)`, `createTenant(input)`, `suspendTenant(id)`, `activateTenant(id)`, `cancelTenant(id)`) and `billing.ts` (`getPlans()`, `getSubscription(tenantId)`, `getTenantInvoices(tenantId)`) — each `async`, `delay()`-wrapped, guarded by `USE_MOCK`, following `api/offers.ts` exactly. All exported from `packages/mock/src/index.ts`.

This tenant list is **illustrative mock data**, deliberately not wired to `network-admin`'s existing mock dataset — reconciling the two would require retrofitting tenant IDs onto every entity, which is real-backend work, not frontend-mock work.

## Screens

**Dashboard** (`/`) — `StatCard` row: total tenants, active/trial/suspended breakdown, MRR (sum of active subscriptions' plan price), ARR. A `Chart` showing tenant growth over time (signups by month, faked). A ranked list of top tenants by usage (clicks or conversions) — same composition pattern as `network-admin`'s Dashboard (`rankBy` helper, `RankedList` component).

**Tenants** (`/tenants`) — `DataTable` list with search + status/plan filters, columns: company, contact email, plan, status (`StatusBadge`), usage summary, created date. Row click → detail view (`/tenants/:id`) showing full usage stats, subscription/billing info, and action buttons (suspend / activate / cancel, gated by current status). A "Create Tenant" flow (`/tenants/create`) with a form (company name, contact email, plan tier) that calls `createTenant`.

**Billing** (`/billing`) — Reference table of the three plan tiers (name, price, feature bullets — static, no API needed beyond `getPlans()`). A tenant subscription list (tenant, plan, status, next billing date) reusing `DataTable`. Below it, a combined invoice list (`getTenantInvoices` across all tenants) mirroring `network-admin`'s existing invoice list UI.

**Menu** (`src/menu.ts`) — `superAdminMenu: MenuConfig` with groups: `{ items: [Dashboard] }`, `{ label: 'MANAGE', items: [Tenants, Billing] }` — same `MenuConfig` shape used by `adminMenu` today.

## Out of scope (later phases)

- Real multi-tenancy backend (tenant-scoped database, provisioning APIs, real Stripe-style billing).
- CPATracker staff/permissions management screen.
- "View as tenant" / impersonation into a tenant's `network-admin` view.
- Wiring `network-admin`'s actual data as a real tenant record.

## Verification

- `pnpm --filter super-admin dev` — manually click through Dashboard, Tenants (list, filter, detail, create, suspend/activate/cancel), and Billing; confirm data loads via the mock API (not direct fixture imports) and screens match the visual style of the other three apps.
- `pnpm -r typecheck` and `pnpm --filter super-admin build` — clean.
- Repo-wide check that no component imports `packages/mock/src/data/*` directly (the existing "always go through api/" discipline).
