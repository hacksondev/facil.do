import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BackofficeShell, CardPanel } from '../components'
import { Company, Transaction, Account, formatCurrency, formatDate } from '../utils'
import TransferForm from './transfer-form'

type PageProps = {
  searchParams?: { companyId?: string }
}

export default async function TransactionsPage({ searchParams }: PageProps) {
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
          <p className="text-base-content/70">Inicia sesión para ver tus transacciones.</p>
        </div>
      </div>
    )
  }

  const { data: companiesRaw } = await supabase
    .from('companies')
    .select('id,name,rnc,phone,industry,created_at,risk_level')
    .eq('created_by', user.id)
    .order('created_at', { ascending: true })

  const companies: Company[] = []

  if (companiesRaw?.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Backoffice</p>
          <h1 className="text-2xl font-bold">Sin empresas</h1>
          <p className="text-base-content/70">Completa el onboarding para ver transacciones.</p>
        </div>
      </div>
    )
  }

  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]

  const { data: accountsRaw } = await supabase
    .from('accounts')
    .select('id,company_id,type,currency,balance,status,alias,number,created_at')
    .eq('company_id', 'b73f15c0-b91b-49b0-b745-3bf7f2372355')
    .order('created_at', { ascending: true })

  const accounts =
    accountsRaw?.map((a) => ({
      id: a.id,
      companyId: a.company_id,
      type: a.type as Account['type'],
      currency: a.currency as Account['currency'],
      balance: Number(a.balance ?? 0),
      status: (a.status as any) || 'active',
      alias: a.alias || '',
      number: a.number || '',
      limits: { daily: Number((a as any).limits_daily ?? 0), monthly: Number((a as any).limits_monthly ?? 0) },
      updatedAt: a.created_at || '',
    })) ?? []

  const accountIds = accounts.map((a) => a.id)

  const { data: txRaw } =
    accountIds.length > 0
      ? await supabase
          .from('transactions')
          .select('id,account_id,type,amount,currency,counterparty,description,status,created_at')
          .in('account_id', accountIds)
          .order('created_at', { ascending: false })
      : { data: null }

  const transactions: Transaction[] =
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

  const scoped = transactions.slice(0, 20)

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/transactions"
      title="Transacciones"
      subtitle="Entrantes y salientes"
      actionLabel="Nueva transferencia"
    >
      {/* <CardPanel title="Crear transferencia">
        <TransferForm accounts={accounts} />
      </CardPanel> */}

      <CardPanel title="Historial">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Fecha</th>
                <th>Detalle</th>
                <th>Contraparte</th>
                <th className="text-right">Monto</th>
                <th className="text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {scoped.map((tx) => (
                <tr key={tx.id}>
                  <td>{formatDate(tx.createdAt)}</td>
                  <td className="font-medium">{tx.description}</td>
                  <td className="text-sm text-base-content/70">{tx.counterparty}</td>
                  <td className="text-right font-semibold">
                    {tx.type === 'debit' ? '-' : '+'}
                    {formatCurrency(tx.amount, tx.currency)}
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
            </tbody>
          </table>
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}
