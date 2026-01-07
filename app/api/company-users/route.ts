import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null) as {
    companyId?: string
    name?: string
    email?: string
    role?: 'admin' | 'aprobador' | 'visor'
  }

  if (!body?.companyId || !body?.name || !body?.email) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  try {
    // Verificar que la compañía pertenece al usuario
    const { data: companyRow, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', body.companyId)
      .eq('created_by', user.id)
      .maybeSingle()

    if (companyError) throw companyError
    if (!companyRow) {
      return NextResponse.json({ error: 'No autorizado para esta empresa' }, { status: 403 })
    }

    const role = body.role ?? 'visor'

    const { error: insertError } = await supabase.from('company_users').insert({
      company_id: body.companyId,
      name: body.name,
      email: body.email.toLowerCase(),
      role,
      status: 'pending',
      created_by: user.id,
    })

    if (insertError) throw insertError

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Error creando usuario de empresa:', err)
    const msg =
      err?.code === '23505'
        ? 'El usuario ya existe en la empresa'
        : err?.message ?? 'No se pudo crear el usuario'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
