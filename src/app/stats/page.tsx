import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import StaffPipeline from '@/components/staff/staff-pipeline'

const CHAPTER_LABELS: Record<string, string> = {
  master_dataset: 'Master Dataset', tables: 'Tables', charts: 'Charts',
  results: 'Results Chapter', r_script: 'R Script', python_script: 'Python Script', other: 'Other',
}

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

  const [{ data: projects }, { data: deliverables }, { data: revisions }, { data: corrections }] = await Promise.all([
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
    projectIds.length === 0
      ? { data: [] }
      : supabase
          .from('deliverables')
          .select('id, chapter, project_id, project:projects!deliverables_project_id_fkey(id, title)')
          .in('project_id', projectIds)
          .eq('status', 'revision_requested')
          .eq('uploader_id', user.id)
          .eq('stage', 1),
    projectIds.length === 0
      ? { data: [] }
      : supabase
          .from('correction_requests')
          .select('id, title, project_id, project:projects!correction_requests_project_id_fkey(id, title)')
          .in('project_id', projectIds)
          .not('status', 'in', '("resolved","declined")')
          .order('created_at', { ascending: false }),
  ])

  const dels = deliverables ?? []
  const drafts = dels.filter((d) => d.status === 'draft').length
  const submitted = dels.filter((d) => d.status === 'submitted_for_review').length
  const revisionCount = dels.filter((d) => d.status === 'revision_requested').length

  const revisionList = revisions ?? []
  const correctionList = corrections ?? []
  const needsAttention = revisionList.length + correctionList.length

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="My projects" value={projects?.length ?? 0} />
        <MetricCard label="Stage 1 drafts" value={drafts} />
        <MetricCard label="Submitted for review" value={submitted} />
        <MetricCard label="Revision requested" value={revisionCount} />
      </div>

      {needsAttention > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-[#1A1A1A] mb-3">
            Needs attention
            <span className="ml-2 text-xs px-2 py-0.5 bg-red-50 text-[#9B1C1C] border border-red-200 rounded">{needsAttention}</span>
          </h2>
          <div className="bg-white border border-[#E5E5E5] rounded-lg divide-y divide-[#E5E5E5]">
            {revisionList.map((r) => {
              const proj = Array.isArray(r.project) ? r.project[0] : r.project
              return (
                <Link
                  key={r.id}
                  href={`/stats/projects/${r.project_id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#F8F8F7] transition-colors"
                >
                  <div>
                    <span className="text-xs px-2 py-0.5 bg-amber-50 text-[#B07000] border border-amber-200 rounded mr-2">Revision</span>
                    <span className="text-sm text-[#1A1A1A]">{CHAPTER_LABELS[r.chapter] ?? r.chapter}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#666666] hidden sm:block">{proj?.title}</span>
                    <span className="text-xs text-[#1A3A5C]">View →</span>
                  </div>
                </Link>
              )
            })}
            {correctionList.map((c) => {
              const proj = Array.isArray(c.project) ? c.project[0] : c.project
              return (
                <Link
                  key={c.id}
                  href={`/stats/projects/${c.project_id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#F8F8F7] transition-colors"
                >
                  <div>
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-[#1A3A5C] border border-blue-200 rounded mr-2">Correction</span>
                    <span className="text-sm text-[#1A1A1A]">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#666666] hidden sm:block">{proj?.title}</span>
                    <span className="text-xs text-[#1A3A5C]">View →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <h2 className="text-base font-semibold text-[#1A1A1A] mb-4">My projects</h2>
      <StaffPipeline projects={projects ?? []} role="stats" />
    </main>
  )
}
