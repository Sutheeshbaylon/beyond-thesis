-- Beyond Thesis — Storage Bucket + Policies
-- Run AFTER schema.sql in the Supabase SQL Editor.

-- ─── Create bucket ────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('thesis-files', 'thesis-files', false)
on conflict (id) do nothing;

-- ─── Storage policies ─────────────────────────────────────────────────────────

-- Admin: full read/write
create policy "Admin: full storage access"
  on storage.objects for all
  using (
    bucket_id = 'thesis-files'
    and current_user_role() = 'admin'
  );

-- Writer/Stats: read/write across all deliverable paths
create policy "Staff: read/write deliverables storage"
  on storage.objects for all
  using (
    bucket_id = 'thesis-files'
    and current_user_role() in ('writer', 'stats')
    and (storage.foldername(name))[1] = 'deliverables'
  );

-- Client: insert into payments/{projectId}/{userId}/*
create policy "Client: upload payment screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'thesis-files'
    and current_user_role() = 'client'
    and (storage.foldername(name))[1] = 'payments'
    and (storage.foldername(name))[3] = auth.uid()::text
  );

-- Client: insert into corrections/{projectId}/{correctionId}/*
create policy "Client: upload correction attachments"
  on storage.objects for insert
  with check (
    bucket_id = 'thesis-files'
    and current_user_role() = 'client'
    and (storage.foldername(name))[1] = 'corrections'
  );

-- Client: read own payment files
create policy "Client: read own payment files"
  on storage.objects for select
  using (
    bucket_id = 'thesis-files'
    and current_user_role() = 'client'
    and (storage.foldername(name))[1] = 'payments'
    and (storage.foldername(name))[3] = auth.uid()::text
  );

-- Client: read approved deliverables for own project
-- (file path: deliverables/{projectId}/*)
create policy "Client: read approved deliverables storage"
  on storage.objects for select
  using (
    bucket_id = 'thesis-files'
    and current_user_role() = 'client'
    and (storage.foldername(name))[1] = 'deliverables'
    and exists (
      select 1 from public.deliverables d
      join public.projects p on p.id = d.project_id
      where d.file_url like '%' || name || '%'
        and d.status = 'approved'
        and p.client_id = auth.uid()
        and p.is_advance_paid = true
        and (d.chapter != 'final_draft' or p.is_balance_paid = true)
    )
  );

-- Client: read own correction attachments
create policy "Client: read own correction attachments storage"
  on storage.objects for select
  using (
    bucket_id = 'thesis-files'
    and current_user_role() = 'client'
    and (storage.foldername(name))[1] = 'corrections'
  );
