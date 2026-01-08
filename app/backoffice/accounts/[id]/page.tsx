import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { BackofficeShell, CardPanel } from '../../components'
import { Company, formatCurrency, formatDate } from '../../utils'

type PageProps = {
  params: { id: string }
  searchParams?: { companyId?: string }
}

export default async function AccountDetailPage({ params, searchParams }: PageProps) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Backoffice</p>
          <h1 className="text-2xl font-bold">Sesión requerida</h1>
          <p className="text-base-content/70">Inicia sesión para ver cuentas.</p>
        </div>
      </div>
    )
  }

  const { data: companiesRaw } = await supabase
    .from('companies')
    .select('id,name,rnc,industry,created_at,created_by')
    .eq('created_by', user.id)
    .order('created_at', { ascending: true })

  const companies: Company[] =
    companiesRaw?.map((c) => ({
      id: c.id,
      name: c.name,
      rnc: c.rnc,
      country: 'República Dominicana',
      sector: c.industry || 'N/D',
      riskLevel: 'medium',
      onboardingStage: 'pending_review',
      ownerPersonId: '',
      industry: c.industry || '',
      phone: '',
      createdAt: c.created_at || '',
    })) ?? []

  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]

  if (!activeCompany) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Backoffice</p>
          <h1 className="text-2xl font-bold">Sin empresas</h1>
          <p className="text-base-content/70">Completa el onboarding para gestionar cuentas.</p>
        </div>
      </div>
    )
  }

  const { data: account } = await supabase
    .from('accounts')
    .select('id,company_id,type,currency,balance,status,alias,number,created_at')
    .eq('id', params.id)
    .eq('company_id', activeCompany.id)
    .maybeSingle()

  if (!account) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Backoffice</p>
          <h1 className="text-2xl font-bold">Cuenta no encontrada</h1>
          <p className="text-base-content/70">Verifica el enlace o selecciona otra cuenta.</p>
          <Link href="/backoffice/accounts" className="btn btn-primary text-primary-content">
            Volver a cuentas
          </Link>
        </div>
      </div>
    )
  }

  const { data: txRaw } = await supabase
    .from('transactions')
    .select('id,account_id,type,amount,currency,counterparty,description,status,created_at')
    .eq('account_id', account.id)
    .order('created_at', { ascending: false })

  const transactions =
    txRaw?.map((t) => ({
      id: t.id,
      accountId: t.account_id,
      type: t.type as any,
      amount: Number(t.amount ?? 0),
      currency: t.currency || 'DOP',
      counterparty: t.counterparty || '',
      description: t.description || '',
      status: (t.status as any) || 'pending',
      createdAt: t.created_at || '',
    })) ?? []

  const maskedNumber = account.number ? account.number.slice(-4).padStart(account.number.length, '•') : '••••'
  activeCompany.accountsMenu = companies
    .find((c) => c.id === activeCompany.id)
    ? [
        {
          id: account.id,
          number: account.number,
          alias: account.alias,
          type: account.type as any,
        },
      ]
    : []

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/accounts"
      title={account.type === 'savings' ? 'Savings' : 'Checking'}
      subtitle={maskedNumber}
      actionLabel="Transferir"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <CardPanel title="Disponible" subtitle="Saldo actual">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">{formatCurrency(Number(account.balance ?? 0), account.currency as any)}</p>
            <div className="flex gap-2">
              <button className="btn btn-sm bg-base-200 border-base-300">+ Depósito</button>
              <button className="btn btn-sm bg-base-200 border-base-300">Transferir</button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-base-content/70">
            <p>Tipo: {account.type === 'savings' ? 'Ahorro' : 'Corriente'}</p>
            <p>Estado: {account.status}</p>
          </div>
        </CardPanel>

        <CardPanel title="Datos de cuenta">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Número</span>
              <span className="font-medium">{maskedNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Moneda</span>
              <span className="font-medium">{account.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>Alias</span>
              <span className="font-medium">{account.alias || 'Sin alias'}</span>
            </div>
          </div>
        </CardPanel>
      </div>

      <CardPanel title="Transacciones recientes" actionLabel="Ver todas">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Fecha</th>
                <th>Detalle</th>
                <th className="text-right">Monto</th>
                <th className="text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((tx) => (
                <tr key={tx.id}>
                  <td>{formatDate(tx.createdAt)}</td>
                  <td>
                    <div className="font-medium">{tx.description || 'Transacción'}</div>
                    <div className="text-xs text-base-content/60">{tx.counterparty}</div>
                  </td>
                  <td className="text-right font-semibold">
                    {tx.type === 'debit' ? '-' : '+'}
                    {formatCurrency(tx.amount, tx.currency as any)}
                  </td>
                  <td className="text-right">
                    <span
                      className={`badge border ${
                        tx.status === 'pending'
                          ? 'bg-warning/10 text-warning border-warning/30'
                          : tx.status === 'reversed'
                            ? 'bg-error/10 text-error border-error/30'
                            : 'bg-success/10 text-success border-success/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-sm text-base-content/60 py-4">
                    Sin transacciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}
