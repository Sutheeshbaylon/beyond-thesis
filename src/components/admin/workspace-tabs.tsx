'use client'

import { useState, useTransition } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DeliverablesTab from './deliverables-tab'
import PaymentsTab from './payments-tab'
import CorrectionCard from './correction-card'
import { sendMessage } from '@/app/actions/messages'

type CorrectionWithAttachments = {
  id: string
  title: string
  category: string
  body: string
  status: string
  admin_reply?: string | null
  created_at: string
  raised_by_user: { full_name: string } | null
  correction_attachments: { id: string; file_url: string; filename: string }[]
}

type AuditEntry = {
  id: string
  action: string
  entity_type: string
  created_at: string
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
              <CorrectionCard key={c.id} c={c} projectId={projectId} />
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
        <MessagePanel messages={messages} projectId={projectId} />
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

type Message = { id: string; body: string; created_at: string; sender: { full_name: string } | null }

function MessagePanel({ messages, projectId }: { messages: Message[]; projectId: string }) {
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleSend() {
    setError('')
    startTransition(async () => {
      const result = await sendMessage(projectId, body)
      if (result?.error) { setError(result.error); return }
      setBody('')
    })
  }

  return (
    <div className="space-y-3">
      <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-[#666666]">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id}>
              <div className="text-xs text-[#666666] mb-0.5">
                {m.sender?.full_name} · {new Date(m.created_at).toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-[#1A1A1A] bg-[#F8F8F7] rounded-lg px-3 py-2 leading-relaxed">
                {m.body}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="space-y-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Send a message to the client…"
          rows={2}
          className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
        />
        {error && <p className="text-xs text-[#9B1C1C]">{error}</p>}
        <button
          onClick={handleSend}
          disabled={isPending || !body.trim()}
          className="text-xs px-4 py-2 bg-[#1A3A5C] hover:bg-[#16324f] text-white rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </div>
  )
}
