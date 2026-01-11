import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const PUBLIC_PATHS = [
  '/panel/login',
  '/panel/signup',
  '/panel/onboarding/create-account',
  '/panel/onboarding/company-info',
  '/panel/onboarding/company-address',
  '/panel/onboarding/ownership',
  '/panel/onboarding/documents',
  '/panel/onboarding/expected-activity',
  '/panel/onboarding/follow-up',
  '/panel/onboarding/liveness',
  '/panel/onboarding/deposito',
  '/panel/onboarding/complete',
  '/panel/onboarding/activate',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo protegemos rutas de panel (no API ni assets)
  if (!pathname.startsWith('/panel')) {
    return NextResponse.next()
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Permitir assets estáticos bajo /panel (si aplica)
  if (pathname.startsWith('/_next') || pathname.startsWith('/assets')) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/panel/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/:path*'],
}
