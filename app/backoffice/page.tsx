import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BackofficeShell, CardPanel, ProgressRow } from './components'
import {
  Account,
  Alert,
  Company,
  Transaction,
  formatCurrency,
  formatDate,
} from './utils'


type PageProps = {
  searchParams?: {
    companyId?: string
  }
}

export default async function BackofficePage({ searchParams }: PageProps) {
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
          <p className="text-base-content/70">Inicia sesión para ver tus cuentas.</p>
        </div>
      </div>
    )
  }

  const { data: companiesRaw, error: companiesError } = await supabase
    .from('companies')
    .select('id,name,rnc,phone,industry,created_at')
    .eq('created_by', user.id)
    .order('created_at', { ascending: true })

  if (companiesError) {
    console.error('Error cargando empresas', companiesError)
  }

  let companies: Company[] =
    companiesRaw?.map((c) => ({
      id: c.id,
      name: c.name,
      rnc: c.rnc,
      country: 'República Dominicana',
      phone: c.phone || '',
      industry: c.industry || '',
      createdAt: c.created_at || '',
      sector: '',
      riskLevel: 'low',
      onboardingStage: 'collecting',
      ownerPersonId: '',
    })) ?? []

  if (companies.length === 0) {
    const { data: fallbackCompanies } = await supabase
      .from('companies')
      .select('id,name,rnc,phone,industry,created_at')
      .order('created_at', { ascending: true })
      .limit(1)

    companies =
      fallbackCompanies?.map((c) => ({
        id: c.id,
        name: c.name,
        rnc: c.rnc,
        country: 'República Dominicana',
        phone: c.phone || '',
        industry: c.industry || '',
        createdAt: c.created_at || '',
        sector: '',
        riskLevel: 'low',
        onboardingStage: 'collecting',
        ownerPersonId: '',
      })) ?? []
  }

  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]


  const { data: accountsRaw } = await supabase
    .from('accounts')
    .select('id,company_id,type,currency,balance,status,alias,number,created_at,limits')
    .eq('company_id', activeCompany.id)
    .order('created_at', { ascending: true })

  const accounts: Account[] =
    accountsRaw?.map((a) => ({
      id: a.id,
      companyId: a.company_id,
      type: a.type as Account['type'],
      currency: a.currency,
      balance: Number(a.balance ?? 0),
      status: (a.status as any) || 'pending_activation',
      alias: a.alias || '',
      number: a.number || '',
      limits: (a.limits ?? {}) as Account['limits'],
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

  const dopBalance = accounts.filter((a) => a.currency === 'DOP').reduce((sum, acc) => sum + acc.balance, 0)
  const usdBalance = accounts.filter((a) => a.currency === 'USD').reduce((sum, acc) => sum + acc.balance, 0)
  const openAlerts: Alert[] = []
  const topAccounts = accounts.slice(0, 3)
  const recentTx = transactions.slice(0, 5)
  const sparkline = buildSparkline(transactions)

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice"
      title="Home"
      subtitle={activeCompany.name}
    >
      <div className="grid gap-4">
        {/* <div className="flex flex-wrap items-center gap-2">
          {['Enviar', 'Transferir', 'Depositar', 'Solicitar', 'Cargar factura'].map((label) => (
            <button
              key={label}
              className="btn btn-sm md:btn-md bg-base-100 border-base-300 hover:border-base-400 shadow-sm"
              type="button"
            >
              {label}
            </button>
          ))}
        </div> */}

        <div className="grid gap-4 lg:grid-cols-[1.6fr,1fr]">
          {/* <CardPanel title="Balance total" subtitle="Últimos 30 días">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-base-content/60">Saldo total</p>
                  <p className="text-3xl font-semibold">
                    {formatCurrency(dopBalance + usdBalance * 59, 'DOP')}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-success font-semibold">↗ {formatCurrency(1700000, 'DOP')}</span>
                  <span className="text-error font-semibold">↘ {formatCurrency(420000, 'DOP')}</span>
                </div>
                <div className="flex gap-2">
                  <span className="badge bg-success/10 text-success border-success/30">Operativo</span>
                  <span className="badge bg-primary/10 text-primary border-primary/30">Cashflow</span>
                </div>
              </div>
              <div className="h-48 rounded-xl border border-base-300 bg-gradient-to-b from-primary/5 via-base-100 to-base-100 p-3 flex flex-col">
                <div className="flex-1 relative">
                  <svg viewBox="0 0 100 40" className="h-full w-full">
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(82,102,235,0.22)" />
                        <stop offset="100%" stopColor="rgba(82,102,235,0.02)" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="url(#balanceGradient)"
                      stroke="none"
                      points={sparkline
                        .map(({ x, y }) => `${x},40 ${x},${y}`)
                        .join(' ')}
                    />
                    <polyline
                      fill="none"
                      stroke="rgba(82,102,235,0.8)"
                      strokeWidth="1.5"
                      points={sparkline.map(({ x, y }) => `${x},${y}`).join(' ')}
                    />
                  </svg>
                </div>
                <div className="grid grid-cols-5 text-xs text-base-content/60 mt-1">
                  {['Dec 13', 'Dec 18', 'Dec 23', 'Dec 28', 'Jan 2'].map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardPanel> */}
{/* 
          <CardPanel title="Cuentas" subtitle="DOP / USD" actionLabel="+ Cuenta">
            <div className="space-y-3">
              {topAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between rounded-lg border border-base-300 bg-base-100 px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-base-200 border border-base-300" />
                    <div>
                      <p className="font-medium">
                        {acc.alias} ·· {acc.number.slice(-4)}
                      </p>
                      <p className="text-xs text-base-content/60 capitalize">
                        {acc.type === 'checking' ? 'Corriente' : 'Ahorro'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(acc.balance, acc.currency)}</p>
                    <p className="text-xs text-base-content/60 capitalize">{acc.status}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-base-300 bg-base-100 px-3 py-3 text-sm text-base-content/70">
                Ver todas las cuentas y reglas automáticas de transferencias.
              </div>
            </div>
          </CardPanel> */}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr,1fr]">
          {/* <CardPanel title="Alertas y casos" actionLabel="Ver todas">
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
          </CardPanel> */}

          {/* <CardPanel title="Propietario principal">
            <div className="rounded-lg border border-base-300 bg-base-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sin propietario asignado</p>
                  <p className="text-sm text-base-content/60">Completa el paso de propietarios en onboarding.</p>
                </div>
                <span className="badge bg-primary/10 text-primary border-primary/30">Verificado</span>
              </div>
              <div className="text-sm text-base-content/70">
                Nacionalidad: N/D
                <br />
                PEP: N/D
                <br />
                Última prueba de vida: N/A
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm bg-base-100 border-base-300">Solicitar reintento</button>
                <button className="btn btn-sm btn-primary text-primary-content">Aprobar</button>
              </div>
            </div>
          </CardPanel> */}
        </div>
{/* 
        <div className="grid gap-4 lg:grid-cols-3">
          <SummaryCard
            title="Tarjeta corporativa"
            amount={formatCurrency(topAccounts[0]?.balance ?? 12505.87, 'DOP')}
            chipLabel="Balance"
            actionLabel="Pagar"
            meta="Autopago: 12 de ene"
          />
          <SummaryCard
            title="Bill Pay"
            amount="11 pendientes"
            chipLabel="Inbox 3 items • $10K"
            actionLabel="Ver"
            meta="1 vencida"
          />
          <SummaryCard
            title="Facturación"
            amount="12 items • $12.3K"
            chipLabel="Pagados: 12 • $6K"
            actionLabel="Ver"
            meta="Vencidos: 4 • $950"
          />
        </div> */}

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

function buildSparkline(transactions: Transaction[]) {
  const base = 35
  const points = transactions.slice(0, 7).map((tx, idx) => ({
    x: 10 + idx * 12,
    y: base - Math.min(30, Math.max(-10, tx.amount / 50000)),
  }))
  while (points.length < 7) {
    points.push({ x: 10 + points.length * 12, y: base - (5 + points.length) })
  }
  return points
}

function SummaryCard({
  title,
  amount,
  chipLabel,
  actionLabel,
  meta,
}: {
  title: string
  amount: string
  chipLabel: string
  actionLabel: string
  meta: string
}) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-base-content/60">{title}</p>
          <p className="text-xl font-semibold">{amount}</p>
        </div>
        <button className="btn btn-circle btn-ghost btn-sm border border-base-300">···</button>
      </div>
      <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
        <div className="h-full w-1/2 bg-primary/50" />
      </div>
      <div className="flex items-center justify-between text-sm text-base-content/70">
        <span>{meta}</span>
        <button className="btn btn-sm bg-base-100 border-base-300">{actionLabel}</button>
      </div>
      <div className="text-xs text-base-content/60">{chipLabel}</div>
    </div>
  )
}
