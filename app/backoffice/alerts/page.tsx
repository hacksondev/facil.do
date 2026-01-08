import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BackofficeShell, CardPanel } from '../components'
import { Company, formatDate } from '../utils'

type PageProps = { searchParams?: { companyId?: string } }

export default async function AlertsPage({ searchParams }: PageProps) {
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
          <p className="text-base-content/70">Inicia sesión para ver alertas.</p>
        </div>
      </div>
    )
  }

  const { data: companiesRaw } = await supabase
    .from('companies')
    .select('id,name,rnc,industry,created_at')
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
          <p className="text-base-content/70">Completa el onboarding para ver alertas.</p>
        </div>
      </div>
    )
  }

  const { data: alertsRaw } = await supabase
    .from('alerts')
    .select('id,type,severity,status,entity_type,entity_id,message,created_at')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  const alerts = alertsRaw ?? []

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/alerts"
      title="Alertas"
      subtitle="Operativas y AML"
      actionLabel="Configurar alertas"
    >
      <CardPanel title="Alertas" subtitle="Últimas alertas">
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className="rounded-lg border border-base-300 bg-base-100 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{a.type}</span>
                <span className="text-xs text-base-content/60">{formatDate(a.created_at)}</span>
              </div>
              <p className="text-sm text-base-content/70 mt-1">{a.message || 'Sin descripción'}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="badge border bg-base-200 border-base-300">{a.entity_type}</span>
                <span className="badge border bg-base-200 border-base-300">{a.status}</span>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-sm text-base-content/60">No hay alertas. Conecta tu monitoreo para ver eventos.</p>
          )}
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}
