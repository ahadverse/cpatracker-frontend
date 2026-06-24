# CLAUDE.md — Frontend Project Rules (read every session)

Building the CPA affiliate network UI first (all three portals), against a mock
data layer, backend later. Full scope in docs/frontend-plan.md.

---

## Stack (do not substitute)

- React + Vite + TypeScript
- shadcn/ui + Tailwind CSS
- recharts for charts
- Monorepo: pnpm workspaces
- Visual direction: Trakaff-style dark dashboard

---

## Monorepo structure

```
apps/admin  apps/affiliate  apps/advertiser
packages/ui      # shared shadcn components + dashboard primitives + theme
packages/mock    # typed mock data + async api layer (the backend swap point)
packages/types   # shared TS types (also used by the future backend)
packages/config  # tailwind preset, tsconfig, eslint
```

---

## The mock data layer (most important rule)

- ALL data flows through packages/mock/api functions. Components NEVER import
  fixtures directly.
- api functions are async and return Promises with types from packages/types, so
  swapping to real fetch later changes ONLY the function body — components untouched.
- Keep a USE_MOCK flag for gradual migration later.
- This discipline is what makes "UI now, backend later" work. Do not break it.

---

## Build order (do not reorder)

1. Monorepo + tooling.
2. packages/ui — theme tokens + shell + table + cards + chart + forms. FIRST.
3. packages/types + packages/mock — types + fixtures + api functions.
4. Admin app (screen by screen, menu order; Performance report LAST — hardest).
5. Affiliate portal.
6. Advertiser portal.
7. Polish.

Build packages/ui and packages/mock BEFORE any app screen, or you duplicate work.

---

## Component pattern

- Build shared primitives in packages/ui once: app shell (sidebar + topbar),
  data-driven sidebar nav, DataTable, StatCard, Chart, form primitives, tabs,
  status badges, modals/drawers, toasts.
- Each app passes its own menu config to the shared sidebar.
- Apps compose screens from shared primitives + the mock api. Keep app-specific
  code thin.

---

## Money visibility (mirror the real rule in UI now)

- Affiliate portal shows PAYOUT only. NEVER show revenue or profit anywhere in the
  affiliate app — not in dashboards, reports, or any column option.
- Admin shows revenue + payout + profit.
- Advertiser shows revenue they owe (their cost), their own offers' data only.
- This is enforced for real on the backend later; mirror it in the UI so screens
  are correct from the start.

---

## Menus (build the full structure)

- Admin: full menu — Offers (+sub-pages), Affiliates (+sub-pages), Advertisers,
  Managers, Reports (tabbed), Notifications, Settings, Billing, Dashboard.
- Affiliate: Dashboard, Offers (browse/request/link), Reports (payout-only),
  Payments, Messages, Referral, Profile + postback setup.
- Advertiser: Dashboard, Offers + performance, Conversions/reports, Postback setup,
  Billing, Messages, Profile.
- Reports tabs: Performance (group-by + toggleable columns), Clicks, Conversions
  (goal/txn id), Sub-ID Tracking, Postback Logs. Store/show 8 sub-IDs (S1–S8).

---

## Design rules

- Dark dashboard, restrained palette. Define theme tokens ONCE in packages/ui;
  derive every color from them. Don't hardcode colors in components.
- Lock the tokens on the first screen, then reuse.
- Quality floor: responsive to mobile, visible keyboard focus, reduced-motion
  respected, empty states and loading skeletons on data screens.
- Copy is plain and active: "Save changes" not "Submit"; name things by what the
  user controls, not how the system works.

---

## Process rules

- BEFORE building a unit: outline the components/screens and files, wait for
  approval, then implement. Always plan first on the shell, the mock layer, and the
  Performance report.
- ONE slice at a time (one primitive group, or one screen group). Not a whole app
  at once.
- Review the diff, commit working states.
- No browser storage APIs assumptions that break — keep state in React.
- When a rule here conflicts with a request, flag it before acting.
