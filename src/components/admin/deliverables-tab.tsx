'use client'

import { useState, useTransition } from 'react'
import { approveDeliverable, sendBackDeliverable, deleteDeliverable } from '@/app/actions/deliverables'

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
  uploader: { full_name: string } | null
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

const CHAPTER_LABELS: Record<string, string> = {
  master_dataset: 'Master Dataset',
  tables: 'Tables',
  charts: 'Charts',
  results: 'Results',
  introduction: 'Introduction',
  review_of_literature: 'Review of Literature',
  materials_and_methods: 'Materials & Methods',
  discussion: 'Discussion',
  conclusion: 'Conclusion',
  references: 'References',
  annexures: 'Annexures',
  final_draft: 'Final Draft',
  r_script: 'R Script',
  python_script: 'Python Script',
  other: 'Other',
}

function DeliverableRow({ d, projectId }: { d: Deliverable; projectId: string }) {
  const [isPending, startTransition] = useTransition()
  const [showSendBack, setShowSendBack] = useState(false)
  const [notes, setNotes] = useState(d.admin_notes ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleApprove() {
    startTransition(async () => {
      await approveDeliverable(d.id, projectId)
    })
  }

  function handleSendBack() {
    startTransition(async () => {
      await sendBackDeliverable(d.id, projectId, notes)
      setShowSendBack(false)
    })
  }

  return (
    <div className="py-3 border-b border-[#E5E5E5] last:border-0">
      <div className="flex flex-wrap items-start gap-2 justify-between">
        <div className="flex-1 min-w-0">
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
            {d.filename} · {d.uploader?.full_name} ·{' '}
            {new Date(d.created_at).toLocaleDateString('en-IN')}
          </div>
          {d.admin_notes && d.status === 'revision_requested' && (
            <div className="text-xs text-[#9B1C1C] mt-1">Notes: {d.admin_notes}</div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`/api/download?path=${encodeURIComponent(d.file_url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#1A3A5C] hover:underline"
          >
            View
          </a>
          {d.status === 'submitted_for_review' && !confirmDelete && (
            <>
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="text-xs px-3 py-1.5 bg-[#1F7A3D] hover:bg-[#1a6934] text-white rounded transition-colors disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => setShowSendBack((s) => !s)}
                disabled={isPending}
                className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F8F8F7] rounded transition-colors disabled:opacity-50"
              >
                Send back
              </button>
            </>
          )}
          {!confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#9B1C1C] hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}
          {confirmDelete && (
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
        </div>
      </div>

      {showSendBack && (
        <div className="mt-3 space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Explain what needs to be revised…"
            rows={2}
            className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSendBack}
              disabled={isPending || !notes.trim()}
              className="text-xs px-3 py-1.5 bg-[#9B1C1C] hover:bg-[#7f1717] text-white rounded transition-colors disabled:opacity-50"
            >
              Send back
            </button>
            <button
              onClick={() => setShowSendBack(false)}
              className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#666666] hover:bg-[#F8F8F7] rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DeliverablesTab({
  deliverables,
  projectId,
  currentStage,
  isBalancePaid,
}: {
  deliverables: Deliverable[]
  projectId: string
  currentStage: number
  isBalancePaid: boolean
}) {
  const stages = [1, 2, 3]

  return (
    <div className="space-y-6">
      {!isBalancePaid && currentStage === 3 && (
        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-[#B07000]">
          Balance payment not yet verified. Stage 3 final draft will be locked for the client until balance is paid.
        </div>
      )}
      {stages.map((stage) => {
        const stageDels = deliverables.filter((d) => d.stage === stage)
        return (
          <div key={stage}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[#1A1A1A]">Stage {stage}</h3>
              <span className="text-xs text-[#666666]">{stageDels.length} file{stageDels.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="bg-[#F8F8F7] border border-[#E5E5E5] rounded-lg px-4">
              {stageDels.length === 0 ? (
                <p className="text-sm text-[#666666] py-4">No files uploaded yet.</p>
              ) : (
                stageDels.map((d) => (
                  <DeliverableRow key={d.id} d={d} projectId={projectId} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
