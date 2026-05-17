import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { signOut } from '@/app/actions/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole('admin')

  return (
    <div className="min-h-screen bg-[#F8F8F7]">
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1A1A1A] text-sm">Beyond Thesis</span>
              <span className="text-xs px-2 py-0.5 bg-[#1A3A5C] text-white rounded font-medium">Admin</span>
            </div>
            <nav className="flex items-center gap-1">
              <Link href="/admin" className="text-sm px-3 py-1.5 text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F8F8F7] rounded-md transition-colors">
                Pipeline
              </Link>
              <Link href="/admin/corrections" className="text-sm px-3 py-1.5 text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F8F8F7] rounded-md transition-colors">
                Corrections
              </Link>
              <Link href="/admin/quotes" className="text-sm px-3 py-1.5 text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F8F8F7] rounded-md transition-colors">
                Quotes
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#666666] hidden sm:block">{profile.full_name}</span>
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
