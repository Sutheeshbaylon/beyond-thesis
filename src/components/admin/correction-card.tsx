'use client'

import { useState, useTransition } from 'react'
import { updateCorrectionStatus, addCorrectionReply } from '@/app/actions/corrections'

type Correction = {
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

const CATEGORY_STYLES: Record<string, string> = {
  done: 'bg-green-50 text-[#1F7A3D] border border-green-200',
  not_done: 'bg-red-50 text-[#9B1C1C] border border-red-200',
  doubts: 'bg-amber-50 text-[#B07000] border border-amber-200',
  dataset_changes: 'bg-[#F8F8F7] text-[#666666] border border-[#E5E5E5]',
}

const STATUS_STYLES: Record<string, string> = {
  open: 'text-[#B07000]',
  in_progress: 'text-[#1A3A5C]',
  resolved: 'text-[#1F7A3D]',
  declined: 'text-[#9B1C1C]',
}

export default function CorrectionCard({ c, projectId }: { c: Correction; projectId: string }) {
  const [isPending, startTransition] = useTransition()
  const [showReply, setShowReply] = useState(false)
  const [reply, setReply] = useState(c.admin_reply ?? '')
  const [replyError, setReplyError] = useState('')

  function handleStatus(status: string) {
    startTransition(async () => {
      await updateCorrectionStatus(c.id, projectId, status)
    })
  }

  function handleReply() {
    setReplyError('')
    startTransition(async () => {
      const result = await addCorrectionReply(c.id, projectId, reply)
      if (result?.error) { setReplyError(result.error); return }
      setShowReply(false)
    })
  }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg p-4">
      <div className="flex flex-wrap items-start gap-2 justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-[#1A1A1A]">{c.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${CATEGORY_STYLES[c.category] ?? ''}`}>
            {c.category.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <span className={`text-xs font-medium ${STATUS_STYLES[c.status]}`}>
          {c.status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-sm text-[#666666] leading-relaxed">{c.body}</p>

      {c.correction_attachments.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {c.correction_attachments.map((a) => (
            <a key={a.id} href={`/api/download?path=${encodeURIComponent(a.file_url)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#1A3A5C] hover:underline border border-[#E5E5E5] px-2 py-1 rounded">
              {a.filename}
            </a>
          ))}
        </div>
      )}

      {c.admin_reply && (
        <div className="mt-3 px-3 py-2 bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg">
          <p className="text-xs text-[#666666] mb-1 font-medium">Your reply</p>
          <p className="text-sm text-[#1A1A1A]">{c.admin_reply}</p>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs text-[#666666]">
          {c.raised_by_user?.full_name} · {new Date(c.created_at).toLocaleDateString('en-IN')}
        </span>
        <div className="flex gap-2 ml-auto flex-wrap">
          {c.status !== 'resolved' && c.status !== 'declined' && (
            <>
              <button onClick={() => setShowReply((s) => !s)} disabled={isPending}
                className="text-xs px-2 py-1 border border-[#E5E5E5] text-[#1A3A5C] hover:bg-[#F8F8F7] rounded transition-colors disabled:opacity-50">
                {c.admin_reply ? 'Edit reply' : 'Reply'}
              </button>
              <button onClick={() => handleStatus('resolved')} disabled={isPending}
                className="text-xs px-2 py-1 bg-green-50 text-[#1F7A3D] border border-green-200 hover:bg-green-100 rounded transition-colors disabled:opacity-50">
                Resolve
              </button>
              <button onClick={() => handleStatus('declined')} disabled={isPending}
                className="text-xs px-2 py-1 bg-red-50 text-[#9B1C1C] border border-red-200 hover:bg-red-100 rounded transition-colors disabled:opacity-50">
                Decline
              </button>
            </>
          )}
          {(c.status === 'resolved' || c.status === 'declined') && (
            <button onClick={() => handleStatus('open')} disabled={isPending}
              className="text-xs px-2 py-1 border border-[#E5E5E5] text-[#666666] hover:bg-[#F8F8F7] rounded transition-colors disabled:opacity-50">
              Reopen
            </button>
          )}
        </div>
      </div>

      {showReply && (
        <div className="mt-3 space-y-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply to the client…"
            rows={3}
            className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
          />
          {replyError && <p className="text-xs text-[#9B1C1C]">{replyError}</p>}
          <div className="flex gap-2">
            <button onClick={handleReply} disabled={isPending || !reply.trim()}
              className="text-xs px-3 py-1.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white rounded transition-colors disabled:opacity-50">
              {isPending ? 'Saving…' : 'Save reply'}
            </button>
            <button onClick={() => setShowReply(false)}
              className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#666666] hover:bg-[#F8F8F7] rounded transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
