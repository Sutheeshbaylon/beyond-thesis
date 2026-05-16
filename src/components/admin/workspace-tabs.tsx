'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DeliverablesTab from './deliverables-tab'
import PaymentsTab from './payments-tab'

type CorrectionWithAttachments = {
  id: string
  title: string
  category: string
  body: string
  status: string
  created_at: string
  raised_by_user: { full_name: string } | null
  correction_attachments: { id: string; file_url: string; filename: string }[]
}

type Message = {
  id: string
  body: string
  created_at: string
  sender: { full_name: string } | null
}

type AuditEntry = {
  id: string
  action: string
  entity_type: string
  created_at: string
}

const CORRECTION_CATEGORY_STYLES: Record<string, string> = {
  done: 'bg-green-50 text-[#1F7A3D] border border-green-200',
  not_done: 'bg-red-50 text-[#9B1C1C] border border-red-200',
  doubts: 'bg-amber-50 text-[#B07000] border border-amber-200',
  dataset_changes: 'bg-[#F8F8F7] text-[#666666] border border-[#E5E5E5]',
}

const CORRECTION_STATUS_STYLES: Record<string, string> = {
  open: 'text-[#B07000]',
  in_progress: 'text-[#1A3A5C]',
  resolved: 'text-[#1F7A3D]',
  declined: 'text-[#9B1C1C]',
}

export default function WorkspaceTabs({
  projectId,
  currentStage,
  isAdvancePaid,
  isBalancePaid,
  totalAmount,
  deliverables,
  corrections,
  payments,
  messages,
  auditLog,
}: {
  projectId: string
  currentStage: number
  isAdvancePaid: boolean
  isBalancePaid: boolean
  totalAmount: number
  deliverables: Parameters<typeof DeliverablesTab>[0]['deliverables']
  corrections: CorrectionWithAttachments[]
  payments: Parameters<typeof PaymentsTab>[0]['payments']
  messages: Message[]
  auditLog: AuditEntry[]
}) {
  const pendingDeliverables = deliverables.filter((d) => d.status === 'submitted_for_review').length
  const pendingPayments = payments.filter((p) => p.status === 'submitted').length

  return (
    <Tabs defaultValue="deliverables">
      <TabsList className="bg-white border border-[#E5E5E5] rounded-lg p-1 mb-4 h-auto flex-wrap gap-1">
        {[
          { value: 'deliverables', label: 'Deliverables', count: pendingDeliverables },
          { value: 'corrections', label: 'Corrections', count: corrections.filter(c => c.status === 'open').length },
          { value: 'payments', label: 'Payments', count: pendingPayments },
          { value: 'messages', label: 'Messages', count: 0 },
          { value: 'activity', label: 'Activity', count: 0 },
        ].map(({ value, label, count }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="text-sm px-4 py-2 data-[state=active]:bg-[#1A3A5C] data-[state=active]:text-white rounded-md transition-colors"
          >
            {label}
            {count > 0 && (
              <span className="ml-1.5 text-xs bg-[#B07000] text-white rounded-full w-4 h-4 inline-flex items-center justify-center">
                {count}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="deliverables">
        <DeliverablesTab
          deliverables={deliverables}
          projectId={projectId}
          currentStage={currentStage}
          isBalancePaid={isBalancePaid}
        />
      </TabsContent>

      <TabsContent value="corrections">
        <div className="space-y-3">
          {corrections.length === 0 ? (
            <p className="text-sm text-[#666666] py-4">No corrections raised yet.</p>
          ) : (
            corrections.map((c) => (
              <div key={c.id} className="bg-white border border-[#E5E5E5] rounded-lg p-4">
                <div className="flex flex-wrap items-start gap-2 justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#1A1A1A]">{c.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${CORRECTION_CATEGORY_STYLES[c.category]}`}>
                      {c.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className={`text-xs ${CORRECTION_STATUS_STYLES[c.status]}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-[#666666] leading-relaxed">{c.body}</p>
                {c.correction_attachments.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {c.correction_attachments.map((a) => (
                      <a key={a.id} href={a.file_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#1A3A5C] hover:underline border border-[#E5E5E5] px-2 py-1 rounded">
                        {a.filename}
                      </a>
                    ))}
                  </div>
                )}
                <div className="text-xs text-[#666666] mt-2">
                  {c.raised_by_user?.full_name} · {new Date(c.created_at).toLocaleDateString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="payments">
        <PaymentsTab
          payments={payments}
          projectId={projectId}
          totalAmount={totalAmount}
          isAdvancePaid={isAdvancePaid}
          isBalancePaid={isBalancePaid}
        />
      </TabsContent>

      <TabsContent value="messages">
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 space-y-3 max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-[#666666]">No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id}>
                <div className="text-xs text-[#666666] mb-0.5">
                  {m.sender?.full_name} · {new Date(m.created_at).toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-[#1A1A1A] bg-[#F8F8F7] rounded-lg px-3 py-2">
                  {m.body}
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="activity">
        <div className="bg-white border border-[#E5E5E5] rounded-lg divide-y divide-[#E5E5E5]">
          {auditLog.length === 0 ? (
            <p className="text-sm text-[#666666] px-4 py-4">No activity recorded yet.</p>
          ) : (
            auditLog.map((entry) => (
              <div key={entry.id} className="px-4 py-3">
                <div className="text-sm text-[#1A1A1A]">{entry.action}</div>
                <div className="text-xs text-[#666666] mt-0.5">
                  {entry.entity_type} · {new Date(entry.created_at).toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
