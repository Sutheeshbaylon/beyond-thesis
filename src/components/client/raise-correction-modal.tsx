'use client'

import { useState, useTransition } from 'react'
import { raiseCorrection } from '@/app/actions/client'

const CATEGORIES = [
  { value: 'done', label: 'DONE — Item completed in this revision' },
  { value: 'not_done', label: 'NOT DONE — Item declined with reasons' },
  { value: 'doubts', label: 'DOUBTS — Question to team / guide' },
]

export default function RaiseCorrectionModal({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('done')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState<(File | null)[]>([null, null, null])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleFileChange(index: number, file: File | null) {
    setFiles((prev) => prev.map((f, i) => (i === index ? file : f)))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Title is required.'); return }
    if (!body.trim()) { setError('Description is required.'); return }

    const formData = new FormData()
    formData.set('project_id', projectId)
    formData.set('title', title.trim())
    formData.set('category', category)
    formData.set('body', body.trim())
    files.forEach((file, i) => { if (file) formData.set(`attachment_${i}`, file) })

    startTransition(async () => {
      try {
        await raiseCorrection(formData)
        setSubmitted(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  function handleClose() {
    if (isPending) return
    setOpen(false)
    setSubmitted(false)
    setTitle('')
    setCategory('done')
    setBody('')
    setFiles([null, null, null])
    setError('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-4 py-2 border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F8F8F7] rounded-md transition-colors font-medium"
      >
        + Raise a correction
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
              <h2 className="font-semibold text-[#1A1A1A]">Raise a correction</h2>
              <button onClick={handleClose} className="text-[#666666] hover:text-[#1A1A1A] text-xl leading-none">×</button>
            </div>

            <div className="px-5 py-5">
              {submitted ? (
                <div className="py-4 text-center">
                  <div className="text-2xl mb-3">✓</div>
                  <p className="text-sm font-medium text-[#1F7A3D]">Correction submitted</p>
                  <p className="text-sm text-[#666666] mt-1">The team has been notified.</p>
                  <button onClick={handleClose} className="mt-4 text-sm text-[#1A3A5C] hover:underline">Close</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Title <span className="text-[#9B1C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Table 3 values incorrect"
                      className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Category</label>
                    <div className="space-y-2">
                      {CATEGORIES.map((c) => (
                        <label
                          key={c.value}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            category === c.value
                              ? 'border-[#1A3A5C] bg-[#1A3A5C]/5'
                              : 'border-[#E5E5E5] hover:bg-[#F8F8F7]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={c.value}
                            checked={category === c.value}
                            onChange={() => setCategory(c.value)}
                            className="mt-0.5 accent-[#1A3A5C]"
                          />
                          <span className="text-sm text-[#1A1A1A]">{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Description <span className="text-[#9B1C1C]">*</span>
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Describe the issue or question in detail…"
                      rows={4}
                      className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Attachments <span className="text-[#666666] font-normal">(up to 3, max 5 MB each)</span>
                    </label>
                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <input
                          key={i}
                          type="file"
                          accept="image/png,image/jpeg,application/pdf"
                          onChange={(e) => handleFileChange(i, e.target.files?.[0] ?? null)}
                          className="w-full text-sm text-[#666666] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#F8F8F7] file:text-[#1A1A1A] hover:file:bg-[#E5E5E5] cursor-pointer"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#666666] mt-1">PNG, JPG, or PDF only.</p>
                  </div>

                  {error && (
                    <p className="text-sm text-[#9B1C1C] bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2.5 bg-[#1A3A5C] hover:bg-[#16324f] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    {isPending ? 'Submitting…' : 'Submit correction'}
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
