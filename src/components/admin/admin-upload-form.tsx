'use client'

import { useState, useTransition } from 'react'
import { uploadDeliverable } from '@/app/actions/deliverables'

const ALL_CHAPTERS = [
  { value: 'master_dataset', label: 'Master Dataset', stage: 1 },
  { value: 'tables', label: 'Tables', stage: 1 },
  { value: 'charts', label: 'Charts', stage: 1 },
  { value: 'results', label: 'Results Chapter', stage: 1 },
  { value: 'r_script', label: 'R Script', stage: 1 },
  { value: 'python_script', label: 'Python Script', stage: 1 },
  { value: 'introduction', label: 'Introduction', stage: 2 },
  { value: 'review_of_literature', label: 'Review of Literature', stage: 2 },
  { value: 'materials_and_methods', label: 'Materials & Methods', stage: 2 },
  { value: 'discussion', label: 'Discussion', stage: 3 },
  { value: 'conclusion', label: 'Conclusion', stage: 3 },
  { value: 'references', label: 'References', stage: 3 },
  { value: 'annexures', label: 'Annexures', stage: 3 },
  { value: 'final_draft', label: 'Final Compiled Thesis', stage: 3 },
  { value: 'other', label: 'Other', stage: 1 },
]

export default function AdminUploadForm({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [chapter, setChapter] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const selectedChapter = ALL_CHAPTERS.find((c) => c.value === chapter)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!chapter) { setError('Select a chapter type.'); return }
    if (!file) { setError('Select a file to upload.'); return }

    const formData = new FormData()
    formData.set('project_id', projectId)
    formData.set('stage', String(selectedChapter?.stage ?? 1))
    formData.set('chapter', chapter)
    formData.set('file', file)

    startTransition(async () => {
      try {
        await uploadDeliverable(formData)
        setSuccess(true)
        setChapter('')
        setFile(null)
        setTimeout(() => { setSuccess(false); setOpen(false) }, 1500)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed.')
      }
    })
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs px-3 py-1.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white rounded transition-colors"
      >
        + Upload file
      </button>

      {open && (
        <div className="mt-3 bg-white border border-[#E5E5E5] rounded-lg p-4">
          {success ? (
            <p className="text-sm text-[#1F7A3D]">✓ Uploaded successfully.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">Chapter / file type</label>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                >
                  <option value="">— Select —</option>
                  <optgroup label="Stage 1">
                    {ALL_CHAPTERS.filter((c) => c.stage === 1).map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Stage 2">
                    {ALL_CHAPTERS.filter((c) => c.stage === 2).map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Stage 3">
                    {ALL_CHAPTERS.filter((c) => c.stage === 3).map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">File</label>
                <input
                  type="file"
                  accept=".docx,.doc,.pdf,.xlsx,.csv,.r,.py"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-[#666666] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#F8F8F7] file:text-[#1A1A1A] hover:file:bg-[#E5E5E5] cursor-pointer"
                />
                <p className="text-xs text-[#666666] mt-1">DOCX, PDF, XLSX, CSV, R, PY · max 50 MB</p>
              </div>

              {error && <p className="text-xs text-[#9B1C1C]">{error}</p>}

              <div className="flex gap-2">
                <button type="submit" disabled={isPending}
                  className="text-xs px-3 py-1.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white rounded transition-colors disabled:opacity-50">
                  {isPending ? 'Uploading…' : 'Upload'}
                </button>
                <button type="button" onClick={() => { setOpen(false); setError('') }}
                  className="text-xs px-3 py-1.5 border border-[#E5E5E5] text-[#666666] hover:bg-[#F8F8F7] rounded transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
