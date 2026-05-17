'use client'

import { useState, useTransition } from 'react'
import { sendMessage } from '@/app/actions/messages'

type Message = {
  id: string
  body: string
  created_at: string
  sender: { full_name: string } | { full_name: string }[] | null
}

export default function ClientMessagePanel({ messages, projectId }: { messages: Message[]; projectId: string }) {
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
      {messages.length === 0 ? (
        <p className="text-sm text-[#666666]">No messages yet.</p>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {messages.map((m) => {
            const sender = Array.isArray(m.sender) ? m.sender[0] : m.sender as { full_name: string } | null
            return (
              <div key={m.id}>
                <div className="text-xs text-[#666666] mb-0.5">
                  {sender?.full_name} · {new Date(m.created_at).toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-[#1A1A1A] bg-[#F8F8F7] rounded-lg px-3 py-2 leading-relaxed">
                  {m.body}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Send a message to your team…"
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
