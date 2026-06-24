# CPA Affiliate Network — Frontend-First Build Plan

Build all three UIs first (admin, affiliate, advertiser) against a mock data
layer, then swap in the real backend later. Stack: React + Vite + TypeScript,
shadcn/ui + Tailwind, Trakaff-style dark dashboard.

---

## 0. Approach & Why

- **UI first** so the whole product is visible and the flows are validated before
  backend work. The API shape becomes clearer once screens exist.
- **Mock data layer** is the key discipline: all data comes from one typed module
  that returns fake data now and real API calls later. Components never know the
  difference. Swapping to the real backend = changing the data layer only.
- **Monorepo** with three apps + shared packages, so the sidebar, tables, cards,
  and mock data aren't rebuilt three times.

---

## 1. Monorepo Structure

```
repo/
  apps/
    admin/         # admin panel (full menu)
    affiliate/     # affiliate portal
    advertiser/    # advertiser portal
  packages/
    ui/            # shared shadcn components + dashboard primitives
                   #   (sidebar, topbar, data-table, stat-card, chart, theme)
    mock/          # typed mock data + a data-access layer (the swap point)
    types/         # shared TypeScript types (Offer, Click, Conversion, ...)
    config/        # tailwind preset, tsconfig, eslint shared config
```

- Tooling: pnpm workspaces (or npm workspaces) + Turborepo optional.
- Each app is its own Vite project, imports from packages/\*.
- The dark theme + design tokens live once in packages/ui and packages/config.

---

## 2. The Mock Data Layer (the most important part)

This is what makes "UI now, backend later" clean.

```
packages/mock/
  data/            # static fixtures: offers.ts, affiliates.ts, conversions.ts ...
  api/             # functions that look like real API calls
                   #   getOffers(filters) -> Promise<Offer[]>
                   #   getConversions(range) -> Promise<Conversion[]>
  index.ts
```

Rules:

- Every screen calls these functions — never imports fixtures directly.
- Functions are async and return Promises (mimic network), so swapping to fetch
  later changes only the function body.
- Types come from packages/types and are shared with the future backend.
- Keep one flag (e.g. USE_MOCK) so you can flip an app to the real API per-endpoint
  during the later transition.

---

## 3. Shared UI Package (build once, use in all three)

Build these dashboard primitives in packages/ui first:

- App shell: collapsible sidebar + topbar (search, theme toggle, notifications,
  user menu) in the Trakaff dark style.
- Sidebar nav: grouped menu (MANAGE / ANALYSE / OTHERS) with submenus + active
  state. Menu config is data-driven so each app passes its own menu.
- DataTable: columns, sorting, pagination, row selection, filters bar, empty state.
- StatCard: the metric cards (label, value, delta).
- Chart: line/bar (performance chart) — recharts.
- Form primitives: inputs, selects, multi-select, date range, rich-text, toggles,
  file upload — themed.
- Tabs, badges (status pills), modals/drawers, toasts.

Theme: dark dashboard, restrained palette, matching the Trakaff reference. Define
tokens once (background, surface, border, text, accent, status colors).

---

## 4. Menus to Build (full structure, per app)

### Admin (full menu)

- MANAGE
  - Offers: Create, All Offers, CR Optimizer, Affiliate+Offer CR, Smart-Links,
    Offer Approvals
  - Affiliates: Create, All, Pending, Referral Program, Affiliate Groups,
    CR Optimizer, Affiliate Payments, All Affiliate Points, Affiliate Messages
  - Advertisers: Create, All, Pending, Advertiser Messages
  - Manager: Create, Affiliate Managers, Account Managers, General Managers,
    Manager Payments
- ANALYSE
  - Reports: Performance, Clicks, Conversions, Sub-ID Tracking, Postback Logs,
    Offer / Affiliate / Advertiser / Conversion / Advanced reports, Click Logs,
    Affiliate Postback Logs, Advertiser Postback Logs
- OTHERS
  - Notifications, Settings (System/Network/Preferences/Email/Login Logs/Network
    Usage), Billing, MarketPlace (deferred stub), Logout
- Dashboard: stat cards + performance chart + top offers/affiliates/advertisers +
  pending invoices

### Affiliate portal

- Dashboard (their stats only: clicks, conversions, payout — NO revenue/profit)
- Offers: browse, request access, get tracking link, smart-links
- Reports: Performance, Clicks, Conversions, Sub-ID Tracking, Postback Logs
  (payout-only money columns)
- Payments: their invoices + balance (payable vs pending)
- Messages, Referral program, Profile/settings, Postback/global postback setup

### Advertiser portal

- Dashboard (their offers' performance: clicks, conversions, revenue they owe)
- Offers: their offers + performance
- Conversions / reports for their offers
- Postback setup, Billing (what they owe), Messages, Profile/settings

---

## 5. Build Order (frontend)

1. **Monorepo + tooling** — workspaces, shared tsconfig/tailwind/eslint, three
   empty Vite apps that boot.
2. **Theme + UI primitives** — packages/ui: shell, sidebar, topbar, table, card,
   chart, forms, in the dark Trakaff style. This is the foundation; get it right.
3. **Mock data layer** — packages/mock + packages/types: fixtures + async api
   functions for offers, affiliates, advertisers, managers, clicks, conversions,
   reports, invoices, messages, notifications.
4. **Admin app** — screen by screen, in menu order:
   Dashboard → Offers (create + list + sub-pages) → Affiliates → Advertisers →
   Managers → Reports (tabbed; Performance builder last, it's hardest) →
   Payments/Billing → Notifications → Settings → Messages.
5. **Affiliate portal** — reuse shell + table + mock layer; build its narrower menu.
   Enforce payout-only money columns in the UI (the real rule is server-side later).
6. **Advertiser portal** — same, its menu.
7. **Polish** — empty states, loading skeletons, responsive, theme toggle,
   keyboard focus, toasts.

---

## 6. Transition to Backend (later, no UI rewrite)

When the backend exists:

- Replace the bodies of packages/mock/api functions with real fetch/axios calls to
  the API. Same function signatures, same return types → components untouched.
- Flip USE_MOCK per endpoint to migrate gradually.
- Wire real auth (login → JWT) in place of the mock session.
- The backend follows the original build-plan.md (engine-first) — the two plans
  meet at the typed api layer, since packages/types is shared by both.

---

## 7. What to Watch

- Build packages/ui and the mock layer BEFORE app screens, or you'll duplicate work.
- Keep components dumb about data source — always go through packages/mock/api.
- Money-visibility (affiliate sees payout only) is enforced for real on the backend
  later, but mirror it in the UI now so the screens are correct.
- The Performance report (dynamic group-by + toggleable columns) is the single
  hardest screen — leave it for last in the admin app.
- Don't over-invest in pixel-perfect Trakaff cloning early; get the shell + one
  screen right, lock the tokens, then the rest go fast.
