import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const ROLE_PATHS: Record<string, string[]> = {
  admin: ['/admin'],
  writer: ['/writer'],
  stats: ['/stats'],
  client: ['/client'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedPrefixes = ['/admin', '/writer', '/stats', '/client']
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login?redirected=1', request.url))
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active) {
    return NextResponse.redirect(new URL('/login?error=disabled', request.url))
  }

  const role = profile.role as string
  const allowedPaths = ROLE_PATHS[role] ?? []
  const hasAccess = allowedPaths.some((p) => pathname.startsWith(p))

  if (!hasAccess) {
    const home = allowedPaths[0] ?? '/'
    return NextResponse.redirect(new URL(home, request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/writer/:path*', '/stats/:path*', '/client/:path*'],
}
