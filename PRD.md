# Beyond Thesis — PRD for Claude Code

> **You are building this product. Read this file at the start of every session. When you complete a task, update STATUS.md. When you discover an ambiguity, ask before deciding.**

---

## 0. AI INSTRUCTIONS — READ FIRST

### Your role
You are the engineering team for **Beyond Thesis**, a thesis support portal for postgraduate medical students in India. The product owner is **Dr. Shoraf P** (BEDRICK / Beyond Research Unit). He is a domain expert (medical education, research methodology) but is **not a software engineer**. Speak to him plainly. Avoid jargon unless you explain it. Treat him as the CEO, not the CTO.

### How you operate

1. **Always read this file first** at the start of every session. If a `STATUS.md` exists in the project root, read that too — it tells you what's done.
2. **Never start coding without confirming the task.** Restate what you're about to build in 2 sentences, then ask "shall I proceed?"
3. **Commit to git after every meaningful milestone** with a clear message. If git isn't initialized, initialize it.
4. **Update STATUS.md after every completed task** — mark what's done, what's broken, what's next.
5. **Update IDEAS_V2.md (create if missing)** when the user proposes a new feature mid-build. Do NOT add features to v1 scope without explicit approval.
6. **If you hit ambiguity, ask one focused question** — never guess on architecture, security, or pricing logic.
7. **Never expose secrets.** API keys, database passwords, service-role keys go in `.env.local` only — never in code, never in chat, never in commits. Use `.gitignore`.
8. **Test as you build.** After each feature, write a 1-paragraph test plan in chat: "to verify this works, do X, Y, Z."
9. **Prefer boring tech.** When in doubt, use the simplest solution that works. No clever abstractions.
10. **Match the design aesthetic.** Calm, professional, slate/neutral palette. Linear/Stripe references, NOT Bootstrap defaults.

### Hard rules (never break these)

- **Security model is non-negotiable.** Row-Level Security (RLS) on every table. Three permission layers (middleware + server actions + RLS). Never disable RLS to "make things work."
- **Admin approval gate is non-negotiable.** Clients never see a deliverable until admin approves it. Drafts are invisible to clients.
- **Payment gate is non-negotiable.** Stage 3 final draft download is blocked until balance is verified.
- **File naming convention is enforced by the system, not the user.** Pattern: `ClientName_WorkDone_BEDRICK_V[n]`. Auto-version on upload.
- **Mobile must work.** Every page works on a 5-inch phone screen. Tables collapse to cards. Modals slide from bottom.
- **No bright colors. No gradients. No decorative animation.** This is medical software for stressed professionals.

### What "done" means

A feature is done when:
1. It works for the happy path.
2. It handles the obvious failure cases (no data, no session, no permission).
3. RLS is enforced (verified by trying to access another user's data while logged in as a client).
4. It works on mobile.
5. STATUS.md is updated.
6. Code is committed to git.

---

## 1. PRODUCT IN ONE PARAGRAPH

Beyond Thesis is a login-protected web portal for thesis support services. Postgraduate medical students (clients) log in to see live progress on their MD/MS thesis, download approved chapters, raise structured corrections, and pay via UPI. Admin (Dr. Shoraf) sees all projects and approves all deliverables before clients see them. Content writers and statisticians log in to see only the projects assigned to them. The product replaces a chaotic WhatsApp + Excel + email workflow with a clean, auditable, scalable system.

---

## 2. THE FOUR USERS

| Role | Who | Sees | Can do |
|------|-----|------|--------|
| **Admin** | Dr. Shoraf (1 person) | Everything | Create projects, assign staff, approve deliverables, verify payments, advance stages |
| **Writer** | Content writers (1–3 people) | Only assigned projects | Upload chapter drafts (Intro, RoL, Discussion etc.), submit for review |
| **Stats** | Statisticians (1–2 people) | Only assigned projects | Upload datasets, tables, charts, R/Python scripts, submit for review |
| **Client** | PG medical students (200+) | Only their own thesis | View progress, download approved files, raise corrections, pay UPI |

**Critical rule:** A client never sees another client's data. A writer never sees a project they're not assigned to. This is enforced at the database level via RLS, not just in the UI.

---

## 3. THE 3-STAGE WORKFLOW

Every thesis project moves through three sequential stages, in this exact order:

### Stage 1 — Results
- Master dataset (CSV/Excel)
- All tables (formatted)
- All charts
- R or Python verification script
- Results chapter (DOCX)

### Stage 2 — Intro + RoL + M&M
- Introduction.docx
- ReviewOfLiterature.docx
- MaterialsAndMethods.docx

### Stage 3 — Discussion + Conclusion + Final
- Discussion.docx
- Conclusion.docx
- References list
- Annexures (consent form, proforma, ethics clearance, master chart)
- Final compiled thesis DOCX

**Stage rules:**
- Stages cannot be skipped or reordered.
- Only admin can advance a project from one stage to the next.
- To advance, ALL deliverables in the current stage must be approved.
- Client cannot see Stage 3 final draft until balance is paid.

---

## 4. PRICING & PAYMENT

### Tiers

| Tier | Total | Advance | Balance |
|------|-------|---------|---------|
| Standard | ₹16,000 | ₹8,000 | ₹8,000 |
| Special | ₹15,000 | ₹8,000 | ₹7,000 |
| Super | ₹12,500 | ₹8,000 | ₹4,500 |
| Custom | Variable | ₹8,000 | Variable |

**Advance is fixed at ₹8,000 across all tiers.** Discount comes off the balance only.

### Payment flow (UPI manual verification for v1)

1. Client clicks "Pay now" → modal opens with UPI QR + UPI ID + copy button.
2. Client pays from PhonePe / GPay / Paytm.
3. Client submits 12-digit UTR + payment screenshot in the modal.
4. Status changes to "Submitted — awaiting verification."
5. Admin sees pending payment, opens bank app, matches UTR, clicks Verify.
6. Status → Verified. Receipt PDF generated. Client emailed.
7. If balance payment: `projects.is_balance_paid = true`, Stage 3 final draft unlocks.

### Payment gating

- **No advance paid** → client sees nothing (no deliverables visible).
- **Advance verified** → Stage 1 + Stage 2 deliverables release as admin approves them.
- **Balance verified** → Stage 3 final draft becomes downloadable.

---

## 5. TECH STACK (LOCKED — DON'T DEVIATE)

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 15+ (App Router)** + **TypeScript** |
| Styling | **Tailwind CSS** + **shadcn/ui** + **lucide-react** |
| Database | **Supabase Postgres** (Mumbai region) |
| Auth | **Supabase Auth** via `@supabase/ssr` |
| File storage (v1) | **Supabase Storage** (private bucket: `thesis-files`) |
| File storage (v1.5 — when storage > 800 MB) | **Cloudflare R2** |
| Email — outbound | **Resend** (free up to 3000/month) |
| Email — inbound | **Cloudflare Email Routing** (free, forwards to Gmail) |
| Hosting | **Netlify** (v1) → **Cloudflare Pages** (v1.5) |
| DNS | **Cloudflare** |
| Domain | **GoDaddy** (registration only) — likely `beyondthesis.in` |
| Error tracking | **Sentry** (free tier) |
| Analytics | **Cloudflare Web Analytics** (free) |
| Payments (v1) | **UPI QR + manual UTR verification** |
| Payments (v2) | **Razorpay** |

**Total monthly cost for v1:** ₹0 infrastructure + ₹800/year domain.

### Environment variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...   # SERVER ONLY, NEVER BROWSER
NEXT_PUBLIC_APP_URL=https://beyondthesis.in
UPI_ID=bedrick@oksbi
UPI_QR_URL=https://...   # uploaded once to storage
RESEND_API_KEY=re_...
RESEND_FROM=Beyond Thesis <noreply@beyondthesis.in>
NEXT_PUBLIC_SENTRY_DSN=https://...
```

---

## 6. DATABASE SCHEMA (10 TABLES)

### Tables

| Table | Purpose |
|-------|---------|
| `users` | All 4 roles. Linked 1:1 with `auth.users`. Has `role` enum, `is_active` bool, full_name, email, phone. |
| `projects` | One row per thesis. `client_id`, title, specialty, study_design, sample_size (N), college, university, guide_name, submission_deadline, `tier`, `total_amount`, `advance_amount` (default 8000), `balance_amount` (computed), `current_stage` (1/2/3), `stage_status`, `is_balance_paid`, `status`. |
| `assignments` | Many-to-many. `project_id`, `user_id`, `role_on_project` (writer/stats). `UNIQUE(project_id, role_on_project)` — one writer + one stats per project. |
| `deliverables` | Every uploaded file. `project_id`, `uploader_id`, `stage`, `chapter` enum, `filename`, `file_url`, `version`, `status` enum (draft / submitted_for_review / approved / revision_requested), `admin_notes`, `approved_by`, `approved_at`. |
| `correction_requests` | DONE/NOT DONE/DOUBTS thread per project. `raised_by`, `deliverable_id` (nullable), title, `category`, body, `status` (open/in_progress/resolved/declined). |
| `correction_attachments` | 0–3 files per correction. PNG/JPG/PDF only, max 5 MB. |
| `payments` | UPI payment with proof. `project_id`, `amount`, `payment_type` (advance/balance/custom), `utr_number`, `screenshot_url`, `submitted_by`, `status` (submitted/verified/rejected), `verified_by`, `verified_at`. |
| `messages` | Per-project chat thread. `project_id`, `sender_id`, body, `is_read`. |
| `notifications` | In-app + email triggers. `user_id`, title, body, link_to, `is_read`. |
| `audit_log` | Every action timestamped. `user_id`, action, entity_type, entity_id, details JSONB, ip_address. Server-side writes only. |

### Enums

```sql
user_role: admin | writer | stats | client
project_tier: standard | special | super | custom
project_status: active | completed | on_hold | cancelled
stage_status: in_progress | completed
assignment_role: writer | stats
deliverable_status: draft | submitted_for_review | approved | revision_requested
deliverable_chapter: master_dataset | tables | charts | results |
                     introduction | review_of_literature | materials_and_methods |
                     discussion | conclusion | references | annexures | final_draft |
                     r_script | python_script | other
correction_category: done | not_done | doubts
correction_status: open | in_progress | resolved | declined
payment_type: advance | balance | custom
payment_status: submitted | verified | rejected
```

### Common rules across all tables

- Every table has `id uuid primary key default uuid_generate_v4()`.
- Every table has `created_at timestamptz default now()`.
- Mutable tables also have `updated_at timestamptz default now()` with auto-update trigger.
- Foreign keys use `on delete restrict` (prevents accidental orphaning).
- `users.id` references `auth.users(id) on delete cascade`.

### Helper function (required for RLS)

```sql
create or replace function current_user_role()
returns user_role as $$
  select role from public.users where id = auth.uid()
$$ language sql stable security definer;
```

---

## 7. SECURITY MODEL (3 LAYERS)

### Layer 1: Middleware

File: `middleware.ts` at project root. Intercepts requests to `/admin/*`, `/writer/*`, `/stats/*`, `/client/*`:
- No session → redirect to `/` with `?redirected=1`.
- Wrong role for path → redirect to user's own dashboard.

### Layer 2: Server actions

Every mutating action (approve, verify, upload, delete) starts with `requireRole('admin')` (or appropriate). The helper checks session + role match + `is_active`. Throws 403 / redirects on mismatch.

### Layer 3: Row-Level Security (database-level, the most important)

| Table | Policies |
|-------|----------|
| `users` | Admin: full. Self: read own row. |
| `projects` | Admin: full. Client: read own. Writer/Stats: read where assigned. |
| `assignments` | Admin: full. Self: read own. |
| `deliverables` | Admin: full. Client: read where `status=approved` AND own project AND (`stage<3` OR `is_balance_paid`). Writer/Stats: full on assigned. |
| `correction_requests` | Admin: full. Client: full on own project. Staff: read on assigned. |
| `correction_attachments` | Follows parent correction. |
| `payments` | Admin: full. Client: full on own project. |
| `messages` | Admin: full. Project participants: full on their project. |
| `notifications` | Self only. |
| `audit_log` | Admin only. Server-side writes via `service_role` key. |

### Storage bucket policies (`thesis-files`)

- Admin: full read/write.
- Writer/Stats: read/write across projects.
- Clients: insert ONLY into `payments/{projectId}/{userId}/*` and `corrections/{projectId}/{correctionId}/*`.
- Clients: read ONLY own payment files, own corrections, and approved deliverables for their own projects.
- Public read: **never**.

### Test before declaring security done

Log in as a client. Try these:
1. Visit `/admin` → must redirect.
2. Try to fetch `projects?client_id=eq.[other_client_uuid]` via Supabase API → must return 0 rows.
3. Try to download another client's file via direct URL → must return 403.
4. Try to download a Stage 3 deliverable without balance paid → must return 403.

If any test fails, security is broken. Fix before continuing.

---

## 8. THE PAGES (BUILD IN THIS ORDER)

### 8.1 `/` — Login page

- Centered card. "Beyond Thesis" heading + "Beyond Research Unit · Thesis Support Portal" subtitle.
- Email + password fields. "Sign in" button. "Forgot password?" link.
- On success → fetch `users.role` → redirect to `/admin`, `/writer`, `/stats`, or `/client`.
- `is_active = false` → sign out immediately with "Account disabled" banner.
- Wrong credentials → "Invalid email or password." (don't reveal which).

### 8.2 `/admin` — Admin pipeline

- Header + Sign out.
- 4 metric cards: Active projects · Pending approval · Outstanding balance · Payments to verify.
- "Projects pipeline" section: search bar (debounced 300ms) + 4 filter dropdowns (Stage, Specialty, Tier, Status) + "+ New project" button.
- Table: Title · Client · Specialty · N · Tier badge · Stage badge · Balance paid · Total amount · Last update.
- Click row → `/admin/projects/[id]`.
- Default sort: `updated_at desc`. All columns sortable.
- Empty state: "No projects yet. Click + New project to add your first one."

### 8.3 `/admin/projects/[id]` — Project workspace

- Breadcrumb: ← Pipeline / [Project title].
- Header card: title, meta (client · specialty · study design · N · college · university), tier badge, status badge, Edit button.
- Stage tracker: 3 boxes side-by-side with status pills (Completed / In progress / Awaiting next stage / Locked). Active stage gets a ring.
- 5 tabs:
  - **Deliverables** — grouped by stage. Per row: chapter, version, status, uploader, date, Approve/Send back buttons. "+ Upload deliverable" per stage. Yellow banner under Stage 3 if balance unpaid.
  - **Corrections** — list of correction cards with category badge, body, raised_by, status, attachments inline.
  - **Payments** — summary line + table with UTR, screenshot link, Verify/Reject buttons.
  - **Messages** — chat thread.
  - **Activity** — audit_log entries.

### 8.4 `/admin/projects/new` — New project form

- Section 1 — Client: search existing OR "+ Create new client" (name, email, phone). Creating new → auto-creates auth user + emails temporary password via Resend.
- Section 2 — Project: title, specialty (dropdown + free text), study design, N, college, university, guide name, submission deadline.
- Section 3 — Pricing: tier radio. Custom shows total_amount input. Advance auto-fills ₹8,000.
- Section 4 — Team: writer + stats dropdowns (optional).
- On submit → insert users (if new), projects, assignments. Redirect to new project workspace.

### 8.5 `/writer` and `/writer/projects/[id]`

- Same scaffolding as admin but scoped to assigned projects only via RLS.
- Metric cards: My projects · Drafts in progress · Submitted for review · Revision requested.
- Project workspace shows tabs but no Approve/Verify buttons. Can submit-for-review only.

### 8.6 `/stats` and `/stats/projects/[id]`

- Same as writer but tab focus is Stage 1 (datasets, tables, charts, scripts).

### 8.7 `/client` — The magic page

This is THE page. Get it right.

- Header + client name + "Client" pill.
- **Hero card**: thesis title (big), meta line, large "Stage X of 3" indicator, friendly status line, horizontal 3-segment progress bar.
- **3 stage cards**: each with status pill, mini-list of approved deliverables (chapter name + Download button). Empty: "Your team is working on this."
- If Stage 3 locked due to unpaid balance: **amber banner** "Final draft will be released after balance payment is verified. → Pay now"
- **Payment card**: Total / Paid / Outstanding. Advance row + Balance row each with Pay now button if unpaid.
- **Pay now modal**: UPI QR image, UPI ID with copy button, 12-digit UTR field, screenshot upload (PNG/JPG, max 5MB), Submit.
- After submit: blue banner "✓ Payment submitted, awaiting verification (usually within 24h)."
- **Corrections panel**: list of correction cards + "+ Raise a correction" button → modal (title, category dropdown DONE/NOT DONE/DOUBTS, body textarea, up to 3 attachments PNG/JPG/PDF max 5MB each).
- **Messages thread** with admin.
- **Collapsible "Project details"** at bottom (read-only meta).

### 8.8 `/home` — Public marketing site (no login)

- Hero: "Never wonder where your thesis stands." + CTA "Get a quote."
- 3-stage explainer with icons.
- Pricing card grid (Standard / Special / Super).
- Specialty showcase (anonymized examples).
- Testimonials wall (empty for v1, fill post-launch).
- "Get a quote" form → emails admin via Resend.
- Footer: contact, FAQ, privacy.

---

## 9. THE 7 KEY WORKFLOWS

### W1 — Onboarding a new client
Admin clicks "+ New project" → fills form → system creates auth user + sends welcome email → client receives email with temp password → client logs in → sees thesis with locked stages → banner says "Pay ₹8,000 advance to begin."

### W2 — Client pays advance
Client clicks Pay now → modal with QR + UPI ID → client pays via UPI app → returns to modal, enters UTR + uploads screenshot → status = submitted → admin verifies → status = verified → Stage 1 deliverables become visible as approved.

### W3 — Writer uploads a chapter
Writer logs in → opens project → clicks "+ Upload deliverable" → selects DOCX → system auto-versions and auto-names → status = draft → writer clicks "Submit for review" → status = submitted_for_review → appears in admin's pending queue.

### W4 — Admin approves a deliverable
Admin sees pending file → previews → clicks Approve → status = approved → client gets notification + email → file becomes downloadable for client. (Or clicks Send back with notes → status = revision_requested → returns to writer.)

### W5 — Client raises a correction
Client clicks "+ Raise a correction" → modal: title, category, body, up to 3 attachments → submits → correction_requests row inserted → attachments uploaded to storage → admin sees it immediately.

### W6 — Stage advancement
All Stage N deliverables approved → admin clicks "Advance to Stage N+1" → system verifies all approved → updates `current_stage` → Stage N becomes read-only → client sees Stage N marked Completed.

### W7 — Final delivery (the commercial moment)
All Stage 3 deliverables approved including final compiled thesis → client sees it listed but locked → client pays balance → admin verifies → `is_balance_paid = true` → final draft download unlocks → completion email sent → project status = completed.

---

## 10. DESIGN PRINCIPLES

### Color tokens (use these exactly)

```
--bg-primary:     #FFFFFF    /* page background */
--bg-secondary:   #F8F8F7    /* cards, table headers */
--text-primary:   #1A1A1A    /* body text */
--text-secondary: #666666    /* meta, subtitles */
--accent-blue:    #1A3A5C    /* brand, primary buttons */
--success:        #1F7A3D    /* completed badges */
--warning:        #B07000    /* in-progress, pending */
--danger:         #9B1C1C    /* errors, rejection */
--border-subtle:  #E5E5E5    /* dividers, card borders */
```

### Typography

- Body: 14–16px, system sans-serif (Inter / Geist / SF Pro stack).
- Headings: bold, slightly larger, never decorative.
- Line height: comfortable (1.5–1.7 for body, 1.2–1.4 for headings).

### Spacing

- Container max-width: 1200px desktop, full width mobile.
- Side padding: 24px desktop, 16px mobile.
- Card padding: 24px standard, 16px compact.
- Between sections: 32px (related), 48px (major regions).

### What to avoid

- ❌ Gradients (especially purple/pink)
- ❌ Bright reds (use --danger sparingly)
- ❌ Decorative animations (fade/slide are fine for state transitions)
- ❌ Bootstrap-default look
- ❌ Material Design defaults
- ❌ Drop shadows on everything

### References to match

- Linear (linear.app)
- Stripe Dashboard
- Notion
- Vercel Dashboard

---

## 11. SOPs FROM BEDRICK (THE OPERATIONAL STANDARDS)

These exist outside the portal but the portal must respect them:

### File naming (system enforced)
`ClientName_WorkDone_BEDRICK_V[n]`
Examples: `Adarsh_Results_BEDRICK_V2.docx`, `Suresh_Discussion_BEDRICK_V1.docx`

Writers never type filenames manually. System auto-versions.

### Correction format (uses these categories exactly)
- **DONE** — items completed in this revision
- **NOT DONE** — items declined with reasons
- **DOUBTS** — questions back to client/guide
(Plus a hidden 4th category "DATASET CHANGES" for admin notes — not exposed to client UI.)

### Document formatting (for documents produced offline by writers)
- Arial 12pt, double-spaced
- Blue table headers, alternating row shading
- Yellow highlight on statistical test rows
- Tables/figures: titles as separate paragraphs above the element
- Figures: 5.5 inches wide

(The portal does not enforce this — writers handle it in Word. But the spec exists for context.)

---

## 12. BUILD PLAN (SUGGESTED ORDER)

You can adjust if you have a better reason. Don't reorder for personal preference.

### Phase 1 — Foundation (Day 1–3)
1. Initialize Next.js 15 + TypeScript + Tailwind + shadcn/ui project.
2. Set up Supabase project (Mumbai region) — admin will create and share URL + keys.
3. Run database schema SQL (see Section 6).
4. Configure RLS policies on all 10 tables.
5. Configure storage bucket `thesis-files` + 4 storage policies.
6. Build login page (`/`).
7. Build middleware for route protection.
8. Build the `requireRole()` server helper.
9. Test: login as admin → reaches `/admin`. No session → reaches `/`. Cross-role redirect works.

### Phase 2 — Admin core (Day 4–7)
10. `/admin` pipeline view with metric cards + table + filters + search.
11. `/admin/projects/[id]` workspace with 5 tabs.
12. `/admin/projects/new` form.
13. Deliverable upload + approve/send-back server actions.
14. Payment verify/reject server actions.

### Phase 3 — Client core (Day 8–11)
15. `/client` dashboard with hero, stage cards, payment card.
16. Pay now modal with UPI QR + UTR + screenshot upload.
17. Raise correction modal with attachments.
18. Test full client flow: log in, raise correction, pay UPI, see status update after admin verifies.

### Phase 4 — Staff dashboards (Day 12–14)
19. `/writer` dashboard + `/writer/projects/[id]` workspace.
20. `/stats` dashboard + `/stats/projects/[id]` workspace.
21. Submit-for-review server action.

### Phase 5 — Integrations (Day 15–17)
22. Resend integration: welcome email, payment receipt email, deliverable approved notification.
23. Sentry integration.
24. Audit log writes from all server actions.

### Phase 6 — Polish + public site (Day 18–20)
25. `/home` public marketing site.
26. Mobile responsiveness pass on every page.
27. Polish: empty states, loading skeletons, error boundaries.

### Phase 7 — QA + deployment (Day 21–28)
28. Run the 16-point acceptance criteria (see Section 13).
29. Security pen-test (Section 7 test list).
30. Buy domain via GoDaddy.
31. Set up Cloudflare DNS + Email Routing.
32. Deploy to Netlify.
33. Soft launch with 5 trusted clients.

---

## 13. v1 ACCEPTANCE CRITERIA

v1 ships only when ALL of these pass:

- [ ] Admin can log in, see all projects, click into any project, approve a deliverable, verify a payment.
- [ ] Admin can create a new project + create or pick an existing client doctor.
- [ ] Admin can advance a project from Stage 1 → 2 → 3 (only when all current stage deliverables approved).
- [ ] Writer can log in, see only assigned projects, upload a chapter, submit for review.
- [ ] Stats can log in, see only assigned projects, upload dataset and script.
- [ ] Client can log in, see thesis status with progress bar, download approved Stage 1 + 2 deliverables.
- [ ] Client CANNOT download Stage 3 deliverables until balance verified.
- [ ] Client can submit advance + balance payments with UTR + screenshot.
- [ ] Client can raise a correction with up to 3 attachments and see status updates.
- [ ] Client cannot see another client's data (RLS pen-test).
- [ ] Disabled accounts auto-sign-out with banner.
- [ ] Welcome email + payment receipt email delivered via Resend (not in spam).
- [ ] Mobile: client completes full payment + correction flow on a phone screen.
- [ ] Pipeline view loads < 2s with 100 mock projects.
- [ ] Client dashboard loads < 1.5s on 3G.
- [ ] Deployed at chosen domain with HTTPS.

---

## 14. v1.5 AND v2 ROADMAP

**Don't build any of this in v1.** Capture in IDEAS_V2.md.

### v1.5 — Cloudflare R2 storage migration (when Supabase Storage > 800 MB)
- Set up R2 bucket
- Migration Worker copies files in batches
- Update `lib/storage.ts` to use R2 SDK
- Dual-write period (1 week)
- Cut over reads to R2
- Decommission Supabase Storage

### v2 — Major features
- Razorpay integration (replace UPI manual)
- GST invoice generation (once GSTIN registered)
- AI correction parser
- AI format checker
- Statistical method recommender
- Viva readiness pack
- Plagiarism check (Turnitin API)
- Blog / SEO content
- Referral program
- Mobile PWA
- Multi-tenant white-labelling

---

## 15. CONSTANTS / MAGIC NUMBERS

```
ADVANCE_AMOUNT = 8000        # fixed across all tiers
TIER_PRICES = { standard: 16000, special: 15000, super: 12500 }
MAX_FILE_SIZE = 5 * 1024 * 1024   # 5 MB for correction attachments
MAX_ATTACHMENTS_PER_CORRECTION = 3
MAX_DELIVERABLE_SIZE = 50 * 1024 * 1024   # 50 MB
ALLOWED_CORRECTION_FILE_TYPES = ['png', 'jpg', 'jpeg', 'pdf']
ALLOWED_DELIVERABLE_FILE_TYPES = ['docx', 'pdf', 'xlsx', 'csv', 'r', 'py']
UTR_REGEX = /^[0-9A-Z]{12}$/i   # 12 chars alphanumeric
SEARCH_DEBOUNCE_MS = 300
PAYMENT_VERIFY_SLA_HOURS = 24
```

---

## 16. WHAT TO DO ON YOUR FIRST SESSION

If you're reading this for the first time and the project folder is empty:

1. Confirm with the user: "I've read PRD.md. Here's my understanding of what we're building: [2-sentence summary]. Shall I proceed?"
2. Ask: "Do you already have a Supabase project, or should I guide you through creating one?"
3. Once Supabase is ready, get from user: `SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY` + `SUPABASE_SERVICE_ROLE_KEY`.
4. Start Phase 1 from Section 12.
5. After each meaningful step, ask: "Should I commit and continue?"
6. Create STATUS.md after the first task is done, and update it every session.

---

## 17. WHEN THINGS GO WRONG

### If the user says "it's broken"
1. Ask for the exact error message or screenshot.
2. Ask what they were doing when it broke.
3. Check STATUS.md to see what was last working.
4. Don't guess. Read the code that's relevant.
5. Fix the root cause, not the symptom.

### If Supabase auth gives "Invalid email or password" but the password is right
Common causes:
- Email not confirmed (`email_confirmed_at` is null) — set it via SQL or use the "Auto Confirm" checkbox when creating via UI.
- Password was set via direct SQL `update auth.users` — Supabase auth has quirks. Always create users via the Supabase Auth UI or `supabase.auth.admin.createUser()`.
- `is_active = false` on the `public.users` row — check and update.

### If RLS blocks something it shouldn't
- Don't disable RLS. Add a more specific policy.
- Verify the policy logic with: `select policyname, qual from pg_policies where schemaname='public' and tablename='[your_table]';`
- Test in SQL Editor while impersonating a user: `set local "request.jwt.claims" = '{"sub":"[user-uuid]"}'; select ... from [table];`

### If a deploy fails
- Check that `.env.local` variables are set in Netlify's UI.
- Check that `NEXT_PUBLIC_*` variables are present (browser-exposed).
- Check Node version is 20+.

---

## 18. CRITICAL DON'Ts

- ❌ Don't use `service_role` key in client-side code. Server-only.
- ❌ Don't disable RLS to "make things work."
- ❌ Don't allow public read on the storage bucket.
- ❌ Don't hard-code the admin's UUID anywhere.
- ❌ Don't skip the approval gate. Drafts never reach clients.
- ❌ Don't skip the balance gate. Stage 3 final draft is gated.
- ❌ Don't add features outside this PRD without writing them in IDEAS_V2.md and getting approval.
- ❌ Don't deploy to production without running the 16-point acceptance criteria.
- ❌ Don't change the tech stack. It's locked.
- ❌ Don't make the design "fun" or "playful." It's professional medical software.

---

## 19. THIS PROJECT'S NORTH STAR

> Every decision should be evaluated against this one question:
>
> **"Does this make a stressed PG student trust us more?"**
>
> If yes, ship it. If no, don't.

That's the entire product philosophy in one line.

---

**End of PRD. Now read STATUS.md (or create it if missing) and tell the user what to do next.**
