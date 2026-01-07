import { NextResponse } from 'next/server'

export function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('mock_backoffice_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
