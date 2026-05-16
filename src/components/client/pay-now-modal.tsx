'use client'

import { useState, useTransition } from 'react'
import { submitPayment } from '@/app/actions/client'

export default function PayNowModal({
  projectId,
  paymentType,
  amount,
  upiId,
  upiQrUrl,
}: {
  projectId: string
  paymentType: 'advance' | 'balance'
  amount: number
  upiId: string
  upiQrUrl: string
}) {
  const [open, setOpen] = useState(false)
  const [utr, setUtr] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const utrClean = utr.trim().toUpperCase()
    if (!/^[0-9A-Z]{12}$/i.test(utrClean)) {
      setError('UTR must be exactly 12 alphanumeric characters.')
      return
    }
    if (!screenshot) {
      setError('Please upload your payment screenshot.')
      return
    }
    const formData = new FormData()
    formData.set('project_id', projectId)
    formData.set('payment_type', paymentType)
    formData.set('amount', String(amount))
    formData.set('utr', utrClean)
    formData.set('screenshot', screenshot)

    startTransition(async () => {
      try {
        await submitPayment(formData)
        setSubmitted(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-4 py-2 bg-[#1A3A5C] hover:bg-[#16324f] text-white rounded-md font-medium transition-colors"
      >
        Pay now
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Sheet — slides from bottom on mobile, centered on desktop */}
          <div className="relative w-full sm:max-w-md bg-white sm:rounded-xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">
                Pay {paymentType === 'advance' ? 'Advance' : 'Balance'} — ₹{amount.toLocaleString('en-IN')}
              </h2>
              <button
                onClick={() => !isPending && setOpen(false)}
                className="text-[#666666] hover:text-[#1A1A1A] text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-5">
              {submitted ? (
                <div className="py-4 text-center">
                  <div className="text-2xl mb-3">✓</div>
                  <p className="text-sm font-medium text-[#1F7A3D]">Payment submitted</p>
                  <p className="text-sm text-[#666666] mt-1">
                    Awaiting verification — usually within 24 hours.
                  </p>
                  <button
                    onClick={() => { setOpen(false); setSubmitted(false); setUtr(''); setScreenshot(null) }}
                    className="mt-4 text-sm text-[#1A3A5C] hover:underline"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* QR code */}
                  {upiQrUrl ? (
                    <div className="flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={upiQrUrl} alt="UPI QR code" className="w-40 h-40 object-contain border border-[#E5E5E5] rounded-lg" />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="w-40 h-40 bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg flex items-center justify-center text-xs text-[#666666] text-center px-3">
                        QR code will appear here
                      </div>
                    </div>
                  )}

                  {/* UPI ID */}
                  <div className="flex items-center gap-2 bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg px-4 py-3">
                    <span className="text-sm font-mono text-[#1A1A1A] flex-1">{upiId}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-xs text-[#1A3A5C] hover:underline whitespace-nowrap"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <p className="text-xs text-[#666666] -mt-2">
                    Open PhonePe / GPay / Paytm, scan the QR or use the UPI ID above, and pay ₹{amount.toLocaleString('en-IN')}.
                    Then come back here and fill in the details below.
                  </p>

                  {/* UTR */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Transaction ID (UTR) <span className="text-[#9B1C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.toUpperCase())}
                      maxLength={12}
                      placeholder="12-character UTR"
                      className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                    />
                    <p className="text-xs text-[#666666] mt-1">Found in your UPI app's transaction history.</p>
                  </div>

                  {/* Screenshot */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Payment screenshot <span className="text-[#9B1C1C]">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                      className="w-full text-sm text-[#666666] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#F8F8F7] file:text-[#1A1A1A] hover:file:bg-[#E5E5E5] cursor-pointer"
                    />
                    <p className="text-xs text-[#666666] mt-1">PNG or JPG, max 5 MB.</p>
                  </div>

                  {error && (
                    <p className="text-sm text-[#9B1C1C] bg-red-50 border border-red-200 rounded px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    {isPending ? 'Submitting…' : 'Submit payment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
