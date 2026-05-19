'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/auth'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?error=invalid_credentials')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=invalid_credentials')

  const { data: profile } = await supabase
    .from('users')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile) {
    await supabase.auth.signOut()
    redirect('/login?error=invalid_credentials')
  }

  if (!profile.is_active) {
    await supabase.auth.signOut()
    redirect('/login?error=disabled')
  }

  const dashboardPaths: Record<UserRole, string> = {
    admin: '/admin',
    writer: '/writer',
    stats: '/stats',
    client: '/client',
  }

  redirect(dashboardPaths[profile.role as UserRole] ?? '/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/home')
}
