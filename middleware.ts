import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/backoffice/login']

export function middleware(request: NextRequest) {
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

  const session = request.cookies.get('mock_backoffice_session')?.value

  if (!session) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/backoffice/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/backoffice/:path*'],
}
