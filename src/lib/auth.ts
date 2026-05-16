import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type UserRole = 'admin' | 'writer' | 'stats' | 'client'

export function dashboardPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    admin: '/admin',
    writer: '/writer',
    stats: '/stats',
    client: '/client',
  }
  return paths[role]
}

export async function requireRole(...allowedRoles: UserRole[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('users')
    .select('role, is_active, full_name')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/')
  if (!profile.is_active) {
    await supabase.auth.signOut()
    redirect('/?error=disabled')
  }
  if (allowedRoles.length && !allowedRoles.includes(profile.role as UserRole)) {
    redirect(dashboardPath(profile.role as UserRole))
  }

  return { user, profile }
}
