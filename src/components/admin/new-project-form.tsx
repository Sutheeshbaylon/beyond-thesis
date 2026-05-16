'use client'

import { useState } from 'react'
import { createProject } from '@/app/actions/projects'

type User = { id: string; full_name: string; email?: string }

const SPECIALTIES = [
  'General Medicine', 'General Surgery', 'Obstetrics & Gynaecology', 'Paediatrics',
  'Orthopaedics', 'Anaesthesia', 'Radiology', 'Dermatology', 'Ophthalmology',
  'ENT', 'Psychiatry', 'Cardiology', 'Neurology', 'Nephrology', 'Gastroenterology',
  'Pulmonology', 'Endocrinology', 'Oncology', 'Pathology', 'Microbiology',
  'Biochemistry', 'Pharmacology', 'Community Medicine', 'Forensic Medicine', 'Other',
]

const STUDY_DESIGNS = [
  'Prospective observational', 'Retrospective observational', 'Case-control',
  'Cross-sectional', 'Randomized controlled trial', 'Quasi-experimental',
  'Case series', 'Case report', 'Systematic review', 'Meta-analysis',
]

export default function NewProjectForm({
  clients,
  writers,
  statUsers,
}: {
  clients: User[]
  writers: User[]
  statUsers: User[]
}) {
  const [clientMode, setClientMode] = useState<'existing' | 'new'>('existing')
  const [tier, setTier] = useState('standard')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const tierTotals: Record<string, number> = { standard: 16000, special: 15000, super: 12500 }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    formData.set('client_mode', clientMode)
    const result = await createProject(formData)
    if (result?.error) {
      setErrorMsg(result.error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Client */}
      <section className="bg-white border border-[#E5E5E5] rounded-lg p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">1. Client</h2>
        <div className="flex gap-2 mb-4">
          {(['existing', 'new'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setClientMode(mode)}
              className={`text-sm px-4 py-2 rounded-md border transition-colors ${
                clientMode === mode
                  ? 'bg-[#1A3A5C] text-white border-[#1A3A5C]'
                  : 'border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F8F8F7]'
              }`}
            >
              {mode === 'existing' ? 'Existing client' : '+ New client'}
            </button>
          ))}
        </div>

        {clientMode === 'existing' ? (
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Select client</label>
            <select
              name="client_id"
              required
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            >
              <option value="">— Select —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.email})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" name="client_full_name" required placeholder="Dr. Adarsh Kumar" />
            <Field label="Email" name="client_email" type="email" required placeholder="adarsh@example.com" />
            <Field label="Phone" name="client_phone" placeholder="+91 9876543210" />
          </div>
        )}
      </section>

      {/* Section 2: Project details */}
      <section className="bg-white border border-[#E5E5E5] rounded-lg p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">2. Project details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Thesis title" name="title" required placeholder="A study on…" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Specialty</label>
            <select
              name="specialty"
              required
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            >
              <option value="">— Select —</option>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Study design</label>
            <select
              name="study_design"
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            >
              <option value="">— Select —</option>
              {STUDY_DESIGNS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Field label="Sample size (N)" name="sample_size" type="number" placeholder="120" />
          <Field label="Submission deadline" name="submission_deadline" type="date" />
          <Field label="College" name="college" placeholder="AIIMS, New Delhi" />
          <Field label="University" name="university" placeholder="Delhi University" />
          <Field label="Guide name" name="guide_name" placeholder="Prof. Dr. Sharma" />
        </div>
      </section>

      {/* Section 3: Pricing */}
      <section className="bg-white border border-[#E5E5E5] rounded-lg p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">3. Pricing tier</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { value: 'standard', label: 'Standard', amount: 16000 },
            { value: 'special', label: 'Special', amount: 15000 },
            { value: 'super', label: 'Super', amount: 12500 },
            { value: 'custom', label: 'Custom', amount: null },
          ].map(({ value, label, amount }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTier(value)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                tier === value
                  ? 'border-[#1A3A5C] bg-[#1A3A5C]/5'
                  : 'border-[#E5E5E5] hover:bg-[#F8F8F7]'
              }`}
            >
              <div className="text-sm font-medium text-[#1A1A1A]">{label}</div>
              {amount && <div className="text-xs text-[#666666] mt-0.5">₹{amount.toLocaleString('en-IN')}</div>}
            </button>
          ))}
        </div>
        <input type="hidden" name="tier" value={tier} />
        {tier === 'custom' ? (
          <Field label="Total amount (₹)" name="custom_total" type="number" required placeholder="14000" />
        ) : (
          <div className="text-sm text-[#666666]">
            Total: ₹{(tierTotals[tier] ?? 0).toLocaleString('en-IN')} · Advance: ₹8,000 · Balance: ₹{((tierTotals[tier] ?? 0) - 8000).toLocaleString('en-IN')}
          </div>
        )}
      </section>

      {/* Section 4: Team */}
      <section className="bg-white border border-[#E5E5E5] rounded-lg p-5">
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4">4. Team (optional)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Assign writer</label>
            <select
              name="writer_id"
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            >
              <option value="">— None —</option>
              {writers.map((w) => <option key={w.id} value={w.id}>{w.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Assign statistician</label>
            <select
              name="stats_id"
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            >
              <option value="">— None —</option>
              {statUsers.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>
        </div>
      </section>

      {errorMsg && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#9B1C1C]">
          {errorMsg}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating…' : 'Create project'}
        </button>
        <a href="/admin" className="text-sm text-[#666666] hover:text-[#1A1A1A]">Cancel</a>
      </div>
    </form>
  )
}

function Field({
  label, name, type = 'text', required, placeholder,
}: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
        {label}{required && <span className="text-[#9B1C1C] ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
      />
    </div>
  )
}
