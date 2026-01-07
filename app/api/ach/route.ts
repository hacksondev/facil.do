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
    beneficiaryId?: string
    amount?: number
    currency?: string
    description?: string
  }

  if (!body?.companyId || !body?.amount) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  try {
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

    const { error: insertError } = await supabase.from('ach_authorizations').insert({
      company_id: body.companyId,
      beneficiary_id: body.beneficiaryId,
      amount: body.amount,
      currency: body.currency || 'DOP',
      description: body.description,
      status: 'pending',
      created_by: user.id,
    })

    if (insertError) throw insertError

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Error creando autorización ACH:', err)
    return NextResponse.json({ error: err?.message ?? 'No se pudo crear la autorización' }, { status: 500 })
  }
}
