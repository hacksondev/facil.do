import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import supabaseService from '../../services/supabaseService'

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
    accountId?: string
    amount?: number
    currency?: string
    description?: string
    counterparty?: string
    type?: 'debit' | 'credit'
  }

  if (!body || !body.accountId || !body.amount || !body.type) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const amount = Math.abs(Number(body.amount))
  if (!amount || Number.isNaN(amount)) {
    return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })
  }

  const accountId = body.accountId

  try {
    // Asegurar que la cuenta pertenece a una empresa creada por este usuario
    const { data: accountRow, error: accountError } = await supabaseService
      .from('accounts')
      .select('id, company_id, currency, balance, companies (created_by)')
      .eq('id', accountId)
      .maybeSingle()

    if (accountError) throw accountError
    if (!accountRow) {
      return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 404 })
    }

    const companyCreatedBy = (accountRow as any).companies?.created_by
    if (companyCreatedBy && companyCreatedBy !== user.id) {
      return NextResponse.json({ error: 'No autorizado para esta cuenta' }, { status: 403 })
    }

    const currency = body.currency || accountRow.currency || 'DOP'
    const type = body.type
    const delta = type === 'debit' ? -amount : amount

    const { error: txError } = await supabaseService.from('transactions').insert({
      account_id: accountId,
      type,
      amount,
      currency,
      counterparty: body.counterparty ?? '',
      description: body.description ?? '',
      status: 'pending',
    })
    if (txError) throw txError

    // Actualizar balance de cuenta de forma simple (mock de ledger)
    const newBalance = Number(accountRow.balance ?? 0) + delta
    const { error: balanceError } = await supabaseService
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)
    if (balanceError) throw balanceError

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Error creando transferencia:', err)
    return NextResponse.json({ error: err?.message ?? 'No se pudo crear la transferencia' }, { status: 500 })
  }
}
