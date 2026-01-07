import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { firstName, lastName, email, companyName, rnc, accountType } =
    await request.json().catch(() => ({}))

  if (!firstName || !lastName || !email || !companyName || !rnc) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
  }

  const accountId = `acc_${Math.random().toString(36).slice(2, 8)}`
  const companyId = `comp_${Math.random().toString(36).slice(2, 8)}`
  const userId = `usr_${Math.random().toString(36).slice(2, 8)}`

  return NextResponse.json({
    userId,
    companyId,
    account: {
      id: accountId,
      alias: `${companyName.toLowerCase().replace(/\s+/g, '-')}-${accountType}`,
      number: `32${Math.floor(Math.random() * 900000000 + 100000000)}`,
      type: accountType ?? 'checking',
      currency: 'DOP',
      balance: 0,
      status: 'pending_activation',
    },
    status: 'pending_activation',
    activation: {
      requiresDocuments: true,
      minimumDeposit: 1000,
      currency: 'DOP',
      steps: ['Subir documentos constitutivos', 'Declarar beneficiarios finales', 'Depósito inicial'],
    },
  })
}
