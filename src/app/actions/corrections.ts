'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { writeAuditLog } from '@/lib/audit'

export async function updateCorrectionStatus(correctionId: string, projectId: string, status: string) {
  const { user } = await requireRole('admin')
  const supabase = await createClient()

  const { error } = await supabase
    .from('correction_requests')
    .update({ status })
    .eq('id', correctionId)

  if (error) throw new Error(error.message)

  await writeAuditLog({
    userId: user.id,
    action: `Correction marked as ${status}`,
    entityType: 'correction',
    entityId: correctionId,
    details: { projectId },
  })

  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath('/admin/corrections')
}

export async function addCorrectionReply(correctionId: string, projectId: string, reply: string): Promise<{ error: string } | void> {
  try {
    const { user } = await requireRole('admin')
    const supabase = await createClient()

    const trimmed = reply.trim()
    if (!trimmed) return { error: 'Reply cannot be empty.' }

    const { error } = await supabase
      .from('correction_requests')
      .update({ admin_reply: trimmed, status: 'in_progress' })
      .eq('id', correctionId)

    if (error) return { error: error.message }

    await writeAuditLog({
      userId: user.id,
      action: 'Replied to correction request',
      entityType: 'correction',
      entityId: correctionId,
      details: { projectId },
    })

    revalidatePath(`/admin/projects/${projectId}`)
    revalidatePath('/admin/corrections')
    revalidatePath('/client')
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to save reply.' }
  }
}
