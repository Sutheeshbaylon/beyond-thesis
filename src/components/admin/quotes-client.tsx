'use client'

import { useTransition } from 'react'
import { updateQuoteStatus } from '@/app/actions/quotes-admin'

type Quote = {
  id: string
  name: string
  email: string
  phone: string | null
  specialty: string
  message: string | null
  status: string
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-amber-50 text-[#B07000] border border-amber-200',
  contacted: 'bg-blue-50 text-[#1A3A5C] border border-blue-200',
  closed: 'bg-green-50 text-[#1F7A3D] border border-green-200',
}

function QuoteRow({ q }: { q: Quote }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg p-4">
      <div className="flex flex-wrap items-start gap-2 justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#1A1A1A]">{q.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[q.status]}`}>
              {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
            </span>
          </div>
          <div className="text-xs text-[#666666] mt-0.5">
            <a href={`mailto:${q.email}`} className="hover:underline text-[#1A3A5C]">{q.email}</a>
            {q.phone && <> · {q.phone}</>}
            {' · '}{new Date(q.created_at).toLocaleDateString('en-IN')}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {q.status === 'new' && (
            <button
              onClick={() => startTransition(() => updateQuoteStatus(q.id, 'contacted'))}
              disabled={isPending}
              className="text-xs px-3 py-1.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white rounded transition-colors disabled:opacity-50"
            >
              Mark contacted
            </button>
          )}
          {q.status === 'contacted' && (
            <button
              onClick={() => startTransition(() => updateQuoteStatus(q.id, 'closed'))}
              disabled={isPending}
              className="text-xs px-3 py-1.5 bg-[#1F7A3D] hover:bg-[#1a6934] text-white rounded transition-colors disabled:opacity-50"
            >
              Mark closed
            </button>
          )}
          {q.status === 'closed' && (
            <button
              onClick={() => startTransition(() => updateQuoteStatus(q.id, 'new'))}
              disabled={isPending}
              className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#666666] hover:bg-[#F8F8F7] rounded transition-colors disabled:opacity-50"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
      <div className="text-xs text-[#666666] mt-1">
        <span className="font-medium text-[#1A1A1A]">Specialty:</span> {q.specialty}
      </div>
      {q.message && (
        <p className="text-sm text-[#666666] mt-2 leading-relaxed">{q.message}</p>
      )}
    </div>
  )
}

export default function QuotesClient({ quotes }: { quotes: Quote[] }) {
  if (quotes.length === 0) {
    return <p className="text-sm text-[#666666]">No quote requests yet.</p>
  }

  const newQuotes = quotes.filter((q) => q.status === 'new')
  const contacted = quotes.filter((q) => q.status === 'contacted')
  const closed = quotes.filter((q) => q.status === 'closed')

  return (
    <div className="space-y-8">
      {newQuotes.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-[#1A1A1A] mb-3">New ({newQuotes.length})</h2>
          <div className="space-y-3">{newQuotes.map((q) => <QuoteRow key={q.id} q={q} />)}</div>
        </section>
      )}
      {contacted.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-[#1A1A1A] mb-3">Contacted ({contacted.length})</h2>
          <div className="space-y-3">{contacted.map((q) => <QuoteRow key={q.id} q={q} />)}</div>
        </section>
      )}
      {closed.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-[#666666] mb-3">Closed ({closed.length})</h2>
          <div className="space-y-3">{closed.map((q) => <QuoteRow key={q.id} q={q} />)}</div>
        </section>
      )}
    </div>
  )
}
