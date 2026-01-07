import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BackofficeShell, CardPanel } from '../components'
import { Company, formatCurrency, formatDate } from '../utils'

type PageProps = { searchParams?: { companyId?: string; status?: string } }

type PaymentRow = {
  id: string
  company_id: string
  account_id: string | null
  amount: number
  currency: string
  counterparty: string | null
  description: string | null
  status: string
  scheduled_at: string | null
  processed_at: string | null
  created_at: string
}

const tabs = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'need_approval', label: 'Need Approval' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'paid', label: 'Paid' },
]

export default async function PaymentsPage({ searchParams }: PageProps) {
  try {
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
            <p className="text-base-content/70">Inicia sesión para ver pagos.</p>
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
            <p className="text-base-content/70">Completa el onboarding para gestionar pagos.</p>
          </div>
        </div>
      )
    }

    const status = tabs.some((t) => t.key === searchParams?.status) ? searchParams?.status : 'inbox'

    const { data: paymentsRaw } = await supabase
      .from('payments')
      .select('id,company_id,account_id,amount,currency,counterparty,description,status,scheduled_at,processed_at,created_at')
      .eq('company_id', activeCompany.id)
      .eq('status', status)
      .order('created_at', { ascending: false })

    const payments = (paymentsRaw as PaymentRow[] | null) ?? []

    const buildUrl = (tabKey: string) => {
      const params = new URLSearchParams()
      if (activeCompany?.id) params.set('companyId', activeCompany.id)
      params.set('status', tabKey)
      return `/backoffice/payments?${params.toString()}`
    }

    return (
      <BackofficeShell
        companies={companies}
        activeCompany={activeCompany}
        activePath="/backoffice/payments"
        title="Pagos"
        subtitle="Operaciones"
        actionLabel="Enviar dinero"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="tabs tabs-boxed bg-base-200">
            {tabs.map((tab) => (
              <a
                key={tab.key}
                className={`tab ${status === tab.key ? 'tab-active' : ''}`}
                href={buildUrl(tab.key)}
              >
                {tab.label}
              </a>
            ))}
          </div>
          <button className="btn btn-primary text-primary-content">Enviar dinero</button>
        </div>

        <CardPanel title="Pagos">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-sm text-base-content/70">
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Contraparte</th>
                  <th className="text-right">Monto</th>
                  <th className="text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{formatDate(p.created_at)}</td>
                    <td className="font-medium">{p.description || 'Pago'}</td>
                    <td className="text-sm text-base-content/70">{p.counterparty || 'N/D'}</td>
                    <td className="text-right font-semibold">
                      {formatCurrency(Number(p.amount ?? 0), (p.currency as any) || 'DOP')}
                    </td>
                    <td className="text-right">
                      <span
                        className={`badge border ${
                          p.status === 'paid'
                            ? 'bg-success/10 text-success border-success/30'
                            : p.status === 'scheduled'
                              ? 'bg-info/10 text-info border-info/30'
                              : p.status === 'need_approval'
                                ? 'bg-warning/10 text-warning border-warning/30'
                                : 'bg-base-200 border-base-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-sm text-base-content/60 py-4">
                      No hay pagos en este estado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardPanel>
      </BackofficeShell>
    )
  } catch (err: any) {
    console.error('Error cargando pagos', err)
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Backoffice</p>
          <h1 className="text-2xl font-bold">Error al cargar pagos</h1>
          <p className="text-base-content/70">{err?.message ?? 'Revisa la conexión a Supabase.'}</p>
        </div>
      </div>
    )
  }
}
