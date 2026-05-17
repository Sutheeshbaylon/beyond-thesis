import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import { notFound } from 'next/navigation'
import PayNowModal from '@/components/client/pay-now-modal'
import RaiseCorrectionModal from '@/components/client/raise-correction-modal'
import CollapsibleDetails from '@/components/client/collapsible-details'
import ClientMessagePanel from '@/components/client/client-message-panel'

const CHAPTER_LABELS: Record<string, string> = {
  master_dataset: 'Master Dataset', tables: 'Tables', charts: 'Charts',
  results: 'Results Chapter', introduction: 'Introduction',
  review_of_literature: 'Review of Literature', materials_and_methods: 'Materials & Methods',
  discussion: 'Discussion', conclusion: 'Conclusion', references: 'References',
  annexures: 'Annexures', final_draft: 'Final Compiled Thesis',
  r_script: 'R Script', python_script: 'Python Script', other: 'Other',
}

const STAGE_DESCRIPTIONS = [
  'Results — datasets, tables, charts, analysis',
  'Introduction, Literature Review & Methods',
  'Discussion, Conclusion & Final Thesis',
]

const CORRECTION_CATEGORY_STYLES: Record<string, string> = {
  done: 'bg-green-50 text-[#1F7A3D] border border-green-200',
  not_done: 'bg-red-50 text-[#9B1C1C] border border-red-200',
  doubts: 'bg-amber-50 text-[#B07000] border border-amber-200',
}

export default async function ClientPage() {
  const { user, profile } = await requireRole('client')
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F8F8F7]">
        <ClientHeader name={profile.full_name} />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">Welcome, {profile.full_name}</h2>
          <p className="text-[#666666]">Your thesis project hasn't been set up yet. Please contact the Beyond Research Unit.</p>
        </main>
      </div>
    )
  }

  const [{ data: deliverables }, { data: corrections }, { data: messages }, { data: pendingPayment }] =
    await Promise.all([
      supabase
        .from('deliverables')
        .select('id, chapter, filename, file_url, stage, status, version')
        .eq('project_id', project.id)
        .eq('status', 'approved')
        .order('stage')
        .order('created_at'),
      supabase
        .from('correction_requests')
        .select('id, title, category, body, status, admin_reply, created_at, correction_attachments(*)')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('messages')
        .select('id, body, created_at, sender:users!messages_sender_id_fkey(full_name)')
        .eq('project_id', project.id)
        .order('created_at', { ascending: true })
        .limit(50),
      supabase
        .from('payments')
        .select('id, payment_type, status')
        .eq('project_id', project.id)
        .eq('status', 'submitted')
        .limit(1),
    ])

  const stage = project.current_stage as number
  const isAdvancePaid = project.is_advance_paid as boolean
  const isBalancePaid = project.is_balance_paid as boolean
  const totalAmount = project.total_amount as number
  const advance = project.advance_amount as number
  const balance = project.balance_amount as number

  const approvedByStage = (s: number) =>
    (deliverables ?? []).filter((d) => d.stage === s)

  // Progress: each stage = 1/3. Within current stage, partial if in_progress.
  const completedStages = stage - 1
  const currentStageProgress = project.stage_status === 'completed' ? 1 : 0.4
  const progressPct = Math.round(((completedStages + currentStageProgress) / 3) * 100)

  const hasPendingPayment = (pendingPayment ?? []).length > 0

  const upiId = process.env.UPI_ID ?? 'bedrick@oksbi'
  const upiQrUrl = process.env.UPI_QR_URL ?? ''

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <ClientHeader name={profile.full_name} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Hero card ─────────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 sm:p-6">
          <h1 className="text-lg sm:text-xl font-semibold text-[#1A1A1A] leading-snug mb-1">
            {project.title}
          </h1>
          <p className="text-sm text-[#666666]">
            {project.specialty}
            {project.college ? ` · ${project.college}` : ''}
            {project.sample_size ? ` · N=${project.sample_size}` : ''}
          </p>

          <div className="mt-5">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-[#1A3A5C]">Stage {stage}</span>
              <span className="text-sm text-[#666666]">of 3</span>
            </div>
            <p className="text-sm text-[#666666] mb-3">
              {project.stage_status === 'completed'
                ? `Stage ${stage} complete — great progress!`
                : !isAdvancePaid
                ? 'Pay the advance to unlock your thesis progress.'
                : `Your team is working on Stage ${stage}: ${STAGE_DESCRIPTIONS[stage - 1]}.`}
            </p>

            {/* Progress bar — 3 segments */}
            <div className="flex gap-1 h-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 rounded-full overflow-hidden bg-[#E5E5E5]">
                  <div
                    className="h-full bg-[#1A3A5C] rounded-full transition-all duration-500"
                    style={{
                      width:
                        s < stage ? '100%'
                        : s === stage ? `${Math.round(currentStageProgress * 100)}%`
                        : '0%',
                    }}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-[#666666] mt-1">{progressPct}% complete</p>
          </div>
        </div>

        {/* ── Stage cards ──────────────────────────────────────── */}
        {!isAdvancePaid ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-[#B07000]">
            <p className="font-medium mb-1">Advance payment required</p>
            <p>Pay ₹{advance.toLocaleString('en-IN')} to unlock your thesis progress and deliverables.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3].map((s) => {
              const stageDels = approvedByStage(s)
              const isLocked = s > stage
              const isDone = s < stage || (s === stage && project.stage_status === 'completed')
              const isCurrent = s === stage && project.stage_status === 'in_progress'
              const isStage3BalanceLocked = s === 3 && !isBalancePaid

              return (
                <div
                  key={s}
                  className={`bg-white border rounded-xl p-5 ${
                    isLocked ? 'border-[#E5E5E5] opacity-60' : 'border-[#E5E5E5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#1A1A1A]">Stage {s}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        isDone
                          ? 'bg-green-50 text-[#1F7A3D] border border-green-200'
                          : isCurrent
                          ? 'bg-amber-50 text-[#B07000] border border-amber-200'
                          : 'bg-[#F8F8F7] text-[#666666] border border-[#E5E5E5]'
                      }`}
                    >
                      {isDone ? 'Completed' : isCurrent ? 'In progress' : 'Locked'}
                    </span>
                  </div>

                  {isStage3BalanceLocked && stageDels.length > 0 && (
                    <div className="mb-3 text-xs text-[#B07000] bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      Stage 3 files are locked until balance payment is verified.
                    </div>
                  )}

                  {stageDels.length === 0 ? (
                    <p className="text-sm text-[#666666]">
                      {isLocked ? 'Not started yet.' : 'Your team is working on this.'}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {stageDels.map((d) => {
                        const isFinalLocked = d.stage === 3 && !isBalancePaid
                        return (
                          <li key={d.id} className="flex items-center justify-between gap-3">
                            <span className="text-sm text-[#1A1A1A] truncate">
                              {CHAPTER_LABELS[d.chapter] ?? d.chapter}
                              {d.version > 1 && (
                                <span className="text-xs text-[#666666] ml-1">v{d.version}</span>
                              )}
                            </span>
                            {isFinalLocked ? (
                              <span className="text-xs text-[#666666] whitespace-nowrap">🔒 Locked</span>
                            ) : (
                              <a
                                href={`/api/download?path=${encodeURIComponent(d.file_url)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1 bg-[#1A3A5C] text-white rounded hover:bg-[#16324f] transition-colors whitespace-nowrap"
                              >
                                Download
                              </a>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── Payment card ─────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">Payments</h2>

          {hasPendingPayment && (
            <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-[#1A3A5C]">
              ✓ Payment submitted — awaiting verification (usually within 24 hours).
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            {[
              { label: 'Total', value: totalAmount },
              { label: 'Advance', value: advance },
              { label: 'Balance', value: balance },
            ].map((item) => (
              <div key={item.label} className="bg-[#F8F8F7] rounded-lg px-2 sm:px-3 py-3">
                <div className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                  ₹{item.value.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-[#666666] mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {/* Advance row */}
            <div className="flex items-center justify-between py-2 border-t border-[#E5E5E5]">
              <div>
                <div className="text-sm text-[#1A1A1A]">Advance — ₹{advance.toLocaleString('en-IN')}</div>
                <div className={`text-xs mt-0.5 ${isAdvancePaid ? 'text-[#1F7A3D]' : 'text-[#B07000]'}`}>
                  {isAdvancePaid ? 'Verified' : 'Pending payment'}
                </div>
              </div>
              {!isAdvancePaid && !hasPendingPayment && (
                <PayNowModal
                  projectId={project.id}
                  paymentType="advance"
                  amount={advance}
                  upiId={upiId}
                  upiQrUrl={upiQrUrl}
                />
              )}
            </div>

            {/* Balance row */}
            <div className="flex items-center justify-between py-2 border-t border-[#E5E5E5]">
              <div>
                <div className="text-sm text-[#1A1A1A]">Balance — ₹{balance.toLocaleString('en-IN')}</div>
                <div className={`text-xs mt-0.5 ${isBalancePaid ? 'text-[#1F7A3D]' : 'text-[#666666]'}`}>
                  {isBalancePaid ? 'Verified' : isAdvancePaid ? 'Due after Stage 3 completion' : 'Pending advance first'}
                </div>
              </div>
              {isAdvancePaid && !isBalancePaid && !hasPendingPayment && stage === 3 && (
                <PayNowModal
                  projectId={project.id}
                  paymentType="balance"
                  amount={balance}
                  upiId={upiId}
                  upiQrUrl={upiQrUrl}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Corrections ──────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Corrections</h2>
            <RaiseCorrectionModal projectId={project.id} />
          </div>

          {(!corrections || corrections.length === 0) ? (
            <p className="text-sm text-[#666666]">No corrections raised yet.</p>
          ) : (
            <div className="space-y-3">
              {corrections.map((c) => (
                <div key={c.id} className="border border-[#E5E5E5] rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[#1A1A1A]">{c.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${CORRECTION_CATEGORY_STYLES[c.category] ?? ''}`}>
                        {c.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-[#666666] whitespace-nowrap">{c.status}</span>
                  </div>
                  <p className="text-sm text-[#666666] leading-relaxed">{c.body}</p>
                  {c.admin_reply && (
                    <div className="mt-3 px-3 py-2 bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg">
                      <p className="text-xs font-medium text-[#1A3A5C] mb-1">Reply from team</p>
                      <p className="text-sm text-[#1A1A1A]">{c.admin_reply}</p>
                    </div>
                  )}
                  {Array.isArray(c.correction_attachments) && c.correction_attachments.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {c.correction_attachments.map((a: { id: string; file_url: string; filename: string }) => (
                        <a key={a.id} href={a.file_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-[#1A3A5C] hover:underline border border-[#E5E5E5] px-2 py-1 rounded">
                          {a.filename}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-[#666666] mt-2">
                    {new Date(c.created_at).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Messages ─────────────────────────────────────────── */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">Messages</h2>
          <ClientMessagePanel messages={messages ?? []} projectId={project.id} />
        </div>

        {/* ── Project details (collapsible) ─────────────────────── */}
        <CollapsibleDetails project={project} />

      </main>
    </div>
  )
}

function ClientHeader({ name }: { name: string }) {
  return (
    <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#1A1A1A] text-sm">Beyond Thesis</span>
          <span className="text-xs px-2 py-0.5 bg-[#F8F8F7] border border-[#E5E5E5] text-[#666666] rounded">
            Client
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#666666] hidden sm:block">{name}</span>
          <form action={signOut}>
            <button type="submit" className="text-sm text-[#1A3A5C] hover:underline">Sign out</button>
          </form>
        </div>
      </div>
    </header>
  )
}
