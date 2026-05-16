export default function StatsLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-14 bg-white border-b border-[#E5E5E5]" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-[#E5E5E5]" />
          ))}
        </div>
        <div className="h-48 bg-white rounded-xl border border-[#E5E5E5]" />
      </div>
    </div>
  )
}
