# Build Progress & Follow-ups

Tracks what's done, what's deferred, and open polish items to revisit later. Update this as stages
complete — check here before starting a new session so nothing gets lost.

## Done

- **Stage 0** — Monorepo skeleton (pnpm workspaces, packages/config, three Vite apps). Commit `656a118`.
- **Stage 1** — Theme tokens + full packages/ui primitive set (shell, table, cards, chart, forms,
  tabs, badges, modals/drawers, toasts). Commit `a05045d`.
- **Stage 2** — Mock data layer: packages/types entities + packages/mock fixtures/api functions,
  money-visibility enforced at the type level. Commit `8e07f77`.
- **Stage 3.1** — Admin routing (react-router-dom) + Dashboard screen (stat cards, trend chart, top-5
  lists, pending invoices), built entirely from Stage 2 mock functions. Commit `816a411`.
- **Stage 3.2** — Offers screens: All Offers (filterable DataTable + pause/resume), Create Offer (form),
  Offer Approvals (bulk approve/reject via row selection), Smart-Links (list + create modal). Added the
  first mock-layer mutations (`createOffer`, `updateOfferStatus`) and a new `SmartLink` type +
  mock data/api module. CR Optimizer and Affiliate+Offer CR (still `/offers/cr-optimizer` and
  `/offers/affiliate-offer-cr`, falling through to ComingSoon) deferred to fold in with Stage 3.4
  Reports work.
- **Stage 3.3** — Affiliates (All/Create/Pending), Advertisers (All/Create/Pending), Managers
  (All — one `AllManagers` component reused across the three kind-specific menu routes, filterable
  by kind — and Create). Added `createAffiliate`/`updateAffiliateStatus`,
  `createAdvertiser`/`updateAdvertiserStatus`, `createManager` mutations, plus named
  `AffiliateStatus`/`AdvertiserStatus` types. Deferred (overlap with later stages or are standalone
  features): Referral Program, Affiliate Groups, Affiliate/Advertiser/Manager Payments, Affiliate
  Points, Affiliate/Advertiser Messages.
- **Stage 3.4** — Reports: single tabbed `ReportsPage` (Performance, Clicks, Conversions, Sub-ID
  Tracking, Postback Logs — built in that order of difficulty, Performance last). Performance reuses
  the existing `getPerformanceReport` (group-by offer/affiliate/advertiser/geo/date) with a
  toggleable-columns `MultiSelect` (uniqueClicks/revenue/profit/crPercent/epc). Added a brand-new
  `PostbackLog` type + mock data/api (`getPostbackLogs`) since no postback entity existed yet. The
  five `/reports/*` menu routes all render `ReportsPage` with a different `initialTab`. Deferred (the
  narrower report variants in the menu): Offer/Affiliate/Advertiser/Conversion/Advanced Reports,
  Click Logs, Affiliate/Advertiser Postback Logs.
- **Stage 3.5** — Billing (`/billing`, all invoices across affiliate/advertiser/manager owners,
  status filter, mark-as-paid) and Notifications (`/notifications`, admin's own notifications,
  mark-as-read). Added `markInvoicePaid`/`markNotificationRead` mutations and exported `adminUser`
  from `@cpatracker/mock` (first stand-in for a current-user/session concept). Settings deferred
  entirely — no real data model exists yet for any of its sub-tabs (System/Network/Preferences/
  Email/Login Logs/Network Usage); revisit once there's a session/auth concept to hang it off.
- **Messages** — shared `MessagesPage` (thread list + `Drawer` conversation view + reply) reused for
  both `/affiliates/messages` and `/advertisers/messages`. Added `getMessageThreads` (derives
  participant name/role/unread count from the existing 1:1 admin↔user thread fixtures — no new
  fixtures needed), `sendMessage`, `markThreadRead` to the mock api. This was the last screen in
  frontend-plan.md's admin build order (Dashboard → ... → Settings → Messages); admin app is now
  feature-complete except for Settings.

## Stage 4 — Affiliate portal

- Added `react-router-dom` + `@tanstack/react-table` to `apps/affiliate` (previously just the
  Stage-1 `AppShell` placeholder, no router) and a `Shell.tsx` mirroring admin's.
- Added `demoAffiliate` export (first seeded affiliate, forced `ACTIVE`) from `@cpatracker/mock` as
  the current-user stand-in — same role `adminUser` plays for the admin app.
- **Dashboard** — payout-only stats (clicks/conversions/payout, no revenue/profit) via
  `getPerformanceReport({ role: 'AFFILIATE', affiliateId })`.
- **Offers** — single screen (browse approved offers + "Get tracking link" modal); folds in
  `/offers/request-access` and `/offers/tracking-link` rather than building a separate
  offer-access-approval entity from scratch. **Smart-Links** — read-only list + copy link.
- **Reports** — same 5-tab `ReportsPage` pattern as admin, scoped to the affiliate: `getClicks`/
  `getAffiliateConversions` filtered by `affiliateId`, Performance's column-toggle has no
  revenue/profit options (type-level money visibility — `AffiliateConversion` has no such fields).
  Postback Logs filtered client-side via the affiliate's own conversion IDs (no affiliate filter on
  `getPostbackLogs` itself).
- Deferred (same reasoning as the admin equivalents): Payments, Messages, Referral Program, Profile,
  Postback Setup — each needs a new entity or session concept not yet modeled.

## Stage 5 — Advertiser portal

- **Fixed a money-visibility bug** in `getPerformanceReport` (`packages/mock/src/api/reports.ts`):
  it only populated `revenue`/`profit` for `role === 'ADMIN'`, so an `ADVERTISER`-scoped call got
  `revenue: undefined` everywhere — breaking CLAUDE.md's "Advertiser shows revenue they owe" rule.
  Now `revenue` populates for `ADMIN` or `ADVERTISER`; `profit` stays `ADMIN`-only.
- Added `react-router-dom` + `@tanstack/react-table` to `apps/advertiser` and a `Shell.tsx`, plus a
  `demoAdvertiser` export (first seeded advertiser, forced `ACTIVE`) — same current-user stand-in
  pattern as `adminUser`/`demoAffiliate`.
- **Dashboard** — their offers' performance (clicks, conversions, revenue owed).
- **Offers + Performance** — one screen joining `getOffers({ advertiserId })` with
  `getPerformanceReport({ groupBy: 'offer', role: 'ADVERTISER', advertiserId })`, matching the flat
  menu item (not split into separate screens).
- **Conversions / Reports** — single screen (matches the flat menu item, not the 5-tab admin/
  affiliate pattern) over `getAdvertiserConversions` (type has revenue, no payout/profit).
- **Billing** — their invoices with a "Pay now" action (reuses `markInvoicePaid`).
- Deferred (same reasoning as elsewhere): Postback Setup, Messages, Profile.

## Stage 6 — Polish (partial: UI polish pass)

Scoped to the UI-quality items from CLAUDE.md's quality floor, not the deferred feature screens
(those remain queued — see below).

- **Loading skeletons** — added a `Skeleton` primitive (`packages/ui`) and a `loading` prop on
  `DataTable` (renders skeleton rows instead of requiring every screen to hand-roll
  `emptyState={loading ? 'Loading...' : ...}`). Updated all ~22 `DataTable` call sites across all
  three apps to use it. Added matching skeleton placeholders to the 3 dashboards, admin
  Notifications, and admin Messages (previously `if (!data) return null` or a bare "Loading..." string).
- **Light theme** — `theme.css` had no `.light` block, so the existing Topbar toggle button was a
  no-op (it switched a CSS class but nothing rendered differently). Added a real `.light` token set.
- **Responsive sidebar** — `AppShell` now renders the sidebar as a `fixed` overlay with a backdrop
  on screens below `md`, toggled by a new hamburger button in `Topbar` (`onMenuClick`); unchanged
  (static, collapsible-width) on `md+`. Navigating closes the mobile overlay automatically.
- **Reduced motion** — global `@media (prefers-reduced-motion: reduce)` rule in `theme.css` collapses
  all transitions/animations to near-zero duration.
- **Keyboard focus audit** — added missing `focus-visible` rings across `Topbar` (theme/notification/
  user-menu/hamburger buttons), `Sidebar` (nav items, collapse toggle), `DataTable` (sort headers,
  pagination), `Tabs` triggers, `MultiSelect` option items, `Modal`/`Drawer` close buttons, and the
  many ad-hoc action buttons across screens (pause/resume, approve/reject, mark-as-paid/read, create
  submit buttons, copy-link buttons) that had hover states but no focus state.
- Not done this round (still open from the original Stage 6 scope): empty-state content review
  (the skeleton work above didn't touch the actual empty-result messaging) and a full mobile
  layout/overflow sweep beyond the sidebar (e.g. wide `DataTable`s on narrow viewports rely on
  existing `overflow-x-auto` but haven't been checked screen-by-screen).

## Backlog clearout — all remaining ComingSoon screens (28 routes across 3 apps)

Filled in everything that previously fell through to the `ComingSoon` placeholder, across admin,
affiliate, and advertiser. New mock-layer additions that made this possible:

- `PerformanceGroupBy` gained `'affiliate-offer'` (compound `${affiliateId}::${offerId}` grouping) —
  powers Affiliate+Offer CR and Advanced Reports.
- `Affiliate`/`Advertiser` types gained `postbackUrl?: string`; added
  `updateAffiliateProfile`/`updateAdvertiserProfile`, `updateAffiliatePostbackUrl`/
  `updateAdvertiserPostbackUrl`, `adjustAffiliatePoints`.
- New `AffiliateGroup` type + `getAffiliateGroups`/`createAffiliateGroup`.
- New `NetworkSettings` singleton type + `getNetworkSettings`/`updateNetworkSettings` — backs the
  admin Settings Preferences/Network/Email tabs (no session/auth concept needed since these are
  network-wide, not per-user).
- New `packages/mock/src/api/users.ts`: `getLoginLogs()` merges all four user arrays (admin,
  affiliates, advertisers, managers) with resolved display names.
- `messages.ts`: generalized `sendMessage`/`markThreadRead` to take an explicit sender/viewer
  (defaulting to `adminUser` so existing admin call sites are unchanged), and added `getOwnThread(userId)`
  so the affiliate/advertiser side of an admin↔participant thread can be fetched without knowing
  the threadId — derives it from existing messages or generates one deterministically if none exist.

**Admin** (19 screens): Offers CR Optimizer + Affiliate+Offer CR; Affiliates Referral Program,
Groups (new entity, list + create modal), CR Optimizer, Payments, Points (+/-100 adjust); Managers
Payments; 8 narrower Report variants (Offer/Affiliate/Advertiser/Conversion/Advanced Reports, Click
Logs, Affiliate/Advertiser Postback Logs) — all implemented as `ReportsPage`/`PerformanceTab`/
`PostbackLogsTab` with new `initialGroupBy`/`lockGroupBy`/`dimension` props rather than new files;
Settings (6 tabs: Preferences, Network, Email, System (static info), Login Logs, Network Usage);
Logout (stand-in screen, no real session to clear).

**Affiliate portal** (6 screens): Payments (balance + invoice list), Messages (own thread via
`getOwnThread`), Referral Program (own referral link + referred-affiliates list), Profile, Postback
Setup, Logout.

**Advertiser portal** (4 screens): Postback Setup, Messages, Profile, Logout.

`MarketPlace` (admin) intentionally left as `ComingSoon` — `frontend-plan.md` explicitly calls it a
deferred stub, not a real gap.

`pnpm -r build` clean across all three apps; every one of the 28 routes verified serving 200 with
clean module transforms via each app's dev server.

## Fix: affiliate Offers screens were duplicates, not real screens

Stage 4's "fold Request Access and Tracking Link into one Offers screen" shortcut meant all three
sidebar items (`/offers/browse`, `/offers/request-access`, `/offers/tracking-link`) rendered the
identical component — flagged as a bug, since the sidebar visibly showed three distinct menu items
leading to the same page. Replaced with a real per-offer access-request workflow:

- New `OfferAccessRequest` type (`offerId`, `affiliateId`, `status: PENDING|APPROVED|REJECTED`) +
  mock data (seeded per-affiliate with a realistic mix of statuses) + api (`getOfferAccessRequests`,
  `requestOfferAccess`, `updateOfferAccessRequestStatus`).
- **Browse Offers** — all approved offers, with a "Request access" button per offer (or a status
  badge once requested).
- **Request Access** — the affiliate's own request history with status.
- **Tracking Link** — only offers with an `APPROVED` request show here, each with "Get tracking
  link". Deleted the old combined `Offers.tsx`.
- Added the admin-side counterpart so requests are actually resolvable: **Access Requests**
  (`/offers/access-requests`, new menu item under Offers) — bulk approve/reject, same pattern as
  Offer Approvals.

`pnpm -r build` clean; all 4 new/changed routes (3 affiliate + 1 admin) verified serving 200.

## Fix: catch-all route showed "not built yet" for paths that aren't even in this app

Each app's `path="*"` fallback rendered `ComingSoon` ("This screen isn't built yet") for *any*
unmatched path — including a foreign route from a different portal (e.g. visiting the admin-only
`/affiliates/all` on the affiliate app). That's misleading: "not built yet" implies the screen is
planned for this app, when the path doesn't belong to this portal at all. Split the two cases:

- New `NotFound.tsx` per app ("404 — Page not found", portal-specific copy, link back to Dashboard)
  now handles the `path="*"` catch-all in all three apps.
- Admin's `ComingSoon` is now used only for the one screen that's genuinely a deliberate stub —
  `/marketplace` got its own explicit route (`frontend-plan.md` calls it out as a deferred stub by
  design). Deleted `ComingSoon.tsx` from the affiliate and advertiser apps since neither has any
  intentionally-stubbed screens left.

`pnpm -r build` clean; verified `/affiliates/all` on the affiliate app now hits `NotFound`, and
`/marketplace` on admin still hits `ComingSoon`.

## Sidebar polish + advertiser screen split + advertiser Create Offer

Three UI/UX fixes from a screenshot-driven review:

- **Sidebar user footer** — added `userName`/`userRole` to `Sidebar`/`AppShell` (avatar initials +
  name + role, above the collapse toggle). Each app's `Shell.tsx` now passes the demo persona's real
  name (`demoAffiliate.name`/`demoAdvertiser.name`/"Admin User").
- **Advertiser screens were combined under "+"/"/ " names** (`Offers + Performance`,
  `Conversions / Reports`) — split into real separate pages: **Offers** (management list, status,
  payout rate — no longer mixes in performance numbers), **Performance** (dedicated report,
  group-by offer/geo/date), **Conversions** (renamed from the "/ Reports" half, which was always
  just a conversions table). Deleted old `Offers.tsx`/`Reports.tsx`.
- **Advertisers had no way to create an offer** — added `/offers/create` (mirrors admin's
  `CreateOffer` minus the advertiser picker, fixed to `demoAdvertiser.id`). Submitted offers land as
  `PENDING` and go through the existing admin Offer Approvals queue — no new entity needed, reused
  `createOffer`. `Offers` menu item is now a parent with `All Offers`/`Create Offer` children,
  matching the admin/affiliate Offers submenu pattern.

`pnpm -r build` clean; all new/changed advertiser routes (`/offers`, `/offers/create`,
`/performance`, `/conversions`) verified serving 200 with clean module transforms.

## Deferred polish (revisit later, not blocking forward progress)

- **Dashboard visual polish** — current Dashboard is functionally complete (real data, real layout)
  but not visually refined. Revisit once more screens exist and there's a clearer sense of the overall
  visual language to match across pages. Don't polish this screen in isolation.
- Remaining Stage 6 polish: empty-state content review, full mobile/overflow sweep beyond the
  sidebar.

## Create Offer rebuilt to match a full real-world CPA network reference

Reference screenshot (Trakaff-style "Topcpaoffers" Create Offer page) showed a much richer form
than ours — rebuilt both admin's and advertiser's Create Offer pages to match it section-by-section,
which required expanding the core `Offer`/`PayoutRule` types significantly.

**Type changes** (`packages/types/src/offer.ts`):
- `Offer.payoutRule: PayoutRule` → `Offer.payoutRules: PayoutRule[]` (offers can now have multiple
  payout rules, each independently targeted). Fixed every existing read site
  (`offer.payoutRule.amount` → `offer.payoutRules[0]?.amount ?? 0`) across admin/advertiser/affiliate
  `AllOffers`/`OfferApprovals`/`BrowseOffers`/`TrackingLink`, plus the `conversions.ts` fixture.
- `PayoutRule` gained: `payoutMode` (CPA/CPC/CPL/CPI/CPS), `payoutType` (Flat/Percentage),
  `revenueModel`/`revenueAmount` (separate from payout), `targeting` (countries/devices/affiliateIds/
  affiliateGroupIds — empty array = ALL), `managerCommissionPercent`, `referAffiliateCommissionPercent`.
  Dropped per-rule `dailyCap`/`totalCap` — caps moved to the offer level instead (see below).
- `TrafficType` expanded from 6 values to the full 27-item checklist from the reference (Banner
  Display, Brand Context AD, ClickUnder/PopUnder, ... Youtube). Display sites format the enum value
  (`SOCIAL_MEDIA` → "Social Media") rather than showing raw codes.
- `Offer` gained: `previewLink`, `description`/`kpi` (rich text), `category`, `iconUrl`, `startDate`/
  `endDate`, `currency`, `trackingPlatform`, `featured`, `networkOfferId`, `autoApproveConversions`,
  `allowDeepLinking`, `remarksForAdmin`/`remarksForAffiliateManager`, `caps: OfferCap[]`.
  `OfferStatus` gained `DELETED`.
- New `OfferCap` type (`period`/`metric`/`limit`) for the "Cap Limit Options" section.
- New managed category list: `getOfferCategories`/`createOfferCategory` (mirrors the reference's
  "+ Add Category" inline-create).

**New screens/components** (mirrored in both `apps/admin/src/pages/offers/` and
`apps/advertiser/src/pages/offers/`, each under a `create/` subfolder — `constants.ts`,
`PayoutRuleModal.tsx`, `ImportOffersModal.tsx`; admin also gets `NewAdvertiserModal.tsx`):
- Reuses existing primitives (`RichText` for description/KPI, `FileUpload` for the icon,
  `Toggle` for Featured/Advanced options) rather than inventing new ones.
- Payout Settings section supports multiple rules (add/edit/copy/remove), each opening
  `PayoutRuleModal` with full targeting (affiliates via `getAffiliates`, affiliate groups via
  `getAffiliateGroups`).
- "+ New Advertiser" (admin only) opens an inline quick-create modal (`createAdvertiser`) so you
  never have to leave the form.
- "Import Offers" (both apps) opens a CSV import modal — naive client-side parsing (no quoted-comma
  support, proportionate to a mock-data feature), bulk-creates offers via `createOffer`.
- Admin can set Offer Status directly on create (Active/Pause/In-Active/Deleted →
  APPROVED/PAUSED/PENDING/DELETED) since admin already has approval authority — no pointless
  self-approval. Advertiser-created and CSV-imported offers always start `PENDING` and flow through
  the existing admin Offer Approvals queue.
- Small correctness fix made along the way: `createOffer`'s input now accepts an optional `id`, so
  the `trackingLink`/`payoutRule.offerId` built before submission actually match the stored offer's
  real ID (previously they referenced a different, never-persisted ID).

**Skipped from the reference**: nothing — both "+ New Advertiser" and "Import Offers" were
explicitly requested and included.

`pnpm -r build` clean across all three apps; `/offers/create` verified on both admin and advertiser
with clean module transforms.

## Topbar: real notifications dropdown, profile link, search removed

- **Removed the search input** from `Topbar` — it never did anything (`onSearch` had no consumer
  anywhere in any app).
- **Notification bell is now functional** — was a static badge with a hardcoded count
  (`notificationCount={3}`/`1`/`0` per app, not even reading real data) and no click behavior.
  `Topbar` now takes a `notifications: Notification[]` prop and renders a real dropdown (unread dot,
  relative timestamp, "No notifications yet" empty state); unread count badge is derived from the
  array instead of being a separate hand-set number. Each app's `Shell.tsx` fetches via the existing
  `getNotifications(userId)` (admin: `adminUser.id`, affiliate/advertiser: `demoAffiliate.userId`/
  `demoAdvertiser.userId` — real per-app data, not a shared sample) and marks-read on click via
  `markNotificationRead`. Admin's dropdown gets a "View all" link to its existing `/notifications`
  page; affiliate/advertiser don't have one, so it's omitted there.
- **User dropdown gained a "Profile" item** above "Log out". Affiliate/advertiser already had
  `/profile`; added a minimal admin `/profile` (name/email/status header + password change, same
  pattern as the other two) since the dropdown needed somewhere to go.
- Also fixed: **"Log out" was wired to nothing in any app** (`onLogout` was never passed to
  `AppShell`) — now navigates to each app's `/logout` stand-in screen.

`pnpm -r build` clean across all three apps; admin's new `/profile` verified serving 200.

## Next up

- All menu items across all three apps now resolve to a real screen (except the intentional
  MarketPlace stub). Frontend build is essentially complete relative to `frontend-plan.md`.
- Remaining work is genuinely deferred polish (above) and, eventually, Stage 7: swapping
  `packages/mock/api` function bodies for real backend calls per `CLAUDE.md`'s transition plan.
