import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import CorrectionCard from '@/components/admin/correction-card'

export default async function AdminCorrectionsPage() {
  await requireRole('admin')
  const supabase = await createClient()

  const { data: corrections } = await supabase
    .from('correction_requests')
    .select(`
      *,
      raised_by_user:users!correction_requests_raised_by_fkey(full_name),
      correction_attachments(*),
      project:projects!correction_requests_project_id_fkey(id, title, client:users!projects_client_id_fkey(full_name))
    `)
    .order('created_at', { ascending: false })

  const open = (corrections ?? []).filter((c) => c.status === 'open' || c.status === 'in_progress')
  const closed = (corrections ?? []).filter((c) => c.status === 'resolved' || c.status === 'declined')

  return (
    <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[#1A1A1A]">Corrections</h1>
          <p className="text-sm text-[#666666] mt-0.5">{open.length} open · {closed.length} closed</p>
        </div>
        <Link href="/admin" className="text-sm text-[#1A3A5C] hover:underline">← Pipeline</Link>
      </div>

      {open.length === 0 && closed.length === 0 && (
        <p className="text-sm text-[#666666]">No correction requests yet.</p>
      )}

      {open.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-[#1A1A1A] mb-3">Open</h2>
          <div className="space-y-3">
            {open.map((c) => {
              const project = c.project as { id: string; title: string; client: { full_name: string } | { full_name: string }[] | null } | null
              const clientName = Array.isArray(project?.client) ? project?.client[0]?.full_name : (project?.client as { full_name: string } | null)?.full_name
              return (
                <div key={c.id}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Link href={`/admin/projects/${project?.id}`}
                      className="text-xs text-[#1A3A5C] hover:underline font-medium">
                      {project?.title}
                    </Link>
                    {clientName && <span className="text-xs text-[#666666]">· {clientName}</span>}
                  </div>
                  <CorrectionCard c={c} projectId={project?.id ?? ''} />
                </div>
              )
            })}
          </div>
        </section>
      )}

      {closed.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-[#666666] mb-3">Closed</h2>
          <div className="space-y-3">
            {closed.map((c) => {
              const project = c.project as { id: string; title: string; client: { full_name: string } | { full_name: string }[] | null } | null
              const clientName = Array.isArray(project?.client) ? project?.client[0]?.full_name : (project?.client as { full_name: string } | null)?.full_name
              return (
                <div key={c.id}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Link href={`/admin/projects/${project?.id}`}
                      className="text-xs text-[#1A3A5C] hover:underline font-medium">
                      {project?.title}
                    </Link>
                    {clientName && <span className="text-xs text-[#666666]">· {clientName}</span>}
                  </div>
                  <CorrectionCard c={c} projectId={project?.id ?? ''} />
                </div>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
