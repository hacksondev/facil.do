import { BackofficeShell, CardPanel } from '../components'
import { Account, Company, Transaction, fetchMock, formatCurrency, formatDate } from '../utils'

type CompaniesResponse = {
  data: Company[]
}

type AccountsResponse = {
  data: Account[]
}

type TransactionsResponse = {
  data: Transaction[]
}

async function getData() {
  const [companiesRes, accountsRes, txRes] = await Promise.all([
    fetchMock<CompaniesResponse>('/api/mock/companies'),
    fetchMock<AccountsResponse>('/api/mock/accounts'),
    fetchMock<TransactionsResponse>('/api/mock/transactions'),
  ])

  return {
    companies: companiesRes.data,
    accounts: accountsRes.data,
    transactions: txRes.data,
  }
}

type PageProps = {
  searchParams?: {
    companyId?: string
  }
}

export default async function AccountsPage({ searchParams }: PageProps) {
  const { companies, accounts, transactions } = await getData()
  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]

  const accountsForCompany = activeCompany
    ? accounts.filter((a) => a.companyId === activeCompany.id)
    : accounts
  const accountIds = accountsForCompany.map((a) => a.id)
  const txForCompany = transactions.filter((tx) => accountIds.includes(tx.accountId))

  const dopBalance = accountsForCompany.filter((a) => a.currency === 'DOP').reduce((sum, acc) => sum + acc.balance, 0)
  const usdBalance = accountsForCompany.filter((a) => a.currency === 'USD').reduce((sum, acc) => sum + acc.balance, 0)
  const active = accountsForCompany.filter((a) => a.status === 'active').length
  const blocked = accountsForCompany.filter((a) => a.status === 'blocked').length

  const recentTx = txForCompany.slice(0, 8)

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
          <div className="mt-4 flex gap-3 text-sm text-base-content/70">
            <BadgePill label={`${active} activas`} tone="bg-success/10 text-success border-success/30" />
            <BadgePill label={`${blocked} bloqueadas`} tone="bg-error/10 text-error border-error/30" />
            <BadgePill label={`${accountsForCompany.length} totales`} tone="bg-base-200 text-base-content border-base-300" />
          </div>
        </CardPanel>

        <CardPanel title="Límites operativos">
          <div className="space-y-3">
            {accounts.slice(0, 4).map((acc) => (
              <div key={acc.id} className="rounded-lg border border-base-300 bg-base-100 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{acc.alias}</p>
                    <p className="text-xs text-base-content/60">{acc.type === 'checking' ? 'Corriente' : 'Ahorro'} ·· {acc.number.slice(-4)}</p>
                  </div>
                  <span className="badge bg-base-200 border-base-300 text-base-content/70 capitalize">{acc.status}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-base-content/70">
                  <p>Diario: {formatCurrency(acc.limits.daily, acc.currency)}</p>
                  <p>Mensual: {formatCurrency(acc.limits.monthly, acc.currency)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardPanel>
      </div>

      <CardPanel title="Listado de cuentas" actionLabel="Descargar CSV">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Empresa</th>
                <th>Cuenta</th>
                <th>Alias</th>
                <th>Saldo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {accountsForCompany.map((acc) => {
                const company = companies.find((c) => c.id === acc.companyId)
                return (
                  <tr key={acc.id}>
                    <td>
                      <div className="font-semibold">{company?.name ?? 'N/A'}</div>
                      <div className="text-xs text-base-content/60">RNC {company?.rnc ?? '—'}</div>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {acc.type === 'checking' ? 'Corriente' : 'Ahorro'} ·· {acc.number.slice(-4)}
                    </td>
                    <td className="text-sm text-base-content/70">{acc.alias}</td>
                    <td className="font-semibold">{formatCurrency(acc.balance, acc.currency)}</td>
                    <td>
                      <span
                        className={`badge border ${
                          acc.status === 'active'
                            ? 'bg-success/10 text-success border-success/30'
                            : 'bg-error/10 text-error border-error/30'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardPanel>

      <CardPanel title="Movimientos por cuenta">
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
              {recentTx.map((tx) => {
                const acc = accounts.find((a) => a.id === tx.accountId)
                return (
                  <tr key={tx.id}>
                    <td>{formatDate(tx.createdAt)}</td>
                    <td className="text-sm text-base-content/70">
                      {acc ? `${acc.alias} ·· ${acc.number.slice(-4)}` : tx.accountId}
                    </td>
                    <td>
                      <div className="font-medium">{tx.description}</div>
                      <div className="text-xs text-base-content/60">{tx.counterparty}</div>
                    </td>
                    <td className="text-right font-semibold">
                      {tx.type === 'debit' ? '-' : '+'}
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="text-right">
                      <span
                        className={`badge border px-2 py-1 ${
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
      <p className="text-xs text-base-content/60 mt-1">Incluye cuentas activas y bloqueadas.</p>
    </div>
  )
}

function BadgePill({ label, tone }: { label: string; tone: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>
      {label}
    </span>
  )
}
