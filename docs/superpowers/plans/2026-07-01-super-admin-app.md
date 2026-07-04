# Super Admin App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fourth frontend app, `apps/super-admin`, a CPATracker-internal portal that provisions/manages tenant network accounts and their subscription billing, built against a new mock data layer (no real backend changes).

**Architecture:** Scaffold `apps/super-admin` as a structural copy of `apps/network-admin` (same Vite/React/Router/Tailwind tooling, same `main.tsx → App.tsx → Shell.tsx → AppShell` composition). Add a new mock-only domain (`Tenant`, `Subscription`, `Plan`, `TenantInvoice`) to `packages/types` and `packages/mock`, following the exact `offers.ts`/`advertisers.ts` data/api pattern already used by the other three apps. Build three screens (Dashboard, Tenants, Billing) incrementally, each replacing a `ComingSoon` placeholder route one at a time.

**Tech Stack:** React 19, Vite 8, TypeScript, React Router 7, Tailwind CSS (shared preset), TanStack Table, Radix UI (via `@cpatracker/ui`), Recharts (via `@cpatracker/ui`'s `Chart`), pnpm workspaces.

## Global Constraints

- This repo is **not a git repository** (`git rev-parse --is-inside-work-tree` fails). Every task below omits git commit steps — verify each task with the listed typecheck/build/dev-server commands instead. If the user initializes git later, `git add`/`git commit` can be layered on afterward.
- This frontend monorepo has **no test runner** configured anywhere (`find ... -iname "*.test.*"` and `-iname "vitest*"` both return nothing across all packages/apps). Verification is exclusively `tsc` typecheck, `vite build`, and manual dev-server walkthroughs — this matches how `network-admin`/`affiliate`/`advertiser` were built and verified. Do not introduce a test framework as part of this plan.
- Follow the "mock data layer" discipline from `frontend/CLAUDE.md`: components must only call functions from `packages/mock/src/api/*`, never import `packages/mock/src/data/*` directly.
- Package manager is pnpm workspaces (`pnpm-workspace.yaml`: `apps/*`, `packages/*`) — new apps are auto-discovered, no workspace config changes needed.
- Reuse existing `packages/ui` primitives (`AppShell`, `DataTable`, `StatCard`, `Chart`, `Select`, `Input`, `StatusBadge`, `Skeleton`, `Toaster`) as-is. Do not create new shared components for this plan.

---

### Task 1: Add `Tenant` and `Subscription`/`Plan`/`TenantInvoice` types

**Files:**
- Create: `frontend/packages/types/src/tenant.ts`
- Create: `frontend/packages/types/src/subscription.ts`
- Modify: `frontend/packages/types/src/index.ts`

**Interfaces:**
- Produces: `TenantStatus`, `TenantUsage`, `Tenant` (from `tenant.ts`); `PlanTier`, `Plan`, `SubscriptionStatus`, `Subscription`, `TenantInvoiceStatus`, `TenantInvoice` (from `subscription.ts`). All later tasks import these from `@cpatracker/types`.

- [ ] **Step 1: Create `subscription.ts`**

```ts
// frontend/packages/types/src/subscription.ts
export type PlanTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE';

export interface Plan {
  id: PlanTier;
  name: string;
  price: number;
  features: string[];
}

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

export interface Subscription {
  tenantId: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  nextBillingDate: string;
}

export type TenantInvoiceStatus = 'PAID' | 'PENDING';

export interface TenantInvoice {
  id: string;
  tenantId: string;
  period: string;
  amount: number;
  status: TenantInvoiceStatus;
  createdAt: string;
}
```

- [ ] **Step 2: Create `tenant.ts`**

```ts
// frontend/packages/types/src/tenant.ts
import type { PlanTier } from './subscription';

export type TenantStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

export interface TenantUsage {
  offers: number;
  affiliates: number;
  advertisers: number;
  clicks: number;
  conversions: number;
}

export interface Tenant {
  id: string;
  companyName: string;
  contactEmail: string;
  plan: PlanTier;
  status: TenantStatus;
  usage: TenantUsage;
  createdAt: string;
}
```

- [ ] **Step 3: Add both to the barrel export**

Modify `frontend/packages/types/src/index.ts` — add two lines at the end:

```ts
export * from './tenant';
export * from './subscription';
```

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @cpatracker/types typecheck` (from `frontend/`)
Expected: exits 0, no output beyond the script invocation.

---

### Task 2: Add tenant mock data (`plans`, `tenants`, `subscriptions`, `tenantInvoices`, `demoSuperAdmin`)

**Files:**
- Create: `frontend/packages/mock/src/data/plans.ts`
- Create: `frontend/packages/mock/src/data/tenants.ts`
- Create: `frontend/packages/mock/src/data/subscriptions.ts`
- Create: `frontend/packages/mock/src/data/tenantInvoices.ts`
- Create: `frontend/packages/mock/src/data/superAdmin.ts`
- Modify: `frontend/packages/mock/src/index.ts`

**Interfaces:**
- Consumes: `Plan`, `Tenant`, `TenantStatus`, `PlanTier`, `Subscription`, `TenantInvoice` from `@cpatracker/types` (Task 1); `faker` from `../faker`.
- Produces: `plans: Plan[]`, `tenants: Tenant[]`, `subscriptions: Subscription[]`, `tenantInvoices: TenantInvoice[]` (all mutable arrays, pushed to by Task 3's `createTenant`), `demoSuperAdmin: { id: string; name: string; email: string }`.

- [ ] **Step 1: Create `data/plans.ts`**

```ts
// frontend/packages/mock/src/data/plans.ts
import type { Plan } from '@cpatracker/types';

export const plans: Plan[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 49,
    features: ['1 network', 'Up to 10 offers', 'Email support'],
  },
  {
    id: 'GROWTH',
    name: 'Growth',
    price: 199,
    features: ['1 network', 'Unlimited offers', 'Priority support', 'Advanced reports'],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 599,
    features: ['1 network', 'Unlimited everything', 'Dedicated account manager', 'Custom integrations'],
  },
];
```

- [ ] **Step 2: Create `data/tenants.ts`**

```ts
// frontend/packages/mock/src/data/tenants.ts
import type { PlanTier, Tenant, TenantStatus } from '@cpatracker/types';
import { faker } from '../faker';

const COUNT = 15;
const STATUSES: TenantStatus[] = ['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED'];
const PLANS: PlanTier[] = ['STARTER', 'GROWTH', 'ENTERPRISE'];

export const tenants: Tenant[] = Array.from({ length: COUNT }, (_, i) => ({
  id: `tenant-${i + 1}`,
  companyName: faker.company.name(),
  contactEmail: faker.internet.email().toLowerCase(),
  plan: faker.helpers.weightedArrayElement([
    { value: PLANS[0]!, weight: 5 },
    { value: PLANS[1]!, weight: 3 },
    { value: PLANS[2]!, weight: 1 },
  ]),
  status: faker.helpers.weightedArrayElement([
    { value: STATUSES[1]!, weight: 7 },
    { value: STATUSES[0]!, weight: 4 },
    { value: STATUSES[2]!, weight: 2 },
    { value: STATUSES[3]!, weight: 1 },
  ]),
  usage: {
    offers: faker.number.int({ min: 2, max: 60 }),
    affiliates: faker.number.int({ min: 5, max: 500 }),
    advertisers: faker.number.int({ min: 1, max: 40 }),
    clicks: faker.number.int({ min: 1000, max: 500000 }),
    conversions: faker.number.int({ min: 20, max: 8000 }),
  },
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}));
```

- [ ] **Step 3: Create `data/subscriptions.ts`**

```ts
// frontend/packages/mock/src/data/subscriptions.ts
import type { Subscription } from '@cpatracker/types';
import { faker } from '../faker';
import { tenants } from './tenants';

export const subscriptions: Subscription[] = tenants.map((tenant) => ({
  tenantId: tenant.id,
  plan: tenant.plan,
  status:
    tenant.status === 'CANCELLED' ? 'CANCELLED' : tenant.status === 'SUSPENDED' ? 'PAST_DUE' : 'ACTIVE',
  nextBillingDate: faker.date.soon({ days: 30 }).toISOString(),
}));
```

- [ ] **Step 4: Create `data/tenantInvoices.ts`**

```ts
// frontend/packages/mock/src/data/tenantInvoices.ts
import type { TenantInvoice } from '@cpatracker/types';
import { faker } from '../faker';
import { plans } from './plans';
import { tenants } from './tenants';

function periodsFor(): string[] {
  const now = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return d.toISOString().slice(0, 7);
  });
}

const priceByPlan = new Map(plans.map((p) => [p.id, p.price]));

export const tenantInvoices: TenantInvoice[] = tenants.flatMap((tenant) =>
  periodsFor().map((period, i) => ({
    id: `tenant-invoice-${tenant.id}-${period}`,
    tenantId: tenant.id,
    period,
    amount: priceByPlan.get(tenant.plan) ?? 0,
    status: i === 0 && tenant.status !== 'CANCELLED' ? 'PENDING' : 'PAID',
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  })),
);
```

- [ ] **Step 5: Create `data/superAdmin.ts`**

```ts
// frontend/packages/mock/src/data/superAdmin.ts
// Stand-in for a current-user/session concept (super-admin has no auth yet) —
// same role adminUser/demoAffiliate/demoAdvertiser play for the other apps.
// Deliberately not a `User` from @cpatracker/types: super admin isn't part of
// the tenant-scoped Role model (NETWORK_ADMIN/AFFILIATE/ADVERTISER/MANAGER).
export const demoSuperAdmin = {
  id: 'super-admin-1',
  name: 'Super Admin User',
  email: 'super@cpatracker.dev',
};
```

- [ ] **Step 6: Export `demoSuperAdmin` from the mock barrel**

Modify `frontend/packages/mock/src/index.ts` — add this line next to the existing single-object exports (`adminUser`, `demoAffiliate`, `demoAdvertiser`):

```ts
export { demoSuperAdmin } from './data/superAdmin';
```

- [ ] **Step 7: Typecheck**

Run: `pnpm --filter @cpatracker/mock typecheck` (from `frontend/`)
Expected: exits 0.

---

### Task 3: Add tenant mock API (`api/tenants.ts`, `api/billing.ts`)

**Files:**
- Create: `frontend/packages/mock/src/api/tenants.ts`
- Create: `frontend/packages/mock/src/api/billing.ts`
- Modify: `frontend/packages/mock/src/index.ts`

**Interfaces:**
- Consumes: `tenants`, `subscriptions`, `plans`, `tenantInvoices` arrays from Task 2's data files; `delay` from `../delay`; `USE_MOCK` from `../config`.
- Produces (used by Tasks 6-10's screens): `getTenants(filters?: TenantFilters): Promise<Tenant[]>`, `getTenant(id: string): Promise<Tenant | undefined>`, `createTenant(input: CreateTenantInput): Promise<Tenant>`, `updateTenantStatus(id: string, status: TenantStatus): Promise<Tenant>`, `getPlans(): Promise<Plan[]>`, `getSubscriptions(): Promise<Subscription[]>`, `getSubscription(tenantId: string): Promise<Subscription | undefined>`, `getTenantInvoices(tenantId?: string): Promise<TenantInvoice[]>`.

- [ ] **Step 1: Create `api/tenants.ts`**

`CreateTenantInput` is defined locally in this file (not exported from `@cpatracker/types`), following the same pattern as `CreateOfferInput` in `api/offers.ts` and `CreateAdvertiserInput` in `api/advertisers.ts`.

```ts
// frontend/packages/mock/src/api/tenants.ts
import type { PlanTier, Tenant, TenantStatus } from '@cpatracker/types';
import { delay } from '../delay';
import { subscriptions } from '../data/subscriptions';
import { tenants } from '../data/tenants';
import { USE_MOCK } from '../config';

export interface TenantFilters {
  status?: TenantStatus;
  plan?: PlanTier;
  search?: string;
}

export async function getTenants(filters?: TenantFilters): Promise<Tenant[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  return tenants.filter((tenant) => {
    if (filters?.status && tenant.status !== filters.status) return false;
    if (filters?.plan && tenant.plan !== filters.plan) return false;
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      if (!tenant.companyName.toLowerCase().includes(q) && !tenant.contactEmail.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export async function getTenant(id: string): Promise<Tenant | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return tenants.find((tenant) => tenant.id === id);
}

export interface CreateTenantInput {
  companyName: string;
  contactEmail: string;
  plan: PlanTier;
}

export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const id = `tenant-${tenants.length + 1}-${Date.now()}`;
  const tenant: Tenant = {
    id,
    companyName: input.companyName,
    contactEmail: input.contactEmail,
    plan: input.plan,
    status: 'TRIAL',
    usage: { offers: 0, affiliates: 0, advertisers: 0, clicks: 0, conversions: 0 },
    createdAt: new Date().toISOString(),
  };
  tenants.push(tenant);
  subscriptions.push({
    tenantId: id,
    plan: input.plan,
    status: 'ACTIVE',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  return tenant;
}

export async function updateTenantStatus(id: string, status: TenantStatus): Promise<Tenant> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');

  const tenant = tenants.find((t) => t.id === id);
  if (!tenant) throw new Error(`Tenant ${id} not found`);
  tenant.status = status;

  const subscription = subscriptions.find((s) => s.tenantId === id);
  if (subscription) {
    subscription.status = status === 'CANCELLED' ? 'CANCELLED' : status === 'SUSPENDED' ? 'PAST_DUE' : 'ACTIVE';
  }
  return tenant;
}
```

(Note: `getTenant`/`getTenants`/`createTenant`/`updateTenantStatus` follow the exact shape of `api/advertisers.ts`'s `getAdvertiser`/`getAdvertisers`/`createAdvertiser`/`updateAdvertiserStatus` — one generic status-updater function rather than separate `suspendTenant`/`activateTenant`/`cancelTenant` functions, matching the codebase's established convention.)

- [ ] **Step 2: Create `api/billing.ts`**

```ts
// frontend/packages/mock/src/api/billing.ts
import type { Plan, Subscription, TenantInvoice } from '@cpatracker/types';
import { delay } from '../delay';
import { plans } from '../data/plans';
import { subscriptions } from '../data/subscriptions';
import { tenantInvoices } from '../data/tenantInvoices';
import { USE_MOCK } from '../config';

export async function getPlans(): Promise<Plan[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return plans;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return subscriptions;
}

export async function getSubscription(tenantId: string): Promise<Subscription | undefined> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return subscriptions.find((s) => s.tenantId === tenantId);
}

export async function getTenantInvoices(tenantId?: string): Promise<TenantInvoice[]> {
  await delay();
  if (!USE_MOCK) throw new Error('Real API not wired yet');
  return tenantInvoices.filter((invoice) => !tenantId || invoice.tenantId === tenantId);
}
```

- [ ] **Step 3: Export both from the mock barrel**

Modify `frontend/packages/mock/src/index.ts` — add these two lines to the `export * from './api/...'` block:

```ts
export * from './api/tenants';
export * from './api/billing';
```

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @cpatracker/mock typecheck` (from `frontend/`)
Expected: exits 0.

---

### Task 4: Add a `tenants` sidebar icon

**Files:**
- Modify: `frontend/packages/ui/src/components/Sidebar.tsx:1-44`

**Interfaces:**
- Produces: `ICONS['tenants']` resolves to a distinct Lucide icon, used by Task 5's `menu.ts` (`icon: 'tenants'`).

- [ ] **Step 1: Add the `Building` import and map entry**

In `frontend/packages/ui/src/components/Sidebar.tsx`, add `Building` to the `lucide-react` import list (it currently imports `Building2` for `advertisers` — `Building` is a distinct single-building icon, kept separate so Tenants and Advertisers don't share an icon):

```ts
import {
  BarChart3,
  Bell,
  Building,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gift,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Store,
  Tag,
  User,
  UserCog,
  Users,
  Webhook,
  Circle,
  type LucideIcon,
} from 'lucide-react';
```

Add `tenants: Building,` to the `ICONS` map (anywhere in the object, e.g. right after `advertisers: Building2,`):

```ts
const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  offers: Tag,
  affiliates: Users,
  advertisers: Building2,
  tenants: Building,
  managers: UserCog,
  reports: BarChart3,
  notifications: Bell,
  settings: Settings,
  billing: CreditCard,
  payments: CreditCard,
  marketplace: Store,
  messages: MessageSquare,
  referral: Gift,
  profile: User,
  postback: Webhook,
  logout: LogOut,
};
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @cpatracker/ui typecheck` (from `frontend/`)
Expected: exits 0.

---

### Task 5: Scaffold `apps/super-admin` (boilerplate, shell, plumbing routes)

**Files:**
- Create: `frontend/apps/super-admin/package.json`
- Create: `frontend/apps/super-admin/vite.config.ts`
- Create: `frontend/apps/super-admin/tsconfig.json`
- Create: `frontend/apps/super-admin/tsconfig.app.json`
- Create: `frontend/apps/super-admin/tsconfig.node.json`
- Create: `frontend/apps/super-admin/postcss.config.js`
- Create: `frontend/apps/super-admin/tailwind.config.js`
- Create: `frontend/apps/super-admin/vercel.json`
- Create: `frontend/apps/super-admin/index.html`
- Create: `frontend/apps/super-admin/.gitignore`
- Create: `frontend/apps/super-admin/.oxlintrc.json`
- Create: `frontend/apps/super-admin/eslint.config.js`
- Create: `frontend/apps/super-admin/src/main.tsx`
- Create: `frontend/apps/super-admin/src/index.css`
- Create: `frontend/apps/super-admin/src/App.tsx`
- Create: `frontend/apps/super-admin/src/Shell.tsx`
- Create: `frontend/apps/super-admin/src/menu.ts`
- Create: `frontend/apps/super-admin/src/pages/ComingSoon.tsx`
- Create: `frontend/apps/super-admin/src/pages/NotFound.tsx`
- Create: `frontend/apps/super-admin/src/pages/Logout.tsx`
- Create: `frontend/apps/super-admin/src/pages/Profile.tsx`
- Create: `frontend/apps/super-admin/src/pages/Notifications.tsx`
- Modify: `frontend/package.json`

**Interfaces:**
- Consumes: `demoSuperAdmin`, `getNotifications`, `markNotificationRead` (Task 2/3, already exported); `AppShell`, `LogoMark`, `Skeleton`, `toast` from `@cpatracker/ui`; `MenuConfig` from `@cpatracker/types`.
- Produces: a running `super-admin` dev server with sidebar/topbar and 9 stubbed/plumbing routes. Tasks 6-10 replace individual `ComingSoon` routes in `App.tsx` with real screens.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "super-admin",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "typecheck": "tsc -b --noEmit",
    "preview": "vite preview"
  },
  "dependencies": {
    "@cpatracker/mock": "workspace:*",
    "@cpatracker/types": "workspace:*",
    "@cpatracker/ui": "workspace:*",
    "@tanstack/react-table": "^8.20.5",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-router-dom": "^7.0.2",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "@cpatracker/config": "workspace:*",
    "@types/node": "^24.13.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "~5.6.2",
    "vite": "^8.1.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 4: Create `tsconfig.app.json`**

```json
{
  "extends": "@cpatracker/config/tsconfig.base.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "types": ["vite/client"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Create `tailwind.config.js`**

```js
import preset from '@cpatracker/config/tailwind-preset.js';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [animate],
};
```

- [ ] **Step 8: Create `vercel.json`**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 9: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Super Admin — CPATracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 10: Create `.gitignore`**

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

- [ ] **Step 11: Create `.oxlintrc.json`**

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

- [ ] **Step 12: Create `eslint.config.js`**

```js
import sharedConfig from '@cpatracker/config/eslint-preset.js';

export default [{ ignores: ['dist/**'] }, ...sharedConfig];
```

- [ ] **Step 13: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 14: Create `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@cpatracker/ui';
import '@cpatracker/ui/styles/theme.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
```

- [ ] **Step 15: Create `src/menu.ts`**

```ts
import type { MenuConfig } from '@cpatracker/types';

export const superAdminMenu: MenuConfig = {
  groups: [
    { items: [{ label: 'Dashboard', path: '/', icon: 'dashboard' }] },
    {
      label: 'MANAGE',
      items: [
        {
          label: 'Tenants',
          path: '/tenants',
          icon: 'tenants',
          children: [
            { label: 'All Tenants', path: '/tenants/all' },
            { label: 'Create Tenant', path: '/tenants/create' },
          ],
        },
        { label: 'Billing', path: '/billing', icon: 'billing' },
      ],
    },
    {
      label: 'OTHERS',
      items: [
        { label: 'Notifications', path: '/notifications', icon: 'notifications' },
        { label: 'Settings', path: '/settings', icon: 'settings' },
        { label: 'Logout', path: '/logout', icon: 'logout' },
      ],
    },
  ],
};
```

- [ ] **Step 16: Create `src/Shell.tsx`**

```tsx
import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { demoSuperAdmin, getNotifications, markNotificationRead } from '@cpatracker/mock';
import type { Notification } from '@cpatracker/types';
import { AppShell, LogoMark } from '@cpatracker/ui';
import { superAdminMenu } from './menu';

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function loadNotifications() {
    getNotifications(demoSuperAdmin.id).then(setNotifications);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleNotificationClick(id: string) {
    await markNotificationRead(id);
    loadNotifications();
  }

  return (
    <AppShell
      menu={superAdminMenu}
      currentPath={location.pathname}
      onNavigate={navigate}
      userLabel="Super Admin"
      userName="Super Admin User"
      notifications={notifications}
      onNotificationClick={handleNotificationClick}
      onViewAllNotificationsClick={() => navigate('/notifications')}
      onProfileClick={() => navigate('/profile')}
      onLogout={() => navigate('/logout')}
      logoMark={<LogoMark />}
      logoText="CPATracker"
    >
      {children}
    </AppShell>
  );
}
```

- [ ] **Step 17: Create `src/pages/ComingSoon.tsx`**

```tsx
export function ComingSoon() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h1 className="text-xl font-semibold">This screen isn't built yet</h1>
      <p className="mt-2 text-sm text-muted-foreground">Check back once this stage is implemented.</p>
    </div>
  );
}
```

- [ ] **Step 18: Create `src/pages/NotFound.tsx`**

```tsx
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-xl font-semibold">404 — Page not found</h1>
      <p className="text-sm text-muted-foreground">This page doesn't exist in the super admin portal.</p>
      <Link to="/" className="text-sm font-medium text-primary hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
```

- [ ] **Step 19: Create `src/pages/Logout.tsx`**

```tsx
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
```

- [ ] **Step 20: Create `src/pages/Profile.tsx`**

Note: unlike `network-admin`'s `Profile.tsx`, this has no password-change form — `changePassword` in `@cpatracker/mock` only recognizes users in the tenant-scoped `users` table, and `demoSuperAdmin` deliberately isn't one (Task 2), so wiring that form here would call an API that always throws.

```tsx
import { demoSuperAdmin } from '@cpatracker/mock';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Profile() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-secondary text-xl font-semibold text-secondary-foreground">
          {initials(demoSuperAdmin.name)}
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold text-card-foreground">{demoSuperAdmin.name}</h2>
          <p className="text-sm text-muted-foreground">{demoSuperAdmin.email}</p>
          <p className="text-xs text-muted-foreground">Role: Super Admin</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 21: Create `src/pages/Notifications.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { demoSuperAdmin, getNotifications, markNotificationRead } from '@cpatracker/mock';
import type { Notification } from '@cpatracker/types';
import { Skeleton, toast } from '@cpatracker/ui';

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const rows = await getNotifications(demoSuperAdmin.id);
    setNotifications(rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMarkRead(notification: Notification) {
    await markNotificationRead(notification.id);
    toast.success('Marked as read');
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {loading &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          ))}
        {!loading && notifications.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">No notifications.</p>
        )}
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className={notification.readAt ? 'text-muted-foreground' : 'font-medium text-card-foreground'}>
                {notification.message}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {notification.type} · {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            {!notification.readAt && (
              <button
                type="button"
                onClick={() => handleMarkRead(notification)}
                className="shrink-0 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 22: Create `src/App.tsx`** (all feature routes stubbed to `ComingSoon` — Tasks 6-10 replace them one at a time)

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from '@cpatracker/ui';
import { Shell } from './Shell';
import { ComingSoon } from './pages/ComingSoon';
import { NotFound } from './pages/NotFound';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Logout } from './pages/Logout';

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<ComingSoon />} />

          <Route path="/tenants/all" element={<ComingSoon />} />
          <Route path="/tenants/create" element={<ComingSoon />} />
          <Route path="/tenants/:id" element={<ComingSoon />} />

          <Route path="/billing" element={<ComingSoon />} />

          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<ComingSoon />} />
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
```

- [ ] **Step 23: Register the dev script in the root `package.json`**

Modify `frontend/package.json` — add a line after `"dev:advertiser"`:

```json
    "dev:advertiser": "pnpm --filter advertiser dev",
    "dev:super-admin": "pnpm --filter super-admin dev",
```

- [ ] **Step 24: Install dependencies**

Run (from `frontend/`): `pnpm install`
Expected: resolves the new `super-admin` workspace member, no errors. `pnpm-lock.yaml` is updated to include it.

- [ ] **Step 25: Typecheck and verify the dev server**

Run: `pnpm --filter super-admin typecheck`
Expected: exits 0.

Run: `pnpm --filter super-admin dev` (leave running, or use `run_in_background` if scripted)
Expected: Vite prints a local URL (e.g. `http://localhost:5173`). Open it — you should see the sidebar with Dashboard/Tenants (All Tenants, Create Tenant)/Billing/Notifications/Settings/Logout, a "Super Admin" topbar identity, and every route except `/notifications`, `/profile`, `/logout` showing "This screen isn't built yet". Stop the dev server after confirming.

---

### Task 6: Build the Dashboard screen

**Files:**
- Create: `frontend/apps/super-admin/src/pages/Dashboard.tsx`
- Modify: `frontend/apps/super-admin/src/App.tsx:1-10` (import), `:9` (route)

**Interfaces:**
- Consumes: `getTenants`, `getSubscriptions`, `getPlans` from `@cpatracker/mock`; `Tenant`, `Subscription`, `Plan` from `@cpatracker/types`; `Chart`, `Skeleton`, `StatCard` from `@cpatracker/ui`.
- Produces: `Dashboard` component, default-exported nothing (named export `Dashboard`), consumed only by `App.tsx`'s `/` route.

- [ ] **Step 1: Create `src/pages/Dashboard.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { getPlans, getSubscriptions, getTenants } from '@cpatracker/mock';
import { Chart, Skeleton, StatCard } from '@cpatracker/ui';

interface MonthlySignups {
  month: string;
  count: number;
}

interface RankedTenant {
  id: string;
  label: string;
  metric: number;
}

interface DashboardData {
  totalTenants: number;
  trialCount: number;
  activeCount: number;
  suspendedCount: number;
  cancelledCount: number;
  mrr: number;
  arr: number;
  growth: MonthlySignups[];
  topTenants: RankedTenant[];
}

function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

async function loadDashboardData(): Promise<DashboardData> {
  const [tenants, subscriptions, plans] = await Promise.all([getTenants(), getSubscriptions(), getPlans()]);

  const priceByPlan = new Map(plans.map((p) => [p.id, p.price]));
  const activeTenantIds = new Set(subscriptions.filter((s) => s.status === 'ACTIVE').map((s) => s.tenantId));
  const mrr = tenants
    .filter((t) => activeTenantIds.has(t.id))
    .reduce((sum, t) => sum + (priceByPlan.get(t.plan) ?? 0), 0);

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d.toISOString().slice(0, 7);
  });
  const growth: MonthlySignups[] = months.map((month) => ({
    month,
    count: tenants.filter((t) => monthKey(t.createdAt) === month).length,
  }));

  const topTenants: RankedTenant[] = [...tenants]
    .sort((a, b) => b.usage.clicks - a.usage.clicks)
    .slice(0, 5)
    .map((t) => ({ id: t.id, label: t.companyName, metric: t.usage.clicks }));

  return {
    totalTenants: tenants.length,
    trialCount: tenants.filter((t) => t.status === 'TRIAL').length,
    activeCount: tenants.filter((t) => t.status === 'ACTIVE').length,
    suspendedCount: tenants.filter((t) => t.status === 'SUSPENDED').length,
    cancelledCount: tenants.filter((t) => t.status === 'CANCELLED').length,
    mrr: Number(mrr.toFixed(2)),
    arr: Number((mrr * 12).toFixed(2)),
    growth,
    topTenants,
  };
}

function TopTenantsList({ rows }: { rows: RankedTenant[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground">Top Tenants by Clicks</h3>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 && <li className="text-sm text-muted-foreground">No data.</li>}
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between text-sm">
            <span className="truncate text-card-foreground">{row.label}</span>
            <span className="shrink-0 font-medium text-card-foreground">{row.metric.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboardData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  const { totalTenants, trialCount, activeCount, suspendedCount, cancelledCount, mrr, arr, growth, topTenants } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Tenants" value={totalTenants} />
        <StatCard label="Active" value={activeCount} />
        <StatCard label="Trial" value={trialCount} />
        <StatCard label="Suspended" value={suspendedCount} />
        <StatCard label="Cancelled" value={cancelledCount} />
        <StatCard label="MRR" value={`$${mrr.toFixed(2)}`} />
        <StatCard label="ARR" value={`$${arr.toFixed(2)}`} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Tenant Growth (6 months)</h3>
        <Chart type="bar" data={growth} xKey="month" series={[{ key: 'count', label: 'New Tenants' }]} />
      </div>

      <TopTenantsList rows={topTenants} />
    </div>
  );
}
```

- [ ] **Step 2: Wire the `/` route in `App.tsx`**

Add the import next to the other page imports:

```tsx
import { Dashboard } from './pages/Dashboard';
```

Replace `<Route path="/" element={<ComingSoon />} />` with:

```tsx
<Route path="/" element={<Dashboard />} />
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter super-admin typecheck`
Expected: exits 0.

- [ ] **Step 4: Manual verification**

Run: `pnpm --filter super-admin dev`, open the printed URL. The Dashboard should show 7 stat cards (Total Tenants, Active, Trial, Suspended, Cancelled, MRR, ARR) with non-zero numbers, a bar chart titled "Tenant Growth (6 months)", and a "Top Tenants by Clicks" list with 5 company names. Stop the dev server after confirming.

---

### Task 7: Build the Tenants list screen

**Files:**
- Create: `frontend/apps/super-admin/src/pages/tenants/AllTenants.tsx`
- Modify: `frontend/apps/super-admin/src/App.tsx` (import), (route)

**Interfaces:**
- Consumes: `getTenants`, `TenantFilters` from `@cpatracker/mock`; `Tenant`, `TenantStatus`, `PlanTier` from `@cpatracker/types`; `DataTable`, `Input`, `Select`, `StatusBadge` from `@cpatracker/ui`.
- Produces: `AllTenants` component; navigates to `/tenants/:id` (built in Task 9) on row click.

- [ ] **Step 1: Create `src/pages/tenants/AllTenants.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { getTenants, type TenantFilters } from '@cpatracker/mock';
import type { PlanTier, Tenant, TenantStatus } from '@cpatracker/types';
import { DataTable, Input, Select, StatusBadge } from '@cpatracker/ui';

const STATUS_OPTIONS: { value: TenantStatus; label: string }[] = [
  { value: 'TRIAL', label: 'Trial' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const PLAN_OPTIONS: { value: PlanTier; label: string }[] = [
  { value: 'STARTER', label: 'Starter' },
  { value: 'GROWTH', label: 'Growth' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
];

const STATUS_VARIANT: Record<TenantStatus, 'success' | 'warning' | 'destructive' | 'neutral'> = {
  TRIAL: 'warning',
  ACTIVE: 'success',
  SUSPENDED: 'destructive',
  CANCELLED: 'neutral',
};

export function AllTenants() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filters, setFilters] = useState<TenantFilters>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setTenants(await getTenants(filters));
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.plan, filters.search]);

  const columns: ColumnDef<Tenant>[] = [
    { accessorKey: 'companyName', header: 'Company' },
    { accessorKey: 'contactEmail', header: 'Contact' },
    { accessorKey: 'plan', header: 'Plan' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</StatusBadge>
      ),
    },
    {
      id: 'usage',
      header: 'Usage (clicks)',
      accessorFn: (tenant) => tenant.usage.clicks,
      cell: ({ row }) => row.original.usage.clicks.toLocaleString(),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorFn: (tenant) => new Date(tenant.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => navigate(`/tenants/${row.original.id}`)}
          className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tenants</h1>

      <DataTable
        columns={columns}
        data={tenants}
        loading={loading}
        emptyState="No tenants match these filters."
        filterBar={
          <div className="flex flex-wrap gap-3">
            <Input
              value={filters.search ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined }))}
              placeholder="Search company or email"
              className="w-64"
            />
            <Select
              options={STATUS_OPTIONS}
              value={filters.status}
              onValueChange={(value) => setFilters((f) => ({ ...f, status: value as TenantStatus }))}
              placeholder="All statuses"
              className="w-44"
            />
            <Select
              options={PLAN_OPTIONS}
              value={filters.plan}
              onValueChange={(value) => setFilters((f) => ({ ...f, plan: value as PlanTier }))}
              placeholder="All plans"
              className="w-44"
            />
          </div>
        }
      />
    </div>
  );
}
```

- [ ] **Step 2: Wire the `/tenants/all` route in `App.tsx`**

Add the import:

```tsx
import { AllTenants } from './pages/tenants/AllTenants';
```

Replace `<Route path="/tenants/all" element={<ComingSoon />} />` with:

```tsx
<Route path="/tenants/all" element={<AllTenants />} />
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter super-admin typecheck`
Expected: exits 0.

- [ ] **Step 4: Manual verification**

Run: `pnpm --filter super-admin dev`, navigate to "All Tenants" in the sidebar. Confirm the table lists 15 tenants with company/contact/plan/status/usage/created columns, the search box filters by typing part of a company name, and both Select filters narrow the list. Stop the dev server after confirming.

---

### Task 8: Build the Create Tenant screen

**Files:**
- Create: `frontend/apps/super-admin/src/pages/tenants/CreateTenant.tsx`
- Modify: `frontend/apps/super-admin/src/App.tsx` (import), (route)

**Interfaces:**
- Consumes: `createTenant` from `@cpatracker/mock`; `PlanTier` from `@cpatracker/types`; `Input`, `Select`, `toast` from `@cpatracker/ui`.
- Produces: `CreateTenant` component; on success, navigates to `/tenants/all` (Task 7).

- [ ] **Step 1: Create `src/pages/tenants/CreateTenant.tsx`**

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTenant } from '@cpatracker/mock';
import type { PlanTier } from '@cpatracker/types';
import { Input, Select, toast } from '@cpatracker/ui';

const PLAN_OPTIONS: { value: PlanTier; label: string }[] = [
  { value: 'STARTER', label: 'Starter' },
  { value: 'GROWTH', label: 'Growth' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
];

export function CreateTenant() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [plan, setPlan] = useState<PlanTier>();

  const valid = companyName.trim().length > 0 && contactEmail.trim().length > 0 && !!plan;

  async function handleSubmit() {
    if (!valid || !plan) return;
    setSubmitting(true);
    try {
      await createTenant({ companyName: companyName.trim(), contactEmail: contactEmail.trim(), plan });
      toast.success('Tenant created');
      navigate('/tenants/all');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Tenant</h1>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Company name</label>
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Contact email</label>
          <Input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Plan</label>
          <Select
            options={PLAN_OPTIONS}
            value={plan}
            onValueChange={(value) => setPlan(value as PlanTier)}
            placeholder="Select a plan"
          />
        </div>

        <button
          type="button"
          disabled={!valid || submitting}
          onClick={handleSubmit}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create tenant'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire the `/tenants/create` route in `App.tsx`**

Add the import:

```tsx
import { CreateTenant } from './pages/tenants/CreateTenant';
```

Replace `<Route path="/tenants/create" element={<ComingSoon />} />` with:

```tsx
<Route path="/tenants/create" element={<CreateTenant />} />
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter super-admin typecheck`
Expected: exits 0.

- [ ] **Step 4: Manual verification**

Run: `pnpm --filter super-admin dev`, navigate to "Create Tenant". Fill in a company name, email, and pick a plan — the button should enable only once all three are set. Submit, confirm a success toast appears and you land on "All Tenants" with the new tenant visible (status `TRIAL`). Stop the dev server after confirming.

---

### Task 9: Build the Tenant detail screen (usage, subscription, invoices, suspend/activate/cancel)

**Files:**
- Create: `frontend/apps/super-admin/src/pages/tenants/TenantDetail.tsx`
- Modify: `frontend/apps/super-admin/src/App.tsx` (import), (route)

**Interfaces:**
- Consumes: `getTenant`, `updateTenantStatus`, `getSubscription`, `getTenantInvoices` from `@cpatracker/mock`; `Tenant`, `Subscription`, `TenantInvoice`, `TenantStatus` from `@cpatracker/types`; `Skeleton`, `StatusBadge`, `toast` from `@cpatracker/ui`; `useParams`, `useNavigate` from `react-router-dom`.
- Produces: `TenantDetail` component, reachable from `AllTenants`'s "View" button (Task 7).

- [ ] **Step 1: Create `src/pages/tenants/TenantDetail.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubscription, getTenant, getTenantInvoices, updateTenantStatus } from '@cpatracker/mock';
import type { Subscription, Tenant, TenantInvoice, TenantStatus } from '@cpatracker/types';
import { Skeleton, StatusBadge, toast } from '@cpatracker/ui';

const STATUS_VARIANT: Record<TenantStatus, 'success' | 'warning' | 'destructive' | 'neutral'> = {
  TRIAL: 'warning',
  ACTIVE: 'success',
  SUSPENDED: 'destructive',
  CANCELLED: 'neutral',
};

export function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<TenantInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    const [tenantRow, subscriptionRow, invoiceRows] = await Promise.all([
      getTenant(id),
      getSubscription(id),
      getTenantInvoices(id),
    ]);
    setTenant(tenantRow ?? null);
    setSubscription(subscriptionRow ?? null);
    setInvoices(invoiceRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status: TenantStatus) {
    if (!id) return;
    setUpdating(true);
    try {
      await updateTenantStatus(id, status);
      toast.success(`Tenant ${status.toLowerCase()}`);
      load();
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Tenant not found</h1>
        <button
          type="button"
          onClick={() => navigate('/tenants/all')}
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to Tenants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{tenant.companyName}</h1>
        <StatusBadge variant={STATUS_VARIANT[tenant.status]}>{tenant.status}</StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Contact</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.contactEmail}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Plan</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.plan}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Joined</p>
          <p className="text-sm font-medium text-card-foreground">{new Date(tenant.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Offers</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.offers}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Affiliates</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.affiliates}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Advertisers</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.advertisers}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Clicks</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.clicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Conversions</p>
          <p className="text-sm font-medium text-card-foreground">{tenant.usage.conversions.toLocaleString()}</p>
        </div>
      </div>

      {subscription && (
        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Subscription</h3>
          <p className="text-sm text-card-foreground">
            Status: <span className="font-medium">{subscription.status}</span> · Next billing:{' '}
            {new Date(subscription.nextBillingDate).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="space-y-2 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Invoices</h3>
        <ul className="divide-y divide-border">
          {invoices.length === 0 && <li className="py-2 text-sm text-muted-foreground">No invoices.</li>}
          {invoices.map((invoice) => (
            <li key={invoice.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-card-foreground">{invoice.period}</span>
              <span className="text-card-foreground">${invoice.amount.toFixed(2)}</span>
              <StatusBadge variant={invoice.status === 'PAID' ? 'success' : 'warning'}>{invoice.status}</StatusBadge>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        {tenant.status !== 'ACTIVE' && tenant.status !== 'CANCELLED' && (
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStatusChange('ACTIVE')}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Activate
          </button>
        )}
        {tenant.status === 'ACTIVE' && (
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStatusChange('SUSPENDED')}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Suspend
          </button>
        )}
        {tenant.status !== 'CANCELLED' && (
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStatusChange('CANCELLED')}
            className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire the `/tenants/:id` route in `App.tsx`**

Add the import:

```tsx
import { TenantDetail } from './pages/tenants/TenantDetail';
```

Replace `<Route path="/tenants/:id" element={<ComingSoon />} />` with:

```tsx
<Route path="/tenants/:id" element={<TenantDetail />} />
```

**Important ordering note:** in `App.tsx`, `/tenants/:id` must be declared **after** `/tenants/all` and `/tenants/create` (it already is, per Task 5's Step 22 ordering) — React Router matches routes in declaration order for overlapping static/dynamic segments in v6+/v7 `Routes`, but keeping specific static routes above the dynamic one avoids any ambiguity.

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter super-admin typecheck`
Expected: exits 0.

- [ ] **Step 4: Manual verification**

Run: `pnpm --filter super-admin dev`, go to "All Tenants", click "View" on any row. Confirm the detail page shows company name, status badge, contact/plan/joined/usage stats, a subscription line, an invoice list, and the correct action buttons for that tenant's current status (e.g. an `ACTIVE` tenant shows "Suspend" and "Cancel" but not "Activate"). Click "Suspend" (or "Activate"/"Cancel") and confirm a toast appears, the status badge updates, and the action buttons re-render for the new status. Navigate back to "All Tenants" and confirm the row's status column reflects the change. Stop the dev server after confirming.

---

### Task 10: Build the Billing screen

**Files:**
- Create: `frontend/apps/super-admin/src/pages/Billing.tsx`
- Modify: `frontend/apps/super-admin/src/App.tsx` (import), (route)

**Interfaces:**
- Consumes: `getPlans`, `getSubscriptions`, `getTenants`, `getTenantInvoices` from `@cpatracker/mock`; `Plan`, `Subscription`, `Tenant`, `TenantInvoice` from `@cpatracker/types`; `DataTable`, `StatusBadge` from `@cpatracker/ui`.
- Produces: `Billing` component, consumed only by `App.tsx`'s `/billing` route.

- [ ] **Step 1: Create `src/pages/Billing.tsx`**

```tsx
import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { getPlans, getSubscriptions, getTenantInvoices, getTenants } from '@cpatracker/mock';
import type { Plan, Subscription, Tenant, TenantInvoice } from '@cpatracker/types';
import { DataTable, StatusBadge } from '@cpatracker/ui';

export function Billing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invoices, setInvoices] = useState<TenantInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [planRows, subscriptionRows, tenantRows, invoiceRows] = await Promise.all([
      getPlans(),
      getSubscriptions(),
      getTenants(),
      getTenantInvoices(),
    ]);
    setPlans(planRows);
    setSubscriptions(subscriptionRows);
    setTenants(tenantRows);
    setInvoices(invoiceRows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const tenantName = (tenantId: string) => tenants.find((t) => t.id === tenantId)?.companyName ?? tenantId;

  const subscriptionColumns: ColumnDef<Subscription>[] = [
    { id: 'tenant', header: 'Tenant', accessorFn: (s) => tenantName(s.tenantId) },
    { accessorKey: 'plan', header: 'Plan' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          variant={row.original.status === 'ACTIVE' ? 'success' : row.original.status === 'PAST_DUE' ? 'warning' : 'neutral'}
        >
          {row.original.status}
        </StatusBadge>
      ),
    },
    {
      id: 'nextBillingDate',
      header: 'Next Billing',
      accessorFn: (s) => new Date(s.nextBillingDate).toLocaleDateString(),
    },
  ];

  const invoiceColumns: ColumnDef<TenantInvoice>[] = [
    { id: 'tenant', header: 'Tenant', accessorFn: (i) => tenantName(i.tenantId) },
    { accessorKey: 'period', header: 'Period' },
    { id: 'amount', header: 'Amount', accessorFn: (i) => `$${i.amount.toFixed(2)}` },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge variant={row.original.status === 'PAID' ? 'success' : 'warning'}>{row.original.status}</StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-medium text-muted-foreground">{plan.name}</h3>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">${plan.price}/mo</p>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Subscriptions</h2>
        <DataTable columns={subscriptionColumns} data={subscriptions} loading={loading} emptyState="No subscriptions." />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <DataTable columns={invoiceColumns} data={invoices} loading={loading} emptyState="No invoices." />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire the `/billing` route in `App.tsx`**

Add the import:

```tsx
import { Billing } from './pages/Billing';
```

Replace `<Route path="/billing" element={<ComingSoon />} />` with:

```tsx
<Route path="/billing" element={<Billing />} />
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter super-admin typecheck`
Expected: exits 0.

- [ ] **Step 4: Manual verification**

Run: `pnpm --filter super-admin dev`, navigate to "Billing". Confirm three plan cards (Starter $49/mo, Growth $199/mo, Enterprise $599/mo) with feature bullets, a Subscriptions table (tenant/plan/status/next billing) and an Invoices table (tenant/period/amount/status) both populated. Stop the dev server after confirming.

---

### Task 11: Final repo-wide verification

**Files:** none (verification only).

- [ ] **Step 1: Typecheck every workspace package/app**

Run (from `frontend/`): `pnpm -r typecheck`
Expected: all packages (`@cpatracker/types`, `@cpatracker/mock`, `@cpatracker/ui`, `super-admin`, `network-admin`, `affiliate`, `advertiser`) report success, no errors.

- [ ] **Step 2: Build the new app**

Run: `pnpm --filter super-admin build`
Expected: `tsc -b && vite build` completes, `dist/` is produced, no errors (a "chunk size" warning like the other apps show is fine — it's an existing, unrelated pattern, not a regression).

- [ ] **Step 3: Confirm no direct fixture imports**

Run (from `frontend/`): `grep -rn "data/tenants\|data/plans\|data/subscriptions\|data/tenantInvoices\|data/superAdmin" apps/super-admin/src`
Expected: no matches — every screen imports only from `@cpatracker/mock` (the package barrel), never a relative path into `packages/mock/src/data/*`.

- [ ] **Step 4: Full manual walkthrough**

Run: `pnpm --filter super-admin dev`. Click through, in order: Dashboard → All Tenants (search + both filters) → a tenant detail (Activate/Suspend/Cancel) → Create Tenant (submit, redirect) → Billing → Notifications (mark one read) → Profile → Logout → an invalid URL (confirm `NotFound` renders) → Settings (confirm `ComingSoon` renders, since it's intentionally out of v1 scope).
Expected: every screen renders real (mock) data with no console errors, loading skeletons appear briefly before data resolves, and visual style (dark theme, card borders, spacing) matches `network-admin`/`affiliate`/`advertiser`.
