import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import NewProjectForm from '@/components/admin/new-project-form'

export default async function NewProjectPage() {
  await requireRole('admin')
  const supabase = await createClient()

  const [{ data: clients }, { data: writers }, { data: statUsers }] = await Promise.all([
    supabase.from('users').select('id, full_name, email').eq('role', 'client').eq('is_active', true).order('full_name'),
    supabase.from('users').select('id, full_name').eq('role', 'writer').eq('is_active', true).order('full_name'),
    supabase.from('users').select('id, full_name').eq('role', 'stats').eq('is_active', true).order('full_name'),
  ])

  return (
    <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-8">
      <div className="text-sm text-[#666666] mb-6">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Pipeline</Link>
        <span className="mx-2">›</span>
        <span className="text-[#1A1A1A]">New project</span>
      </div>
      <h1 className="text-lg font-semibold text-[#1A1A1A] mb-6">New project</h1>
      <NewProjectForm
        clients={clients ?? []}
        writers={writers ?? []}
        statUsers={statUsers ?? []}
      />
    </main>
  )
}
