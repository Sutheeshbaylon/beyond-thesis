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

const STAGE_LABELS = ['Results & Analysis', 'Literature & Methods', 'Discussion & Final Draft']

const CORRECTION_CATEGORY_STYLES: Record<string, string> = {
  done: 'bg-green-50 text-green-700 border border-green-200',
  not_done: 'bg-red-50 text-red-700 border border-red-200',
  doubts: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const CORRECTION_STATUS_STYLES: Record<string, string> = {
  open: 'bg-blue-50 text-blue-700 border border-blue-200',
  resolved: 'bg-green-50 text-green-700 border border-green-200',
  declined: 'bg-gray-50 text-gray-500 border border-gray-200',
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
      <div className="min-h-screen bg-gray-50">
        <ClientHeader name={profile.full_name} />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome, {profile.full_name}</h2>
          <p className="text-gray-500">Your thesis project hasn&apos;t been set up yet. Please contact the Beyond Research Unit.</p>
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
  const hasPendingPayment = (pendingPayment ?? []).length > 0
  const upiId = process.env.UPI_ID ?? 'bedrick@oksbi'
  const upiQrUrl = process.env.UPI_QR_URL ?? ''

  const approvedByStage = (s: number) => (deliverables ?? []).filter((d) => d.stage === s)
  const completedStages = stage - 1
  const currentStageProgress = project.stage_status === 'completed' ? 1 : 0.4
  const progressPct = Math.round(((completedStages + currentStageProgress) / 3) * 100)

  const openCorrections = (corrections ?? []).filter((c) => c.status === 'open').length

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader name={profile.full_name} />

      {/* ── Project banner ── */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-2">{project.specialty}</p>
          <h1 className="text-xl sm:text-2xl font-bold leading-snug mb-1">{project.title}</h1>
          {project.college && <p className="text-teal-200 text-sm mb-6">{project.college}</p>}

          {/* Stage progress */}
          <div className="mt-6">
            <div className="flex items-center gap-0">
              {[1, 2, 3].map((s) => {
                const isDone = s < stage || (s === stage && project.stage_status === 'completed')
                const isCurrent = s === stage && project.stage_status === 'in_progress'
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                        isDone
                          ? 'bg-teal-400 border-teal-400 text-teal-900'
                          : isCurrent
                          ? 'bg-white border-white text-teal-800'
                          : 'bg-teal-800 border-teal-600 text-teal-400'
                      }`}>
                        {isDone ? '✓' : s}
                      </div>
                      <span className={`text-xs mt-1.5 font-medium max-w-[70px] text-center leading-tight ${
                        isDone ? 'text-teal-300' : isCurrent ? 'text-white' : 'text-teal-500'
                      }`}>
                        {STAGE_LABELS[s - 1]}
                      </span>
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-5 rounded ${s < stage ? 'bg-teal-400' : 'bg-teal-700'}`} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-teal-200 text-sm">
                {!isAdvancePaid
                  ? 'Pay advance to begin your thesis journey'
                  : project.stage_status === 'completed' && stage === 3
                  ? 'Your thesis is complete!'
                  : `Stage ${stage} in progress`}
              </p>
              <span className="text-white font-bold text-sm bg-white/10 px-3 py-1 rounded-full">{progressPct}%</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* ── Advance payment prompt ── */}
        {!isAdvancePaid && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600 font-bold text-lg">!</div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-1">Advance payment required</p>
              <p className="text-sm text-amber-700 mb-3">Pay ₹{advance.toLocaleString('en-IN')} to unlock your thesis progress and deliverables.</p>
              {!hasPendingPayment && (
                <PayNowModal projectId={project.id} paymentType="advance" amount={advance} upiId={upiId} upiQrUrl={upiQrUrl} />
              )}
              {hasPendingPayment && (
                <p className="text-xs text-amber-600 font-medium">Payment submitted — awaiting verification</p>
              )}
            </div>
          </div>
        )}

        {/* ── Deliverables ── */}
        {isAdvancePaid && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Your Deliverables</h2>
              <p className="text-xs text-gray-500 mt-0.5">Approved chapters ready for download</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((s) => {
                const stageDels = approvedByStage(s)
                const isLocked = s > stage
                const isDone = s < stage || (s === stage && project.stage_status === 'completed')
                const isCurrent = s === stage && project.stage_status === 'in_progress'
                const isStage3BalanceLocked = s === 3 && !isBalancePaid

                return (
                  <div key={s} className={isLocked ? 'opacity-50' : ''}>
                    <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone ? 'bg-teal-600 text-white' : isCurrent ? 'bg-amber-400 text-white' : 'bg-gray-300 text-white'
                        }`}>
                          {isDone ? '✓' : s}
                        </div>
                        <span className="text-sm font-medium text-gray-700">Stage {s} — {STAGE_LABELS[s - 1]}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isDone ? 'bg-teal-50 text-teal-700' : isCurrent ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isDone ? 'Completed' : isCurrent ? 'In progress' : 'Locked'}
                      </span>
                    </div>

                    {isStage3BalanceLocked && stageDels.length > 0 && (
                      <div className="px-5 py-3 bg-amber-50 border-y border-amber-100 text-xs text-amber-700 flex items-center gap-2">
                        <span>🔒</span> Files locked until balance payment is verified.
                      </div>
                    )}

                    {stageDels.length === 0 ? (
                      <div className="px-5 py-4 text-sm text-gray-400">
                        {isLocked ? 'Not started yet.' : 'Your team is working on this — files will appear here when approved.'}
                      </div>
                    ) : (
                      <ul className="px-5 py-3 space-y-2">
                        {stageDels.map((d) => {
                          const isFinalLocked = d.stage === 3 && !isBalancePaid
                          return (
                            <li key={d.id} className="flex items-center justify-between gap-3 py-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-teal-600 text-base flex-shrink-0">📄</span>
                                <span className="text-sm text-gray-800 truncate">
                                  {CHAPTER_LABELS[d.chapter] ?? d.chapter}
                                  {d.version > 1 && <span className="text-xs text-gray-400 ml-1">v{d.version}</span>}
                                </span>
                              </div>
                              {isFinalLocked ? (
                                <span className="text-xs text-gray-400 flex-shrink-0">🔒 Locked</span>
                              ) : (
                                <a
                                  href={`/api/download?path=${encodeURIComponent(d.file_url)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-shrink-0 text-xs px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors font-medium"
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
          </div>
        )}

        {/* ── Payments ── */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Payments</h2>
              <p className="text-xs text-gray-500 mt-0.5">Total: ₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            {hasPendingPayment && (
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-medium">
                Verification pending
              </span>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {/* Advance */}
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isAdvancePaid ? 'bg-teal-50' : 'bg-amber-50'
                }`}>
                  <span className="text-base">{isAdvancePaid ? '✅' : '💳'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Advance</p>
                  <p className={`text-xs mt-0.5 font-medium ${isAdvancePaid ? 'text-teal-600' : 'text-amber-600'}`}>
                    {isAdvancePaid ? 'Verified ✓' : 'Pending payment'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">₹{advance.toLocaleString('en-IN')}</span>
                {!isAdvancePaid && !hasPendingPayment && (
                  <PayNowModal projectId={project.id} paymentType="advance" amount={advance} upiId={upiId} upiQrUrl={upiQrUrl} />
                )}
              </div>
            </div>

            {/* Balance */}
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isBalancePaid ? 'bg-teal-50' : 'bg-gray-50'
                }`}>
                  <span className="text-base">{isBalancePaid ? '✅' : '🔒'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Balance</p>
                  <p className={`text-xs mt-0.5 ${isBalancePaid ? 'text-teal-600 font-medium' : 'text-gray-400'}`}>
                    {isBalancePaid ? 'Verified ✓' : isAdvancePaid ? 'Due after Stage 3 completion' : 'Unlocks after advance'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">₹{balance.toLocaleString('en-IN')}</span>
                {isAdvancePaid && !isBalancePaid && !hasPendingPayment && stage === 3 && (
                  <PayNowModal projectId={project.id} paymentType="balance" amount={balance} upiId={upiId} upiQrUrl={upiQrUrl} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Corrections ── */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Corrections</h2>
              {openCorrections > 0 && (
                <p className="text-xs text-amber-600 font-medium mt-0.5">{openCorrections} open</p>
              )}
            </div>
            <RaiseCorrectionModal projectId={project.id} />
          </div>

          <div className="px-5 py-4">
            {(!corrections || corrections.length === 0) ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">No corrections raised yet.</p>
                <p className="text-xs text-gray-400 mt-1">Use the button above to raise a correction request.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {corrections.map((c) => (
                  <div key={c.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{c.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CORRECTION_CATEGORY_STYLES[c.category] ?? ''}`}>
                          {c.category.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${CORRECTION_STATUS_STYLES[c.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{c.body}</p>
                    {c.admin_reply && (
                      <div className="mt-3 px-4 py-3 bg-teal-50 border border-teal-100 rounded-lg">
                        <p className="text-xs font-semibold text-teal-700 mb-1">Reply from your team</p>
                        <p className="text-sm text-gray-800">{c.admin_reply}</p>
                      </div>
                    )}
                    {Array.isArray(c.correction_attachments) && c.correction_attachments.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {c.correction_attachments.map((a: { id: string; file_url: string; filename: string }) => (
                          <a key={a.id} href={a.file_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-teal-700 hover:underline bg-white border border-teal-200 px-2 py-1 rounded-lg">
                            📎 {a.filename}
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-500 mt-0.5">Direct communication with your thesis team</p>
          </div>
          <div className="px-5 py-4">
            <ClientMessagePanel messages={messages ?? []} projectId={project.id} />
          </div>
        </div>

        {/* ── Project details ── */}
        <CollapsibleDetails project={project} />

        <div className="h-4" />
      </main>
    </div>
  )
}

function ClientHeader({ name }: { name: string }) {
  return (
    <header className="bg-teal-900 text-white sticky top-0 z-10 shadow-md">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
            BT
          </div>
          <span className="font-semibold text-white text-sm">Beyond Thesis</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-teal-200 hidden sm:block">{name}</span>
          <a href="/change-password" className="text-sm text-teal-300 hover:text-white transition-colors hidden sm:block">
            Change password
          </a>
          <form action={signOut}>
            <button type="submit" className="text-sm text-teal-300 hover:text-white transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
