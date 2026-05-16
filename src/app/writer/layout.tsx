import { requireRole } from '@/lib/auth'
import { signOut } from '@/app/actions/auth'

export default async function WriterLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole('writer')

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#1A1A1A] text-sm">Beyond Thesis</span>
            <span className="text-xs px-2 py-0.5 bg-[#666666] text-white rounded font-medium">Writer</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#666666]">{profile.full_name}</span>
            <form action={signOut}>
              <button type="submit" className="text-sm text-[#1A3A5C] hover:underline">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
