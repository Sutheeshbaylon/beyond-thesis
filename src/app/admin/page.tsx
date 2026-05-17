import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import PipelineTable from '@/components/admin/pipeline-table'

function MetricCard({ label, value, sub, href }: { label: string; value: string | number; sub?: string; href?: string }) {
  const inner = (
    <div className={`bg-white border border-[#E5E5E5] rounded-lg px-5 py-4 ${href ? 'hover:border-[#1A3A5C] transition-colors' : ''}`}>
      <div className="text-2xl font-semibold text-[#1A1A1A]">{value}</div>
      <div className="text-sm text-[#666666] mt-0.5">{label}</div>
      {sub && <div className="text-xs text-[#666666] mt-1">{sub}</div>}
      {href && <div className="text-xs text-[#1A3A5C] mt-1">Click to view →</div>}
    </div>
  )
  if (href) return <Link href={href}>{inner}</Link>
  return inner
}

export default async function AdminPage() {
  await requireRole('admin')
  const supabase = await createClient()

  const [
    { data: projects },
    { data: pendingDeliverables },
    { data: pendingPayments },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, specialty, sample_size, tier, current_stage, stage_status, is_balance_paid, total_amount, updated_at, client:users!projects_client_id_fkey(full_name)')
      .order('updated_at', { ascending: false }),
    supabase
      .from('deliverables')
      .select('project_id')
      .eq('status', 'submitted_for_review'),
    supabase
      .from('payments')
      .select('project_id')
      .eq('status', 'submitted'),
  ])

  const paymentsToVerify = pendingPayments?.length ?? 0
  const pendingPaymentProjectIds = [...new Set((pendingPayments ?? []).map((p) => p.project_id))]
  const pendingDeliverableProjectIds = [...new Set((pendingDeliverables ?? []).map((d) => d.project_id))]
  const pendingDeliverableCount = pendingDeliverables?.length ?? 0

  const activeProjects = projects?.filter((p) => p.stage_status === 'in_progress') ?? []
  const outstandingBalance = projects
    ?.filter((p) => !p.is_balance_paid && p.stage_status === 'in_progress')
    .reduce((sum, p) => sum + (p.total_amount - 8000), 0) ?? 0

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active projects" value={activeProjects.length} />
        <MetricCard
          label="Pending approval"
          value={pendingDeliverableCount}
          sub="deliverables"
          href={pendingDeliverableCount > 0 ? '/admin?deliverable=pending' : undefined}
        />
        <MetricCard
          label="Outstanding balance"
          value={'₹' + outstandingBalance.toLocaleString('en-IN')}
        />
        <MetricCard
          label="Payments to verify"
          value={paymentsToVerify}
          href={paymentsToVerify > 0 ? '/admin?payment=pending' : undefined}
        />
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

      <PipelineTable projects={projects ?? []} pendingPaymentProjectIds={pendingPaymentProjectIds} pendingDeliverableProjectIds={pendingDeliverableProjectIds} />
    </main>
  )
}
