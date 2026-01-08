import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BackofficeShell, CardPanel } from '../components'
import { Company, formatCurrency, formatDate } from '../utils'
import Link from 'next/link'

type PageProps = { searchParams?: { companyId?: string } }

export default async function AccountsPage({ searchParams }: PageProps) {
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

  const { data: accountsRaw } = await supabase
    .from('accounts')
    .select('id,company_id,type,currency,balance,status,alias,number,created_at')
    .eq('company_id', activeCompany.id)
    .order('created_at', { ascending: true })

  const accounts =
    accountsRaw?.map((a) => ({
      id: a.id,
      companyId: a.company_id,
      type: a.type as 'checking' | 'savings',
      currency: a.currency as 'DOP' | 'USD',
      balance: Number(a.balance ?? 0),
      status: (a.status as any) || 'pending_activation',
      alias: a.alias || '',
      number: a.number || '',
      createdAt: a.created_at || '',
    })) ?? []

  activeCompany.accountsMenu = accounts.map((acc) => ({
    id: acc.id,
    number: acc.number,
    alias: acc.alias,
    type: acc.type,
  }))

  const accountIds = accounts.map((a) => a.id)

  const { data: txRaw } =
    accountIds.length > 0
      ? await supabase
          .from('transactions')
          .select('id,account_id,type,amount,currency,counterparty,description,status,created_at')
          .in('account_id', accountIds)
          .order('created_at', { ascending: false })
      : { data: [] }

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

  const dopBalance = accounts.filter((a) => a.currency === 'DOP').reduce((sum, acc) => sum + acc.balance, 0)
  const usdBalance = accounts.filter((a) => a.currency === 'USD').reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/accounts"
      title="Cuentas"
      subtitle="Corriente y ahorro"
      actionLabel="Crear cuenta"
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
        <CardPanel title="Balances por moneda">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BalanceCard label="DOP" value={dopBalance} currency="DOP" />
            <BalanceCard label="USD" value={usdBalance} currency="USD" />
          </div>
        </CardPanel>

        <CardPanel title="Resumen de cuentas">
          <div className="space-y-3">
            {accounts.map((acc) => (
              <Link
                key={acc.id}
                href={`/backoffice/accounts/${acc.id}${activeCompany ? `?companyId=${activeCompany.id}` : ''}`}
                className="rounded-lg border border-base-300 bg-base-100 p-3 block hover:border-primary/40 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{acc.alias || 'Sin alias'}</p>
                    <p className="text-xs text-base-content/60">
                      {acc.type === 'checking' ? 'Corriente' : 'Ahorro'} ·· {acc.number?.slice(-4) ?? '----'}
                    </p>
                  </div>
                  <span className="badge bg-base-200 border-base-300 text-base-content/70 capitalize">{acc.status}</span>
                </div>
                <p className="text-lg font-semibold mt-1">{formatCurrency(acc.balance, acc.currency)}</p>
              </Link>
            ))}
            {accounts.length === 0 && (
              <p className="text-sm text-base-content/60">No hay cuentas. Crea una para empezar.</p>
            )}
          </div>
        </CardPanel>
      </div>

      <CardPanel title="Movimientos recientes">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Fecha</th>
                <th>Cuenta</th>
                <th>Detalle</th>
                <th className="text-right">Monto</th>
                <th className="text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((tx) => {
                const acc = accounts.find((a) => a.id === tx.accountId)
                return (
                  <tr key={tx.id}>
                    <td>{formatDate(tx.createdAt)}</td>
                    <td className="text-sm text-base-content/70">
                      {acc ? `${acc.alias || 'Cuenta'} ·· ${acc.number?.slice(-4) ?? ''}` : tx.accountId}
                    </td>
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
                )
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-base-content/60 py-4">
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

function BalanceCard({ label, value, currency }: { label: string; value: number; currency: 'DOP' | 'USD' }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className="text-2xl font-semibold mt-1">{formatCurrency(value, currency)}</p>
    </div>
  )
}
