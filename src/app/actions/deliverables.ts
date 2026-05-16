'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { sendDeliverableApprovedEmail } from '@/lib/email'
import { writeAuditLog } from '@/lib/audit'

const CHAPTER_LABELS: Record<string, string> = {
  master_dataset: 'Master Dataset', tables: 'Tables', charts: 'Charts',
  results: 'Results Chapter', introduction: 'Introduction',
  review_of_literature: 'Review of Literature', materials_and_methods: 'Materials & Methods',
  discussion: 'Discussion', conclusion: 'Conclusion', references: 'References',
  annexures: 'Annexures', final_draft: 'Final Compiled Thesis',
  r_script: 'R Script', python_script: 'Python Script', other: 'Other',
}

export async function approveDeliverable(deliverableId: string, projectId: string) {
  const { user } = await requireRole('admin')
  const supabase = await createClient()

  const { data: deliverable } = await supabase
    .from('deliverables')
    .select('chapter, filename')
    .eq('id', deliverableId)
    .single()

  const { error } = await supabase
    .from('deliverables')
    .update({ status: 'approved', approved_by: user.id, approved_at: new Date().toISOString() })
    .eq('id', deliverableId)

  if (error) throw new Error(error.message)

  // Notify client via email
  const { data: project } = await supabase
    .from('projects')
    .select('title, client:users!projects_client_id_fkey(full_name, email)')
    .eq('id', projectId)
    .single()

  if (project && deliverable) {
    const clientRaw = project.client as unknown
    const clientObj = (Array.isArray(clientRaw) ? clientRaw[0] : clientRaw) as { full_name: string; email: string } | null | undefined
    if (clientObj?.email) {
      await sendDeliverableApprovedEmail({
        to: clientObj.email,
        name: clientObj.full_name,
        chapterLabel: CHAPTER_LABELS[deliverable.chapter] ?? deliverable.chapter,
        projectTitle: project.title,
      }).catch(console.error)
    }
  }

  await writeAuditLog({
    userId: user.id,
    action: `Approved deliverable: ${CHAPTER_LABELS[deliverable?.chapter ?? ''] ?? deliverable?.chapter}`,
    entityType: 'deliverable',
    entityId: deliverableId,
    details: { projectId },
  })

  revalidatePath(`/admin/projects/${projectId}`)
}

export async function sendBackDeliverable(deliverableId: string, projectId: string, notes: string) {
  const { user } = await requireRole('admin')
  const supabase = await createClient()

  const { data: deliverable } = await supabase
    .from('deliverables')
    .select('chapter')
    .eq('id', deliverableId)
    .single()

  const { error } = await supabase
    .from('deliverables')
    .update({ status: 'revision_requested', admin_notes: notes })
    .eq('id', deliverableId)

  if (error) throw new Error(error.message)

  await writeAuditLog({
    userId: user.id,
    action: `Sent back for revision: ${CHAPTER_LABELS[deliverable?.chapter ?? ''] ?? deliverable?.chapter}`,
    entityType: 'deliverable',
    entityId: deliverableId,
    details: { projectId, notes },
  })

  revalidatePath(`/admin/projects/${projectId}`)
}

export async function advanceStage(projectId: string, currentStage: number) {
  const { user } = await requireRole('admin')
  const supabase = await createClient()

  const { data: pending } = await supabase
    .from('deliverables')
    .select('id')
    .eq('project_id', projectId)
    .eq('stage', currentStage)
    .neq('status', 'approved')

  if (pending && pending.length > 0) {
    throw new Error('All deliverables in this stage must be approved before advancing.')
  }
  if (currentStage >= 3) throw new Error('Already at final stage.')

  const { error } = await supabase
    .from('projects')
    .update({ current_stage: currentStage + 1, stage_status: 'in_progress' })
    .eq('id', projectId)

  if (error) throw new Error(error.message)

  await writeAuditLog({
    userId: user.id,
    action: `Advanced project to Stage ${currentStage + 1}`,
    entityType: 'project',
    entityId: projectId,
    details: { fromStage: currentStage, toStage: currentStage + 1 },
  })

  revalidatePath(`/admin/projects/${projectId}`)
}

export async function uploadDeliverable(formData: FormData) {
  const { user } = await requireRole('admin', 'writer', 'stats')
  const supabase = await createClient()

  const projectId = formData.get('project_id') as string
  const stage = Number(formData.get('stage'))
  const chapter = formData.get('chapter') as string
  const file = formData.get('file') as File

  if (!file || file.size === 0) throw new Error('No file provided.')
  if (file.size > 50 * 1024 * 1024) throw new Error('File exceeds 50 MB limit.')

  const { data: project } = await supabase
    .from('projects')
    .select('client:users!projects_client_id_fkey(full_name)')
    .eq('id', projectId)
    .single()

  const clientRaw = project?.client as unknown
  const clientObj = (Array.isArray(clientRaw) ? clientRaw[0] : clientRaw) as { full_name: string } | null | undefined
  const clientName = clientObj?.full_name?.split(' ')[0] ?? 'Client'

  const { count } = await supabase
    .from('deliverables')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('chapter', chapter)

  const version = (count ?? 0) + 1
  const ext = file.name.split('.').pop()
  const chapterLabel = chapter.replace(/_/g, '').replace(/\b\w/g, (c) => c.toUpperCase())
  const filename = `${clientName}_${chapterLabel}_BEDRICK_V${version}.${ext}`
  const path = `deliverables/${projectId}/${filename}`

  const { error: uploadError } = await supabase.storage
    .from('thesis-files')
    .upload(path, file, { upsert: false })

  if (uploadError) throw new Error(uploadError.message)

  const { data: urlData } = supabase.storage.from('thesis-files').getPublicUrl(path)

  const { error: dbError } = await supabase.from('deliverables').insert({
    project_id: projectId,
    uploader_id: user.id,
    stage,
    chapter,
    filename,
    file_url: urlData.publicUrl,
    version,
    status: 'draft',
  })

  if (dbError) throw new Error(dbError.message)

  await writeAuditLog({
    userId: user.id,
    action: `Uploaded deliverable: ${filename}`,
    entityType: 'deliverable',
    entityId: undefined,
    details: { projectId, chapter, stage, version },
  })

  revalidatePath(`/admin/projects/${projectId}`)
}
