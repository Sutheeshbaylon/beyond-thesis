import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import StaffPipeline from '@/components/staff/staff-pipeline'

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg px-5 py-4">
      <div className="text-2xl font-semibold text-[#1A1A1A]">{value}</div>
      <div className="text-sm text-[#666666] mt-0.5">{label}</div>
    </div>
  )
}

export default async function StatsPage() {
  const { user } = await requireRole('stats')
  const supabase = await createClient()

  const { data: assignments } = await supabase
    .from('assignments')
    .select('project_id')
    .eq('user_id', user.id)

  const projectIds = (assignments ?? []).map((a) => a.project_id)

  const [{ data: projects }, { data: deliverables }] = await Promise.all([
    projectIds.length === 0
      ? { data: [] }
      : supabase
          .from('projects')
          .select('id, title, specialty, current_stage, stage_status, updated_at, client:users!projects_client_id_fkey(full_name)')
          .in('id', projectIds)
          .order('updated_at', { ascending: false }),
    projectIds.length === 0
      ? { data: [] }
      : supabase
          .from('deliverables')
          .select('id, status')
          .in('project_id', projectIds)
          .eq('uploader_id', user.id)
          .eq('stage', 1),
  ])

  const dels = deliverables ?? []
  const drafts = dels.filter((d) => d.status === 'draft').length
  const submitted = dels.filter((d) => d.status === 'submitted_for_review').length
  const revisions = dels.filter((d) => d.status === 'revision_requested').length

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="My projects" value={projects?.length ?? 0} />
        <MetricCard label="Stage 1 drafts" value={drafts} />
        <MetricCard label="Submitted for review" value={submitted} />
        <MetricCard label="Revision requested" value={revisions} />
      </div>

      <h2 className="text-base font-semibold text-[#1A1A1A] mb-4">My projects</h2>
      <StaffPipeline projects={projects ?? []} role="stats" />
    </main>
  )
}
