# STATUS.md — Beyond Thesis

Last updated: 2026-05-16

## Current Phase: Phase 6 — Polish + Public Site ✓ COMPLETE

---

## Done

### Phase 1 ✓ — Foundation
### Phase 2 ✓ — Admin Core
### Phase 3 ✓ — Client Core
### Phase 4 ✓ — Staff Dashboards

### Phase 5 — Integrations ✓
- `src/lib/email.ts` — Resend client with 3 email functions:
  - `sendWelcomeEmail()` — fired on new client creation (includes temp password)
  - `sendPaymentReceiptEmail()` — fired on payment verified
  - `sendDeliverableApprovedEmail()` — fired on deliverable approved
  - Gracefully no-ops if `RESEND_API_KEY` not set (logs to console in dev)
- `src/lib/audit.ts` — `writeAuditLog()` helper via service role client
- Audit log writes added to: project create, deliverable upload/approve/send-back, payment verify/reject, stage advance
- Sentry: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- `next.config.ts` wrapped with `withSentryConfig`
- Sentry enabled only when `NEXT_PUBLIC_SENTRY_DSN` is set

## Required env vars to activate integrations

```
RESEND_API_KEY=re_...          # From resend.com — free up to 3000/month
RESEND_FROM=Beyond Thesis <noreply@beyondthesis.in>
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORG=your-org
SENTRY_PROJECT=beyond-thesis
```

## Phase 6 — Polish + Public Site ✓ (in progress)

- [x] `src/app/home/page.tsx` — public marketing site (hero, 3-stage explainer, pricing grid, specialty showcase, quote form, footer)
- [x] `src/components/home/quote-form.tsx` + `src/app/actions/quote.ts` — quote request form + email
- [x] `loading.tsx` skeletons — admin, client, writer, stats routes
- [x] `error.tsx` boundaries — admin, client, writer, stats routes
- [x] Mobile responsiveness pass — `px-4 sm:px-6` on all layouts/pages; 3-col grids tightened for narrow screens

## Phase 7 — QA + Deployment (in progress)

### Done (automated)
- [x] Security code audit — 5/5 checks pass (service role isolation, requireRole coverage, env leaks, 'use server' directives, no direct DB in client components)
- [x] `netlify.toml` — build config + security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [x] Git committed — 73 files, clean history

### Needs your hands (manual steps — see below)
- [ ] Run 16-point acceptance criteria (PRD Section 13) — test checklist below
- [ ] Push to GitHub → connect to Netlify
- [ ] Set env vars in Netlify dashboard
- [ ] Buy domain `beyondthesis.in` on GoDaddy
- [ ] Set up Cloudflare (free) — add domain, DNS, Email Routing
- [ ] Point GoDaddy nameservers to Cloudflare
- [ ] Add custom domain in Netlify + SSL auto-provision
- [ ] Soft launch with 5 trusted clients
