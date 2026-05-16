-- Beyond Thesis — Row-Level Security Policies
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- Safe to re-run: drops existing policies before recreating.

-- ─── Enable RLS on all tables ─────────────────────────────────────────────────
alter table public.users                enable row level security;
alter table public.projects             enable row level security;
alter table public.assignments          enable row level security;
alter table public.deliverables         enable row level security;
alter table public.correction_requests  enable row level security;
alter table public.correction_attachments enable row level security;
alter table public.payments             enable row level security;
alter table public.messages             enable row level security;
alter table public.notifications        enable row level security;
alter table public.audit_log            enable row level security;

-- ─── Drop existing policies (safe re-run) ────────────────────────────────────
drop policy if exists "Admin: full access on users"                     on public.users;
drop policy if exists "Self: read own row"                              on public.users;
drop policy if exists "Admin: full access on projects"                  on public.projects;
drop policy if exists "Client: read own project"                        on public.projects;
drop policy if exists "Staff: read assigned projects"                   on public.projects;
drop policy if exists "Admin: full access on assignments"               on public.assignments;
drop policy if exists "Self: read own assignments"                      on public.assignments;
drop policy if exists "Admin: full access on deliverables"              on public.deliverables;
drop policy if exists "Client: read approved deliverables"              on public.deliverables;
drop policy if exists "Staff: full access on assigned deliverables"     on public.deliverables;
drop policy if exists "Admin: full access on corrections"               on public.correction_requests;
drop policy if exists "Client: full access on own project corrections"  on public.correction_requests;
drop policy if exists "Staff: read corrections on assigned projects"    on public.correction_requests;
drop policy if exists "Admin: full access on correction attachments"    on public.correction_attachments;
drop policy if exists "Client: full access on own correction attachments" on public.correction_attachments;
drop policy if exists "Staff: read correction attachments on assigned projects" on public.correction_attachments;
drop policy if exists "Admin: full access on payments"                  on public.payments;
drop policy if exists "Client: full access on own project payments"     on public.payments;
drop policy if exists "Admin: full access on messages"                  on public.messages;
drop policy if exists "Client: full access on own project messages"     on public.messages;
drop policy if exists "Staff: full access on assigned project messages" on public.messages;
drop policy if exists "Self: full access on own notifications"          on public.notifications;
drop policy if exists "Admin: read audit log"                           on public.audit_log;

-- ─── users ────────────────────────────────────────────────────────────────────
create policy "Admin: full access on users"
  on public.users for all
  using (current_user_role() = 'admin');

create policy "Self: read own row"
  on public.users for select
  using (id = auth.uid());

-- ─── projects ─────────────────────────────────────────────────────────────────
create policy "Admin: full access on projects"
  on public.projects for all
  using (current_user_role() = 'admin');

create policy "Client: read own project"
  on public.projects for select
  using (client_id = auth.uid() and current_user_role() = 'client');

create policy "Staff: read assigned projects"
  on public.projects for select
  using (
    current_user_role() in ('writer', 'stats')
    and is_assigned_to_project(id)
  );

-- ─── assignments ──────────────────────────────────────────────────────────────
create policy "Admin: full access on assignments"
  on public.assignments for all
  using (current_user_role() = 'admin');

create policy "Self: read own assignments"
  on public.assignments for select
  using (user_id = auth.uid());

-- ─── deliverables ─────────────────────────────────────────────────────────────
create policy "Admin: full access on deliverables"
  on public.deliverables for all
  using (current_user_role() = 'admin');

-- Client sees approved deliverables for own project.
-- Stage 3 final_draft only if balance is paid.
create policy "Client: read approved deliverables"
  on public.deliverables for select
  using (
    current_user_role() = 'client'
    and status = 'approved'
    and exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.client_id = auth.uid()
        and p.is_advance_paid = true
        and (
          chapter != 'final_draft'
          or p.is_balance_paid = true
        )
    )
  );

-- Writer/Stats: full access on assigned projects
create policy "Staff: full access on assigned deliverables"
  on public.deliverables for all
  using (
    current_user_role() in ('writer', 'stats')
    and is_assigned_to_project(project_id)
  );

-- ─── correction_requests ──────────────────────────────────────────────────────
create policy "Admin: full access on corrections"
  on public.correction_requests for all
  using (current_user_role() = 'admin');

create policy "Client: full access on own project corrections"
  on public.correction_requests for all
  using (
    current_user_role() = 'client'
    and exists (
      select 1 from public.projects p
      where p.id = project_id and p.client_id = auth.uid()
    )
  );

create policy "Staff: read corrections on assigned projects"
  on public.correction_requests for select
  using (
    current_user_role() in ('writer', 'stats')
    and is_assigned_to_project(project_id)
  );

-- ─── correction_attachments ───────────────────────────────────────────────────
create policy "Admin: full access on correction attachments"
  on public.correction_attachments for all
  using (current_user_role() = 'admin');

create policy "Client: full access on own correction attachments"
  on public.correction_attachments for all
  using (
    current_user_role() = 'client'
    and exists (
      select 1 from public.correction_requests cr
      join public.projects p on p.id = cr.project_id
      where cr.id = correction_id and p.client_id = auth.uid()
    )
  );

create policy "Staff: read correction attachments on assigned projects"
  on public.correction_attachments for select
  using (
    current_user_role() in ('writer', 'stats')
    and exists (
      select 1 from public.correction_requests cr
      where cr.id = correction_id
        and is_assigned_to_project(cr.project_id)
    )
  );

-- ─── payments ─────────────────────────────────────────────────────────────────
create policy "Admin: full access on payments"
  on public.payments for all
  using (current_user_role() = 'admin');

create policy "Client: full access on own project payments"
  on public.payments for all
  using (
    current_user_role() = 'client'
    and exists (
      select 1 from public.projects p
      where p.id = project_id and p.client_id = auth.uid()
    )
  );

-- ─── messages ─────────────────────────────────────────────────────────────────
create policy "Admin: full access on messages"
  on public.messages for all
  using (current_user_role() = 'admin');

create policy "Client: full access on own project messages"
  on public.messages for all
  using (
    current_user_role() = 'client'
    and exists (
      select 1 from public.projects p
      where p.id = project_id and p.client_id = auth.uid()
    )
  );

create policy "Staff: full access on assigned project messages"
  on public.messages for all
  using (
    current_user_role() in ('writer', 'stats')
    and is_assigned_to_project(project_id)
  );

-- ─── notifications ────────────────────────────────────────────────────────────
create policy "Self: full access on own notifications"
  on public.notifications for all
  using (user_id = auth.uid());

-- ─── audit_log ────────────────────────────────────────────────────────────────
create policy "Admin: read audit log"
  on public.audit_log for select
  using (current_user_role() = 'admin');

-- Writes go through service_role only (no insert policy for authenticated users)
