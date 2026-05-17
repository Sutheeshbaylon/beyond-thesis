'use client'

import { useTransition } from 'react'
import { verifyPayment, rejectPayment } from '@/app/actions/payments'

type Payment = {
  id: string
  amount: number
  payment_type: string
  utr_number: string | null
  screenshot_url: string | null
  status: string
  created_at: string
  submitted_by: { full_name: string } | null
}

const STATUS_STYLES: Record<string, string> = {
  submitted: 'bg-amber-50 text-[#B07000] border border-amber-200',
  verified: 'bg-green-50 text-[#1F7A3D] border border-green-200',
  rejected: 'bg-red-50 text-[#9B1C1C] border border-red-200',
}

const TYPE_LABELS: Record<string, string> = {
  advance: 'Advance',
  balance: 'Balance',
  custom: 'Custom',
}

function PaymentRow({ p, projectId }: { p: Payment; projectId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="py-3 border-b border-[#E5E5E5] last:border-0">
      <div className="flex flex-wrap items-start gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#1A1A1A]">
              {TYPE_LABELS[p.payment_type]} — ₹{p.amount.toLocaleString('en-IN')}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[p.status]}`}>
              {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
            </span>
          </div>
          <div className="text-xs text-[#666666] mt-1">
            {p.submitted_by?.full_name} · {new Date(p.created_at).toLocaleDateString('en-IN')}
            {p.utr_number && <> · UTR: <span className="font-mono">{p.utr_number}</span></>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {p.screenshot_url && (
            <a href={`/api/download?path=${encodeURIComponent(p.screenshot_url)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1A3A5C] hover:underline">
              Screenshot
            </a>
          )}
          {p.status === 'submitted' && (
            <>
              <button
                onClick={() => startTransition(async () => { await verifyPayment(p.id, projectId) })}
                disabled={isPending}
                className="text-xs px-3 py-1.5 bg-[#1F7A3D] hover:bg-[#1a6934] text-white rounded transition-colors disabled:opacity-50"
              >
                Verify
              </button>
              <button
                onClick={() => startTransition(async () => { await rejectPayment(p.id, projectId) })}
                disabled={isPending}
                className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#9B1C1C] hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentsTab({
  payments,
  projectId,
  totalAmount,
  isAdvancePaid,
  isBalancePaid,
}: {
  payments: Payment[]
  projectId: string
  totalAmount: number
  isAdvancePaid: boolean
  isBalancePaid: boolean
}) {
  const advance = 8000
  const balance = totalAmount - advance
  const paid = payments
    .filter((p) => p.status === 'verified')
    .reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: 'Total', value: totalAmount },
          { label: 'Paid', value: paid },
          { label: 'Outstanding', value: totalAmount - paid },
        ].map((item) => (
          <div key={item.label} className="bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg px-2 sm:px-4 py-3">
            <div className="text-base sm:text-lg font-semibold text-[#1A1A1A]">
              ₹{item.value.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-[#666666] mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-xs">
        <span className={isAdvancePaid ? 'text-[#1F7A3D]' : 'text-[#B07000]'}>
          Advance ₹{advance.toLocaleString('en-IN')}: {isAdvancePaid ? 'Verified' : 'Pending'}
        </span>
        <span className={isBalancePaid ? 'text-[#1F7A3D]' : 'text-[#B07000]'}>
          Balance ₹{balance.toLocaleString('en-IN')}: {isBalancePaid ? 'Verified' : 'Pending'}
        </span>
      </div>

      {/* Payments list */}
      <div className="bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg px-4">
        {payments.length === 0 ? (
          <p className="text-sm text-[#666666] py-4">No payments submitted yet.</p>
        ) : (
          payments.map((p) => <PaymentRow key={p.id} p={p} projectId={projectId} />)
        )}
      </div>
    </div>
  )
}
