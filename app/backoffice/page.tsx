import { BackofficeShell, CardPanel, ProgressRow } from './components'
import {
  Account,
  Alert,
  Company,
  LivenessSession,
  OnboardingCase,
  Person,
  Transaction,
  fetchMock,
  formatCurrency,
  formatDate,
  riskColor,
  statusBadge,
} from './utils'

type CompanyDetailResponse = {
  company: Company
  onboardingCase?: OnboardingCase
  owner?: Person
  livenessSessions: LivenessSession[]
  accounts: Account[]
  transactions: Transaction[]
  alerts: Alert[]
}

type CompaniesResponse = {
  data: Company[]
}

async function getDashboardData(companyId?: string) {
  const companiesRes = await fetchMock<CompaniesResponse>('/api/mock/companies')
  const activeCompany =
    companiesRes.data.find((c) => (companyId ? c.id === companyId : c)) ?? companiesRes.data[0]

  if (!activeCompany) {
    return { companies: [], detail: null as CompanyDetailResponse | null }
  }

  const detail = await fetchMock<CompanyDetailResponse>(`/api/mock/companies/${activeCompany.id}`)
  return { companies: companiesRes.data, detail }
}

type PageProps = {
  searchParams?: {
    companyId?: string
  }
}

export default async function BackofficePage({ searchParams }: PageProps) {
  const { companies, detail } = await getDashboardData(searchParams?.companyId)

  if (!detail) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Backoffice</p>
          <h1 className="text-2xl font-bold">Sin datos mock</h1>
          <p className="text-base-content/70">
            Agrega empresas en <code className="px-2 py-1 rounded bg-base-300">app/api/mock/data.ts</code> para ver el dashboard.
          </p>
        </div>
      </div>
    )
  }

  const { company, onboardingCase, owner, livenessSessions, accounts, transactions, alerts } = detail
  const dopBalance = accounts.filter((a) => a.currency === 'DOP').reduce((sum, acc) => sum + acc.balance, 0)
  const usdBalance = accounts.filter((a) => a.currency === 'USD').reduce((sum, acc) => sum + acc.balance, 0)
  const openAlerts = alerts.filter((a) => a.status === 'open')
  const topAccounts = accounts.slice(0, 3)
  const recentTx = transactions.slice(0, 5)
  const latestLiveness = livenessSessions[0]

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={company}
      activePath="/backoffice"
      title="Home"
      subtitle={company.name}
    >
      <div className="grid gap-4">
        <VirtualCardBanner companyName={company.name} />

        <div className="flex flex-wrap items-center gap-2">
          {['Enviar', 'Transferir', 'Depositar', 'Solicitar', 'Cargar factura'].map((label) => (
            <button
              key={label}
              className="btn btn-sm md:btn-md bg-base-100 border-base-300 hover:border-base-400 shadow-sm"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr,1fr]">
          <CardPanel title="Saldos y movimiento">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-base-content/60">Saldo DOP</p>
                  <p className="text-3xl font-semibold">{formatCurrency(dopBalance, 'DOP')}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Saldo USD</p>
                  <p className="text-3xl font-semibold">{formatCurrency(usdBalance, 'USD')}</p>
                </div>
                <div className="flex gap-2">
                  <span className="badge bg-success/10 text-success border-success/30">Operativo</span>
                  <span className="badge bg-primary/10 text-primary border-primary/30">Cashflow</span>
                </div>
              </div>
              <div className="h-32 w-full rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-base-300 flex items-end gap-2 px-3 pb-3">
                {[40, 62, 55, 75, 68, 82, 90].map((height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-full bg-primary/60"
                    style={{ height: `${height}%`, minHeight: '12%' }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-base-content/70">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>Entradas últimas 30 días</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span>Salidas últimas 30 días</span>
                </div>
              </div>
            </div>
          </CardPanel>

          <CardPanel title="Cuentas" actionLabel="+ Cuenta">
            <div className="space-y-3">
              {topAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between rounded-lg border border-base-300 bg-base-100 px-3 py-3"
                >
                  <div>
                    <p className="font-medium">{acc.type === 'checking' ? 'Corriente' : 'Ahorro'} ·· {acc.number.slice(-4)}</p>
                    <p className="text-sm text-base-content/60">{acc.alias}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(acc.balance, acc.currency)}</p>
                    <p className="text-xs text-base-content/60 capitalize">{acc.status}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-base-300 bg-base-100 px-3 py-3 text-sm text-base-content/70">
                Crea cuentas separadas para impuestos, nómina y operaciones. Límites diarios: {formatCurrency(1500000, 'DOP')}.
              </div>
            </div>
          </CardPanel>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr,1fr]">
          <CardPanel title="Onboarding empresa" subtitle={company.rnc}>
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`badge border ${riskColor(company.riskLevel)}`}>Riesgo {company.riskLevel}</span>
              {onboardingCase && (
                <span className={`badge border ${statusBadge(onboardingCase.status)}`}>
                  {onboardingCase.status.replace('_', ' ')}
                </span>
              )}
              {owner?.pep && <span className="badge border bg-warning/10 text-warning border-warning/30">PEP detectado</span>}
            </div>
            <div className="mt-4 space-y-3">
              <ProgressRow label="Datos legales" value={onboardingCase?.status === 'collecting' ? 60 : 100} />
              <ProgressRow label="Beneficiarios finales" value={onboardingCase?.status === 'collecting' ? 40 : 100} />
              <ProgressRow
                label="Prueba de vida propietario"
                value={latestLiveness?.passed ? 100 : 35}
                accent={latestLiveness?.passed ? 'bg-success' : 'bg-warning'}
              />
              <ProgressRow
                label="Screening PEP/Sanciones"
                value={owner?.pep ? 55 : 100}
                accent={owner?.pep ? 'bg-warning' : 'bg-primary'}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-base-content/70">
              <div className="px-3 py-2 rounded-lg bg-base-100 border border-base-300">
                Reviewer: {onboardingCase?.reviewer ?? 'Asignar'}
              </div>
              <div className="px-3 py-2 rounded-lg bg-base-100 border border-base-300">
                Liveness score: {latestLiveness ? latestLiveness.score.toFixed(2) : 'N/A'}
              </div>
              <div className="px-3 py-2 rounded-lg bg-base-100 border border-base-300">
                Motivo: {onboardingCase?.decisionReason ?? 'Pendiente'}
              </div>
            </div>
          </CardPanel>

          <CardPanel title="Alertas y casos" actionLabel="Ver todas">
            <div className="space-y-3">
              {openAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="rounded-lg border border-base-300 bg-base-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{alert.type}</span>
                    <span className="text-xs text-base-content/60">{formatDate(alert.createdAt)}</span>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">{alert.message}</p>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span
                      className={`badge border px-2 py-1 ${
                        alert.severity === 'high'
                          ? 'bg-error/10 text-error border-error/30'
                          : 'bg-warning/10 text-warning border-warning/30'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="badge border bg-base-200 border-base-300">Pendiente</span>
                  </div>
                </div>
              ))}
              {openAlerts.length === 0 && (
                <p className="text-sm text-base-content/60">Sin alertas abiertas. Mantén monitoreo activo.</p>
              )}
            </div>
          </CardPanel>

          <CardPanel title="Propietario principal">
            <div className="rounded-lg border border-base-300 bg-base-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{owner?.fullName ?? 'Sin nombre'}</p>
                  <p className="text-sm text-base-content/60">
                    {owner?.documentType.toUpperCase()} · {owner?.documentNumber}
                  </p>
                </div>
                <span className="badge bg-primary/10 text-primary border-primary/30">Verificado</span>
              </div>
              <div className="text-sm text-base-content/70">
                Nacionalidad: {owner?.nationality}
                <br />
                PEP: {owner?.pep ? 'Sí' : 'No'}
                <br />
                Última prueba de vida: {latestLiveness ? formatDate(latestLiveness.createdAt) : 'N/A'}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm bg-base-100 border-base-300">Solicitar reintento</button>
                <button className="btn btn-sm btn-primary text-primary-content">Aprobar</button>
              </div>
            </div>
          </CardPanel>
        </div>

        <CardPanel title="Movimientos recientes" actionLabel="Descargar CSV">
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
                        {acc ? `${acc.type === 'checking' ? 'Corriente' : 'Ahorro'} ·· ${acc.number.slice(-4)}` : tx.accountId}
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
      </div>
    </BackofficeShell>
  )
}

function VirtualCardBanner({ companyName }: { companyName: string }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/10 p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-base-content/70">Tarjeta virtual activa</p>
          <h2 className="text-2xl font-semibold mt-1">Lista para usar con {companyName}</h2>
          <p className="text-sm text-base-content/70 mt-2">
            Añade la tarjeta a tu wallet o úsala para gastos operativos. Códigos CVV dinámicos y controles por categoría.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="btn btn-sm btn-primary text-primary-content">Gestionar tarjeta</button>
            <button className="btn btn-sm bg-base-100 border-base-300">Configurar límites</button>
          </div>
        </div>
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 w-full md:w-80">
          <div className="flex justify-between items-center text-sm text-base-content/70">
            <span>·· 2522</span>
            <span>Exp ··/· ·</span>
          </div>
          <div className="mt-6 h-28 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-base-300" />
          <p className="text-xs text-base-content/60 mt-3 text-right">Escanea para pagar o copiar número</p>
        </div>
      </div>
    </div>
  )
}
