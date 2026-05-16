export default function ClientLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-14 bg-white border-b border-[#E5E5E5]" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <div className="h-40 bg-white rounded-xl border border-[#E5E5E5]" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-xl border border-[#E5E5E5]" />
        ))}
        <div className="h-36 bg-white rounded-xl border border-[#E5E5E5]" />
      </div>
    </div>
  )
}
