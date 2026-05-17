'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'

export async function sendMessage(projectId: string, body: string): Promise<{ error: string } | void> {
  try {
    const { user } = await requireRole('admin', 'client')
    const supabase = await createClient()

    const trimmed = body.trim()
    if (!trimmed) return { error: 'Message cannot be empty.' }

    const { error } = await supabase.from('messages').insert({
      project_id: projectId,
      sender_id: user.id,
      body: trimmed,
    })

    if (error) return { error: error.message }

    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath('/client')
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to send message.' }
  }
}
