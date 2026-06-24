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

## Deferred polish (revisit later, not blocking forward progress)

- **Dashboard visual polish** — current Dashboard is functionally complete (real data, real layout)
  but not visually refined. Revisit once more screens exist and there's a clearer sense of the overall
  visual language to match across pages. Don't polish this screen in isolation.
- General empty states / loading skeletons / responsive sweep / theme-toggle persistence polish is
  explicitly Stage 6 in `CLAUDE.md`'s build order — not done per-screen as we go.

## Next up

- **Stage 3.2** — Offers screens: Create Offer, All Offers, Smart-Links, Offer Approvals.
- Then Stage 3.3 (Affiliates/Advertisers/Managers), 3.4 (Reports — Performance last, hardest), 3.5
  (Payments/Notifications/Settings), then Stage 4 (Affiliate portal), Stage 5 (Advertiser portal),
  Stage 6 (Polish — pick up the deferred items above here).
