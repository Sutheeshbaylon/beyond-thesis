import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import PipelineTable from '@/components/admin/pipeline-table'

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg px-5 py-4">
      <div className="text-2xl font-semibold text-[#1A1A1A]">{value}</div>
      <div className="text-sm text-[#666666] mt-0.5">{label}</div>
      {sub && <div className="text-xs text-[#666666] mt-1">{sub}</div>}
    </div>
  )
}

export default async function AdminPage() {
  await requireRole('admin')
  const supabase = await createClient()

  const [
    { data: projects },
    { count: pendingCount },
    { count: paymentsToVerify },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, specialty, sample_size, tier, current_stage, stage_status, is_balance_paid, total_amount, updated_at, client:users!projects_client_id_fkey(full_name)')
      .order('updated_at', { ascending: false }),
    supabase
      .from('deliverables')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'submitted_for_review'),
    supabase
      .from('payments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'submitted'),
  ])

  const activeProjects = projects?.filter((p) => p.stage_status === 'in_progress') ?? []
  const outstandingBalance = projects
    ?.filter((p) => !p.is_balance_paid && p.stage_status === 'in_progress')
    .reduce((sum, p) => sum + (p.total_amount - 8000), 0) ?? 0

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active projects" value={activeProjects.length} />
        <MetricCard label="Pending approval" value={pendingCount ?? 0} sub="deliverables" />
        <MetricCard
          label="Outstanding balance"
          value={'₹' + outstandingBalance.toLocaleString('en-IN')}
        />
        <MetricCard label="Payments to verify" value={paymentsToVerify ?? 0} />
      </div>

      {/* Pipeline header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#1A1A1A]">Projects pipeline</h2>
        <Link
          href="/admin/projects/new"
          className="px-3 py-2 bg-[#1A3A5C] hover:bg-[#16324f] text-white text-sm font-medium rounded-md transition-colors"
        >
          + New project
        </Link>
      </div>

      <PipelineTable projects={projects ?? []} />
    </main>
  )
}
