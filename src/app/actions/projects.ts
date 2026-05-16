'use server'

import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendWelcomeEmail } from '@/lib/email'
import { writeAuditLog } from '@/lib/audit'

const TIER_TOTALS: Record<string, number> = {
  standard: 16000,
  special: 15000,
  super: 12500,
}

export async function createProject(formData: FormData) {
  await requireRole('admin')
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const clientMode = formData.get('client_mode') as 'existing' | 'new'
  let clientId: string

  if (clientMode === 'new') {
    const fullName = formData.get('client_full_name') as string
    const email = formData.get('client_email') as string
    const phone = formData.get('client_phone') as string
    const tempPassword = Math.random().toString(36).slice(-10) + 'Bt1!'

    // Create auth user
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    })

    if (authError) throw new Error(authError.message)
    clientId = authUser.user.id

    // Insert into public.users
    const { error: profileError } = await supabase.from('users').insert({
      id: clientId,
      full_name: fullName,
      email,
      phone: phone || null,
      role: 'client',
      is_active: true,
    })

    if (profileError) throw new Error(profileError.message)
    await sendWelcomeEmail({ to: email, name: fullName, tempPassword })
  } else {
    clientId = formData.get('client_id') as string
  }

  const tier = formData.get('tier') as string
  const customTotal = Number(formData.get('custom_total') ?? 0)
  const totalAmount = tier === 'custom' ? customTotal : TIER_TOTALS[tier]

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      client_id: clientId,
      title: formData.get('title') as string,
      specialty: formData.get('specialty') as string,
      study_design: (formData.get('study_design') as string) || null,
      sample_size: formData.get('sample_size') ? Number(formData.get('sample_size')) : null,
      college: (formData.get('college') as string) || null,
      university: (formData.get('university') as string) || null,
      guide_name: (formData.get('guide_name') as string) || null,
      submission_deadline: (formData.get('submission_deadline') as string) || null,
      tier,
      total_amount: totalAmount,
      advance_amount: 8000,
      current_stage: 1,
      stage_status: 'in_progress',
      status: 'active',
    })
    .select('id')
    .single()

  if (projectError || !project) throw new Error(projectError?.message ?? 'Failed to create project.')

  // Assign writer + stats if provided
  const writerId = formData.get('writer_id') as string
  const statsId = formData.get('stats_id') as string
  const assignments = []
  if (writerId) assignments.push({ project_id: project.id, user_id: writerId, role_on_project: 'writer' })
  if (statsId) assignments.push({ project_id: project.id, user_id: statsId, role_on_project: 'stats' })
  if (assignments.length) await supabase.from('assignments').insert(assignments)

  const { user } = await requireRole('admin')
  await writeAuditLog({
    userId: user.id,
    action: 'Created new project',
    entityType: 'project',
    entityId: project.id,
    details: { clientId, tier, totalAmount },
  })

  redirect(`/admin/projects/${project.id}`)
}
