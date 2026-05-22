'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { updatePassword } from '@/app/actions/auth'
import PasswordInput from '@/components/password-input'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState(searchParams.get('error') === 'expired'
    ? 'This reset link has expired or already been used. Please request a new one.'
    : ''
  )
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    const result = await updatePassword(formData)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setDone(true)
      setTimeout(() => router.push('/login'), 2500)
    }
  }

  if (done) return (
    <div className="text-center space-y-2">
      <p className="text-sm font-medium text-[#1A1A1A]">Password updated</p>
      <p className="text-sm text-[#666666]">Redirecting you to sign in…</p>
    </div>
  )

  if (error) return (
    <div className="space-y-4">
      <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-sm text-[#9B1C1C]">
        {error}
      </div>
      <a href="/forgot-password" className="text-sm text-[#1A3A5C] hover:underline block text-center">
        Request a new reset link
      </a>
    </div>
  )

  return (
    <>
      <p className="text-sm text-[#666666] mb-4">Enter your new password.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            New password
          </label>
          <PasswordInput id="password" name="password" required autoComplete="new-password" />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            Confirm password
          </label>
          <PasswordInput id="confirm" name="confirm" required autoComplete="new-password" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#1A3A5C] hover:bg-[#16324f] disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
        >
          {loading ? 'Saving…' : 'Set new password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Beyond Thesis</h1>
          <p className="text-sm text-[#666666] mt-1">Beyond Research Unit · Thesis Support Portal</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-6 shadow-sm">
          <Suspense fallback={<p className="text-sm text-[#666666] text-center">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
