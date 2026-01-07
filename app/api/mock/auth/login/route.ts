import { NextResponse } from 'next/server'
import { mockUsers } from '../users'

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}))

  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const response = NextResponse.json({
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })

  response.cookies.set('mock_backoffice_session', user.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  })

  return response
}
