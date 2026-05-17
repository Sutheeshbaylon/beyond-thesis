'use client'

import { useState, useTransition } from 'react'
import { submitForReview } from '@/app/actions/staff'
import { deleteDeliverable } from '@/app/actions/deliverables'
import UploadDeliverableForm from './upload-deliverable-form'

type Deliverable = {
  id: string
  chapter: string
  filename: string
  file_url: string
  version: number
  status: string
  admin_notes: string | null
  stage: number
  created_at: string
}

const CHAPTER_LABELS: Record<string, string> = {
  master_dataset: 'Master Dataset', tables: 'Tables', charts: 'Charts',
  results: 'Results Chapter', introduction: 'Introduction',
  review_of_literature: 'Review of Literature', materials_and_methods: 'Materials & Methods',
  discussion: 'Discussion', conclusion: 'Conclusion', references: 'References',
  annexures: 'Annexures', final_draft: 'Final Compiled Thesis',
  r_script: 'R Script', python_script: 'Python Script', other: 'Other',
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-[#F8F8F7] text-[#666666] border border-[#E5E5E5]',
  submitted_for_review: 'bg-amber-50 text-[#B07000] border border-amber-200',
  approved: 'bg-green-50 text-[#1F7A3D] border border-green-200',
  revision_requested: 'bg-red-50 text-[#9B1C1C] border border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted_for_review: 'Pending review',
  approved: 'Approved',
  revision_requested: 'Revision requested',
}

function DeliverableRow({
  d, projectId, role,
}: {
  d: Deliverable; projectId: string; role: 'writer' | 'stats'
}) {
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const canDelete = d.status === 'draft' || d.status === 'revision_requested'

  return (
    <div className="py-3 border-b border-[#E5E5E5] last:border-0">
      <div className="flex flex-wrap items-start gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#1A1A1A]">
              {CHAPTER_LABELS[d.chapter] ?? d.chapter}
            </span>
            <span className="text-xs text-[#666666]">v{d.version}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[d.status]}`}>
              {STATUS_LABELS[d.status]}
            </span>
          </div>
          <div className="text-xs text-[#666666] mt-1">
            {d.filename} · {new Date(d.created_at).toLocaleDateString('en-IN')}
          </div>
          {d.admin_notes && d.status === 'revision_requested' && (
            <div className="text-xs text-[#9B1C1C] mt-1 bg-red-50 border border-red-100 rounded px-2 py-1">
              Admin notes: {d.admin_notes}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a href={`/api/download?path=${encodeURIComponent(d.file_url)}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#1A3A5C] hover:underline">
            View
          </a>
          {canDelete && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#9B1C1C] hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}
          {canDelete && confirmDelete && (
            <>
              <span className="text-xs text-[#9B1C1C]">Delete?</span>
              <button
                onClick={() => startTransition(async () => {
                  await deleteDeliverable(d.id, projectId)
                  setConfirmDelete(false)
                })}
                disabled={isPending}
                className="text-xs px-3 py-1.5 bg-[#9B1C1C] hover:bg-[#7f1717] text-white rounded transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={isPending}
                className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#666666] hover:bg-[#F8F8F7] rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
          {(d.status === 'draft' || d.status === 'revision_requested') && !confirmDelete && (
            <button
              onClick={() => startTransition(async () => {
                await submitForReview(d.id, projectId, role)
              })}
              disabled={isPending}
              className="text-xs px-3 py-1.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white rounded transition-colors disabled:opacity-50"
            >
              {isPending ? 'Submitting…' : 'Submit for review'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StaffDeliverables({
  deliverables, projectId, role, currentStage,
}: {
  deliverables: Deliverable[]
  projectId: string
  role: 'writer' | 'stats'
  currentStage: number
}) {
  const stages = role === 'stats' ? [1] : [1, 2, 3]

  return (
    <div className="space-y-6">
      {stages.map((stage) => {
        const stageDels = deliverables.filter((d) => d.stage === stage)
        return (
          <div key={stage}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#1A1A1A]">Stage {stage}</h3>
              <UploadDeliverableForm projectId={projectId} role={role} currentStage={currentStage} />
            </div>
            <div className="bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg px-4">
              {stageDels.length === 0 ? (
                <p className="text-sm text-[#666666] py-4">No files uploaded yet.</p>
              ) : (
                stageDels.map((d) => (
                  <DeliverableRow key={d.id} d={d} projectId={projectId} role={role} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
