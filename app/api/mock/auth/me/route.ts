import { NextResponse } from 'next/server'
import { mockUsers } from '../users'

export function GET(request: Request) {
  const cookie = request.headers.get('cookie') ?? ''
  const session = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('mock_backoffice_session='))
    ?.split('=')[1]

  if (!session) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = mockUsers.find((u) => u.token === session)

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
}
