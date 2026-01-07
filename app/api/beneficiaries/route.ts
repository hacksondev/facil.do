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
    bankName?: string
    accountNumber?: string
    accountType?: string
    currency?: string
    documentType?: 'rnc' | 'cedula' | 'pasaporte'
    documentNumber?: string
    alias?: string
  }

  if (!body?.companyId || !body?.name || !body?.accountNumber || !body?.documentNumber) {
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

    const { error: insertError } = await supabase.from('beneficiaries').insert({
      company_id: body.companyId,
      name: body.name,
      email: body.email?.toLowerCase(),
      bank_name: body.bankName,
      account_number: body.accountNumber,
      account_type: body.accountType,
      currency: body.currency || 'DOP',
      status: 'active',
      created_by: user.id,
      document_type: body.documentType ?? 'rnc',
      document_number: body.documentNumber,
      alias: body.alias,
    })

    if (insertError) throw insertError

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Error creando beneficiario:', err)
    const msg =
      err?.code === '23505'
        ? 'El beneficiario ya existe con esa cuenta/banco'
        : err?.message ?? 'No se pudo crear el beneficiario'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
