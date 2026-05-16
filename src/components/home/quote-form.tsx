'use client'

import { useState } from 'react'
import { submitQuote } from '@/app/actions/quote'

const SPECIALTIES = [
  'General Medicine', 'General Surgery', 'Obstetrics & Gynaecology', 'Paediatrics',
  'Orthopaedics', 'Anaesthesia', 'Radiology', 'Dermatology', 'Ophthalmology',
  'ENT', 'Psychiatry', 'Cardiology', 'Neurology', 'Nephrology', 'Gastroenterology',
  'Pulmonology', 'Endocrinology', 'Oncology', 'Pathology', 'Microbiology',
  'Community Medicine', 'Forensic Medicine', 'Other',
]

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const formData = new FormData(e.currentTarget)
    const result = await submitQuote(formData)
    if (result?.error) {
      setErrorMsg(result.error)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-3">✓</div>
        <p className="text-lg font-semibold text-[#1A1A1A]">Request received</p>
        <p className="text-[#666666] mt-1 text-sm">We'll get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Full name *</label>
          <input name="name" required placeholder="Dr. Adarsh Kumar"
            className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email *</label>
          <input name="email" type="email" required placeholder="you@example.com"
            className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Phone</label>
          <input name="phone" placeholder="+91 9876543210"
            className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Specialty *</label>
          <select name="specialty" required
            className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]">
            <option value="">— Select —</option>
            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Message (optional)</label>
        <textarea name="message" rows={3} placeholder="Tell us about your thesis timeline, guide requirements, or anything else…"
          className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]" />
      </div>
      {status === 'error' && (
        <p className="text-sm text-[#9B1C1C]">{errorMsg}</p>
      )}
      <button type="submit" disabled={status === 'loading'}
        className="w-full sm:w-auto px-6 py-2.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50">
        {status === 'loading' ? 'Sending…' : 'Send request'}
      </button>
    </form>
  )
}
