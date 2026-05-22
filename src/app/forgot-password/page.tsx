'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { sendPasswordResetEmail } from '@/app/actions/auth'

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(
    searchParams.get('error') === 'expired' ? 'That reset link expired. Enter your email to get a new one.' : ''
  )
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await sendPasswordResetEmail(new FormData(e.currentTarget))
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Beyond Thesis</h1>
          <p className="text-sm text-[#666666] mt-1">Beyond Research Unit · Thesis Support Portal</p>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-lg p-6 shadow-sm">
          {sent ? (
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-[#1A1A1A]">Check your email</p>
              <p className="text-sm text-[#666666]">
                We sent a password reset link to your email. Click the link to set a new password.
              </p>
              <a href="/login" className="text-sm text-[#1A3A5C] hover:underline block mt-4">
                Back to sign in
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#666666] mb-4">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-[#9B1C1C]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm text-[#1A1A1A] bg-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C] focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#1A3A5C] hover:bg-[#16324f] disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <a href="/login" className="text-sm text-[#1A3A5C] hover:underline">
                  Back to sign in
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
