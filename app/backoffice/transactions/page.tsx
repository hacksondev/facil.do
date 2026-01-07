import { BackofficeShell, CardPanel } from '../components'
import { Company, Transaction, fetchMock, formatCurrency, formatDate } from '../utils'

type CompaniesResponse = { data: Company[] }
type TransactionsResponse = { data: Transaction[] }

async function getData() {
  const [companiesRes, transactionsRes] = await Promise.all([
    fetchMock<CompaniesResponse>('/api/mock/companies'),
    fetchMock<TransactionsResponse>('/api/mock/transactions'),
  ])
  return { companies: companiesRes.data, transactions: transactionsRes.data }
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: { companyId?: string }
}) {
  const { companies, transactions } = await getData()
  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]
  const scoped = transactions.slice(0, 12)

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/transactions"
      title="Transacciones"
      subtitle="Entrantes y salientes"
      actionLabel="Nueva transferencia"
    >
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
