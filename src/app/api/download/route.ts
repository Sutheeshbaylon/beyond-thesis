import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/download?path=deliverables/...
// Checks auth, creates a short-lived signed URL, redirects to it.
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const path = request.nextUrl.searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })

  const { data, error } = await supabase.storage
    .from('thesis-files')
    .createSignedUrl(path, 3600) // 1 hour — regenerated each time

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'File not found or access denied' }, { status: 404 })
  }

  return NextResponse.redirect(data.signedUrl)
}
