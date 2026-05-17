'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'

const ALLOWED_TYPES = ['docx', 'pdf', 'xlsx', 'csv', 'r', 'py', 'doc']
const MAX_SIZE = 50 * 1024 * 1024

export async function submitForReview(deliverableId: string, projectId: string, role: 'writer' | 'stats') {
  await requireRole(role)
  const supabase = await createClient()

  const { error } = await supabase
    .from('deliverables')
    .update({ status: 'submitted_for_review' })
    .eq('id', deliverableId)

  if (error) throw new Error(error.message)
  revalidatePath(`/${role}/projects/${projectId}`)
}

export async function uploadStaffDeliverable(formData: FormData, role: 'writer' | 'stats'): Promise<{ error: string } | void> {
  try {
    const { user } = await requireRole(role)
    const supabase = await createClient()

    const projectId = formData.get('project_id') as string
    const stage = Number(formData.get('stage'))
    const chapter = formData.get('chapter') as string
    const file = formData.get('file') as File

    if (!file || file.size === 0) return { error: 'No file selected.' }
    if (file.size > MAX_SIZE) return { error: 'File exceeds 50 MB limit.' }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_TYPES.includes(ext)) return { error: `File type .${ext} is not allowed.` }

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
    const chapterLabel = chapter
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
    const filename = `${clientName}_${chapterLabel}_BEDRICK_V${version}.${ext}`
    const path = `deliverables/${projectId}/${filename}`

    const { error: uploadError } = await supabase.storage
      .from('thesis-files')
      .upload(path, file, { upsert: false })

    if (uploadError) return { error: uploadError.message }

    const { error: dbError } = await supabase.from('deliverables').insert({
      project_id: projectId,
      uploader_id: user.id,
      stage,
      chapter,
      filename,
      file_url: path,
      version,
      status: 'draft',
    })

    if (dbError) return { error: dbError.message }

    revalidatePath(`/${role}/projects/${projectId}`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected error.'
    return { error: msg }
  }
}
