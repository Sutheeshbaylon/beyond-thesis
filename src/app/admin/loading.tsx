export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-14 bg-white border-b border-[#E5E5E5]" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-[#E5E5E5]" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-xl border border-[#E5E5E5]" />
      </div>
    </div>
  )
}
