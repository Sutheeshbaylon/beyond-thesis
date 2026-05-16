'use client'

export default function WriterError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-8 max-w-md w-full text-center">
        <div className="text-2xl mb-3">⚠</div>
        <h2 className="font-semibold text-[#1A1A1A] mb-2">Something went wrong</h2>
        <p className="text-sm text-[#666666] mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <button onClick={reset}
          className="px-5 py-2 bg-[#1A3A5C] text-white text-sm font-medium rounded-md hover:bg-[#16324f] transition-colors">
          Try again
        </button>
      </div>
    </div>
  )
}
