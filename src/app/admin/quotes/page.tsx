import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import QuotesClient from '@/components/admin/quotes-client'

export default async function AdminQuotesPage() {
  await requireRole('admin')
  const supabase = await createClient()

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[#1A1A1A]">Quote Requests</h1>
          <p className="text-sm text-[#666666] mt-0.5">{(quotes ?? []).length} total</p>
        </div>
        <Link href="/admin" className="text-sm text-[#1A3A5C] hover:underline">← Pipeline</Link>
      </div>
      <QuotesClient quotes={quotes ?? []} />
    </main>
  )
}
