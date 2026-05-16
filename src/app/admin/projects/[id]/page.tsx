import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import DeliverablesTab from '@/components/admin/deliverables-tab'
import PaymentsTab from '@/components/admin/payments-tab'

const STAGE_STATUS_STYLES: Record<string, string> = {
  in_progress: 'bg-amber-50 text-[#B07000] border border-amber-200',
  completed: 'bg-green-50 text-[#1F7A3D] border border-green-200',
}

const TIER_LABELS: Record<string, string> = {
  standard: 'Standard ₹16,000',
  special: 'Special ₹15,000',
  super: 'Super ₹12,500',
  custom: 'Custom',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectWorkspacePage({ params }: Props) {
  await requireRole('admin')
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: project },
    { data: deliverables },
    { data: corrections },
    { data: payments },
    { data: messages },
    { data: auditLog },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select(`
        *,
        client:users!projects_client_id_fkey(id, full_name, email, phone)
      `)
      .eq('id', id)
      .single(),
    supabase
      .from('deliverables')
      .select('*, uploader:users!deliverables_uploader_id_fkey(full_name)')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('correction_requests')
      .select('*, raised_by_user:users!correction_requests_raised_by_fkey(full_name), correction_attachments(*)')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('payments')
      .select('*, submitted_by:users!payments_submitted_by_fkey(full_name)')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('messages')
      .select('*, sender:users!messages_sender_id_fkey(full_name)')
      .eq('project_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('audit_log')
      .select('*')
      .eq('entity_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  if (!project) notFound()

  const client = project.client as { id: string; full_name: string; email: string; phone: string } | null

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-[#666666] mb-6">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Pipeline</Link>
        <span className="mx-2">›</span>
        <span className="text-[#1A1A1A]">{project.title}</span>
      </div>

      {/* Header card */}
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-5 mb-6">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#1A1A1A] leading-snug">{project.title}</h1>
            <div className="text-sm text-[#666666] mt-1 space-x-3">
              <span>{client?.full_name}</span>
              <span>·</span>
              <span>{project.specialty}</span>
              {project.study_design && <><span>·</span><span>{project.study_design}</span></>}
              {project.sample_size && <><span>·</span><span>N={project.sample_size}</span></>}
            </div>
            {project.college && (
              <div className="text-xs text-[#666666] mt-1">{project.college}{project.university ? `, ${project.university}` : ''}</div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 bg-[#F8F8F7] border border-[#E5E5E5] rounded text-[#1A1A1A]">
              {TIER_LABELS[project.tier]}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${STAGE_STATUS_STYLES[project.stage_status]}`}>
              Stage {project.current_stage} · {project.stage_status === 'in_progress' ? 'In progress' : 'Completed'}
            </span>
          </div>
        </div>

        {/* Stage tracker */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`rounded-lg border px-4 py-3 text-sm ${
                s === project.current_stage
                  ? 'border-[#1A3A5C] bg-[#1A3A5C]/5'
                  : s < project.current_stage
                  ? 'border-[#E5E5E5] bg-[#F8F8F7]'
                  : 'border-[#E5E5E5] bg-white opacity-50'
              }`}
            >
              <div className="font-medium text-[#1A1A1A]">Stage {s}</div>
              <div className="text-xs text-[#666666] mt-0.5">
                {s < project.current_stage
                  ? 'Completed'
                  : s === project.current_stage
                  ? project.stage_status === 'completed' ? 'Completed' : 'In progress'
                  : 'Locked'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs — client-rendered for interactivity */}
      <WorkspaceTabs
        projectId={id}
        currentStage={project.current_stage}
        isAdvancePaid={project.is_advance_paid}
        isBalancePaid={project.is_balance_paid}
        totalAmount={project.total_amount}
        deliverables={deliverables ?? []}
        corrections={corrections ?? []}
        payments={payments ?? []}
        messages={messages ?? []}
        auditLog={auditLog ?? []}
      />
    </main>
  )
}

// Inline client component wrapper to keep routing simple
import WorkspaceTabs from '@/components/admin/workspace-tabs'
