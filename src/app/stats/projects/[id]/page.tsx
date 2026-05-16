import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import StaffDeliverables from '@/components/staff/staff-deliverables'

interface Props {
  params: Promise<{ id: string }>
}

export default async function StatsProjectPage({ params }: Props) {
  const { user } = await requireRole('stats')
  const { id } = await params
  const supabase = await createClient()

  const { data: assignment } = await supabase
    .from('assignments')
    .select('id')
    .eq('project_id', id)
    .eq('user_id', user.id)
    .single()

  if (!assignment) notFound()

  const [{ data: project }, { data: deliverables }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, specialty, current_stage, stage_status, client:users!projects_client_id_fkey(full_name)')
      .eq('id', id)
      .single(),
    supabase
      .from('deliverables')
      .select('id, chapter, filename, file_url, version, status, admin_notes, stage, created_at')
      .eq('project_id', id)
      .eq('stage', 1)
      .order('created_at', { ascending: false }),
  ])

  if (!project) notFound()

  const clientRaw = project.client as unknown
  const clientObj = (Array.isArray(clientRaw) ? clientRaw[0] : clientRaw) as { full_name: string } | null | undefined

  return (
    <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      <div className="text-sm text-[#666666] mb-6">
        <Link href="/stats" className="hover:text-[#1A1A1A] transition-colors">My projects</Link>
        <span className="mx-2">›</span>
        <span className="text-[#1A1A1A]">{project.title}</span>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 mb-6">
        <div className="flex flex-wrap items-start gap-3 justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#1A1A1A]">{project.title}</h1>
            <p className="text-sm text-[#666666] mt-1">
              {clientObj?.full_name} · {project.specialty}
            </p>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${
            project.stage_status === 'completed'
              ? 'bg-green-50 text-[#1F7A3D] border border-green-200'
              : 'bg-amber-50 text-[#B07000] border border-amber-200'
          }`}>
            Stage {project.current_stage}
          </span>
        </div>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3">Stage 1 — Results</h2>
        <p className="text-xs text-[#666666] mb-4">
          Upload datasets, tables, charts, and analysis scripts. Submit each for review when ready.
        </p>
        <StaffDeliverables
          deliverables={deliverables ?? []}
          projectId={id}
          role="stats"
          currentStage={project.current_stage}
        />
      </section>
    </main>
  )
}
