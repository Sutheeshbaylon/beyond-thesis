-- Beyond Thesis — Database Schema
-- Run this once against your Supabase project.

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────
create type user_role as enum ('admin', 'writer', 'stats', 'client');
create type project_tier as enum ('standard', 'special', 'super', 'custom');
create type project_status as enum ('active', 'completed', 'on_hold', 'cancelled');
create type stage_status as enum ('in_progress', 'completed');
create type assignment_role as enum ('writer', 'stats');
create type deliverable_status as enum ('draft', 'submitted_for_review', 'approved', 'revision_requested');
create type deliverable_chapter as enum (
  'master_dataset', 'tables', 'charts', 'results',
  'introduction', 'review_of_literature', 'materials_and_methods',
  'discussion', 'conclusion', 'references', 'annexures', 'final_draft',
  'r_script', 'python_script', 'other'
);
create type correction_category as enum ('done', 'not_done', 'doubts', 'dataset_changes');
create type correction_status as enum ('open', 'in_progress', 'resolved', 'declined');
create type payment_type as enum ('advance', 'balance', 'custom');
create type payment_status as enum ('submitted', 'verified', 'rejected');

-- ─── Helper: auto-update updated_at ───────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── Table: users ─────────────────────────────────────────────────────────────
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null unique,
  phone       text,
  role        user_role not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger users_updated_at before update on public.users
  for each row execute function set_updated_at();

-- ─── Table: projects ──────────────────────────────────────────────────────────
create table public.projects (
  id                   uuid primary key default uuid_generate_v4(),
  client_id            uuid not null references public.users(id) on delete restrict,
  title                text not null,
  specialty            text not null,
  study_design         text,
  sample_size          integer,
  college              text,
  university           text,
  guide_name           text,
  submission_deadline  date,
  tier                 project_tier not null default 'standard',
  total_amount         integer not null,
  advance_amount       integer not null default 8000,
  balance_amount       integer generated always as (total_amount - advance_amount) stored,
  current_stage        smallint not null default 1 check (current_stage between 1 and 3),
  stage_status         stage_status not null default 'in_progress',
  is_advance_paid      boolean not null default false,
  is_balance_paid      boolean not null default false,
  status               project_status not null default 'active',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger projects_updated_at before update on public.projects
  for each row execute function set_updated_at();

-- ─── Table: assignments ───────────────────────────────────────────────────────
create table public.assignments (
  id               uuid primary key default uuid_generate_v4(),
  project_id       uuid not null references public.projects(id) on delete restrict,
  user_id          uuid not null references public.users(id) on delete restrict,
  role_on_project  assignment_role not null,
  created_at       timestamptz not null default now(),
  unique (project_id, role_on_project)
);

-- ─── Table: deliverables ──────────────────────────────────────────────────────
create table public.deliverables (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid not null references public.projects(id) on delete restrict,
  uploader_id  uuid not null references public.users(id) on delete restrict,
  stage        smallint not null check (stage between 1 and 3),
  chapter      deliverable_chapter not null,
  filename     text not null,
  file_url     text not null,
  version      integer not null default 1,
  status       deliverable_status not null default 'draft',
  admin_notes  text,
  approved_by  uuid references public.users(id),
  approved_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger deliverables_updated_at before update on public.deliverables
  for each row execute function set_updated_at();

-- ─── Table: correction_requests ───────────────────────────────────────────────
create table public.correction_requests (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references public.projects(id) on delete restrict,
  raised_by       uuid not null references public.users(id) on delete restrict,
  deliverable_id  uuid references public.deliverables(id),
  title           text not null,
  category        correction_category not null,
  body            text not null,
  status          correction_status not null default 'open',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger correction_requests_updated_at before update on public.correction_requests
  for each row execute function set_updated_at();

-- ─── Table: correction_attachments ───────────────────────────────────────────
create table public.correction_attachments (
  id             uuid primary key default uuid_generate_v4(),
  correction_id  uuid not null references public.correction_requests(id) on delete restrict,
  file_url       text not null,
  filename       text not null,
  created_at     timestamptz not null default now()
);

-- ─── Table: payments ─────────────────────────────────────────────────────────
create table public.payments (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references public.projects(id) on delete restrict,
  submitted_by    uuid not null references public.users(id) on delete restrict,
  amount          integer not null,
  payment_type    payment_type not null,
  utr_number      text,
  screenshot_url  text,
  status          payment_status not null default 'submitted',
  verified_by     uuid references public.users(id),
  verified_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger payments_updated_at before update on public.payments
  for each row execute function set_updated_at();

-- ─── Table: messages ─────────────────────────────────────────────────────────
create table public.messages (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references public.projects(id) on delete restrict,
  sender_id   uuid not null references public.users(id) on delete restrict,
  body        text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── Table: notifications ────────────────────────────────────────────────────
create table public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  title       text not null,
  body        text not null,
  link_to     text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── Table: audit_log ────────────────────────────────────────────────────────
create table public.audit_log (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.users(id),
  action       text not null,
  entity_type  text not null,
  entity_id    uuid,
  details      jsonb,
  ip_address   text,
  created_at   timestamptz not null default now()
);

-- ─── Helper function for RLS ──────────────────────────────────────────────────
create or replace function current_user_role()
returns user_role as $$
  select role from public.users where id = auth.uid()
$$ language sql stable security definer;

-- ─── Helper: is_assigned_to_project ──────────────────────────────────────────
create or replace function is_assigned_to_project(p_project_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.assignments
    where project_id = p_project_id and user_id = auth.uid()
  )
$$ language sql stable security definer;
