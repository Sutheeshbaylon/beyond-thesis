'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'

const UTR_REGEX = /^[0-9A-Z]{12}$/i
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024  // 5 MB
const MAX_DELIVERABLE_SIZE = 50 * 1024 * 1024

export async function submitPayment(formData: FormData) {
  const { user } = await requireRole('client')
  const supabase = await createClient()

  const projectId = formData.get('project_id') as string
  const paymentType = formData.get('payment_type') as string
  const amount = Number(formData.get('amount'))
  const utr = (formData.get('utr') as string).trim().toUpperCase()
  const screenshot = formData.get('screenshot') as File

  if (!UTR_REGEX.test(utr)) throw new Error('UTR must be 12 alphanumeric characters.')
  if (!screenshot || screenshot.size === 0) throw new Error('Payment screenshot is required.')
  if (screenshot.size > MAX_ATTACHMENT_SIZE) throw new Error('Screenshot must be under 5 MB.')

  // Upload screenshot
  const ext = screenshot.name.split('.').pop()
  const path = `payments/${projectId}/${user.id}/${utr}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('thesis-files')
    .upload(path, screenshot, { upsert: true })

  if (uploadError) throw new Error(uploadError.message)

  const { data: urlData } = supabase.storage.from('thesis-files').getPublicUrl(path)

  const { error } = await supabase.from('payments').insert({
    project_id: projectId,
    submitted_by: user.id,
    amount,
    payment_type: paymentType,
    utr_number: utr,
    screenshot_url: urlData.publicUrl,
    status: 'submitted',
  })

  if (error) throw new Error(error.message)
  revalidatePath('/client')
}

export async function raiseCorrection(formData: FormData) {
  const { user } = await requireRole('client')
  const supabase = await createClient()

  const projectId = formData.get('project_id') as string
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const body = formData.get('body') as string

  const { data: correction, error } = await supabase
    .from('correction_requests')
    .insert({
      project_id: projectId,
      raised_by: user.id,
      title,
      category,
      body,
      status: 'open',
    })
    .select('id')
    .single()

  if (error || !correction) throw new Error(error?.message ?? 'Failed to submit correction.')

  // Upload up to 3 attachments
  const attachments: { correction_id: string; file_url: string; filename: string }[] = []
  for (let i = 0; i < 3; i++) {
    const file = formData.get(`attachment_${i}`) as File | null
    if (!file || file.size === 0) continue
    if (file.size > MAX_ATTACHMENT_SIZE) throw new Error(`${file.name} exceeds 5 MB.`)

    const path = `corrections/${projectId}/${correction.id}/${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('thesis-files')
      .upload(path, file, { upsert: false })

    if (uploadError) throw new Error(uploadError.message)

    const { data: urlData } = supabase.storage.from('thesis-files').getPublicUrl(path)
    attachments.push({ correction_id: correction.id, file_url: urlData.publicUrl, filename: file.name })
  }

  if (attachments.length > 0) {
    await supabase.from('correction_attachments').insert(attachments)
  }

  revalidatePath('/client')
}
