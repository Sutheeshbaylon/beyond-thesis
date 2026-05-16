'use client'

import { useState } from 'react'

type Project = {
  title: string
  specialty: string
  study_design: string | null
  sample_size: number | null
  college: string | null
  university: string | null
  guide_name: string | null
  submission_deadline: string | null
  tier: string
  total_amount: number
}

const TIER_LABELS: Record<string, string> = {
  standard: 'Standard', special: 'Special', super: 'Super', custom: 'Custom',
}

export default function CollapsibleDetails({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)

  const fields = [
    { label: 'Specialty', value: project.specialty },
    { label: 'Study design', value: project.study_design },
    { label: 'Sample size', value: project.sample_size ? `N = ${project.sample_size}` : null },
    { label: 'College', value: project.college },
    { label: 'University', value: project.university },
    { label: 'Guide', value: project.guide_name },
    { label: 'Deadline', value: project.submission_deadline ? new Date(project.submission_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null },
    { label: 'Tier', value: TIER_LABELS[project.tier] },
    { label: 'Total', value: `₹${project.total_amount.toLocaleString('en-IN')}` },
  ].filter((f) => f.value)

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden mb-8">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F8F8F7] transition-colors"
      >
        <span>Project details</span>
        <span className="text-[#666666] text-xs">{open ? '▲ Hide' : '▼ Show'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-[#E5E5E5]">
          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-xs text-[#666666]">{f.label}</dt>
                <dd className="text-sm text-[#1A1A1A] mt-0.5">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}
