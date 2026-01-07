import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const PUBLIC_PATHS = [
  '/backoffice/login',
  '/backoffice/onboarding/start',
  '/backoffice/onboarding/create-account',
  '/backoffice/onboarding/company-info',
  '/backoffice/onboarding/company-address',
  '/backoffice/onboarding/ownership',
  '/backoffice/onboarding/documents',
  '/backoffice/onboarding/expected-activity',
  '/backoffice/onboarding/follow-up',
  '/backoffice/onboarding/liveness',
  '/backoffice/onboarding',
  '/backoffice/onboarding/complete',
  '/backoffice/onboarding/activate',
  '/backoffice/onboarding/deposito',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo protegemos rutas de backoffice (no API ni assets)
  if (!pathname.startsWith('/backoffice')) {
    return NextResponse.next()
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Permitir assets estáticos bajo /backoffice (si aplica)
  if (pathname.startsWith('/backoffice/_next') || pathname.startsWith('/backoffice/assets')) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/backoffice/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/backoffice/:path*'],
}
