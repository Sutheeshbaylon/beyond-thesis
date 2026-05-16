'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { sendPaymentReceiptEmail } from '@/lib/email'
import { writeAuditLog } from '@/lib/audit'

export async function verifyPayment(paymentId: string, projectId: string) {
  const { user } = await requireRole('admin')
  const supabase = await createClient()

  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('payment_type, amount, utr_number, submitted_by')
    .eq('id', paymentId)
    .single()

  if (fetchError || !payment) throw new Error('Payment not found.')

  const { error } = await supabase
    .from('payments')
    .update({ status: 'verified', verified_by: user.id, verified_at: new Date().toISOString() })
    .eq('id', paymentId)

  if (error) throw new Error(error.message)

  // Update project flags
  const update: Record<string, boolean> = {}
  if (payment.payment_type === 'advance') update.is_advance_paid = true
  if (payment.payment_type === 'balance') update.is_balance_paid = true

  if (Object.keys(update).length > 0) {
    await supabase.from('projects').update(update).eq('id', projectId)
  }

  // Send receipt email to client
  const { data: project } = await supabase
    .from('projects')
    .select('title, client:users!projects_client_id_fkey(full_name, email)')
    .eq('id', projectId)
    .single()

  if (project) {
    const clientRaw = project.client as unknown
    const clientObj = (Array.isArray(clientRaw) ? clientRaw[0] : clientRaw) as { full_name: string; email: string } | null | undefined
    if (clientObj?.email) {
      await sendPaymentReceiptEmail({
        to: clientObj.email,
        name: clientObj.full_name,
        paymentType: payment.payment_type,
        amount: payment.amount,
        utrNumber: payment.utr_number ?? '',
        projectTitle: project.title,
      }).catch(console.error)
    }
  }

  await writeAuditLog({
    userId: user.id,
    action: `Payment verified — ₹${payment.amount} ${payment.payment_type}`,
    entityType: 'payment',
    entityId: paymentId,
    details: { projectId, amount: payment.amount, type: payment.payment_type },
  })

  revalidatePath(`/admin/projects/${projectId}`)
}

export async function rejectPayment(paymentId: string, projectId: string) {
  const { user } = await requireRole('admin')
  const supabase = await createClient()

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId)

  if (error) throw new Error(error.message)

  await writeAuditLog({
    userId: user.id,
    action: 'Payment rejected',
    entityType: 'payment',
    entityId: paymentId,
    details: { projectId },
  })

  revalidatePath(`/admin/projects/${projectId}`)
}
