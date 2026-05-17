'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'

export async function updateQuoteStatus(quoteId: string, status: string) {
  await requireRole('admin')
  const supabase = await createClient()

  const { error } = await supabase
    .from('quote_requests')
    .update({ status })
    .eq('id', quoteId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/quotes')
}
