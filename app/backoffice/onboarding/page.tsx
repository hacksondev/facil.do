import { BackofficeShell, CardPanel, ProgressRow } from '../components'
import {
  Company,
  LivenessSession,
  OnboardingCase,
  fetchMock,
  formatDate,
  riskColor,
  statusBadge,
} from '../utils'

type CompaniesResponse = {
  data: Company[]
}

type OnboardingCasesResponse = {
  data: OnboardingCase[]
}

type LivenessResponse = {
  data: LivenessSession[]
}

async function getData() {
  const [companiesRes, casesRes, livenessRes] = await Promise.all([
    fetchMock<CompaniesResponse>('/api/mock/companies'),
    fetchMock<OnboardingCasesResponse>('/api/mock/onboarding-cases'),
    fetchMock<LivenessResponse>('/api/mock/liveness-sessions'),
  ])

  const companies = companiesRes.data
  const cases = casesRes.data
  const liveness = livenessRes.data

  return { companies, cases, liveness }
}

type PageProps = {
  searchParams?: {
    companyId?: string
  }
}

export default async function OnboardingPage({ searchParams }: PageProps) {
  const { companies, cases, liveness } = await getData()
  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]

  const totals = {
    collecting: cases.filter((c) => c.status === 'collecting').length,
    pending: cases.filter((c) => c.status === 'pending_review').length,
    approved: cases.filter((c) => c.status === 'approved').length,
  }

  const rows = companies.map((company) => {
    const foundCase = cases.find((c) => c.companyId === company.id)
    const livenessScore = liveness.find((l) => l.personId === company.ownerPersonId)?.score
    return { company, case: foundCase, livenessScore }
  })

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/onboarding"
      title="Onboarding"
      subtitle="KYB/KYC empresas"
      actionLabel="Crear caso"
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
        <CardPanel title="Resumen de casos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SummaryPill label="En captura" value={totals.collecting} tone="bg-warning/10 text-warning border-warning/30" />
            <SummaryPill label="En revisión" value={totals.pending} tone="bg-primary/10 text-primary border-primary/30" />
            <SummaryPill label="Aprobados" value={totals.approved} tone="bg-success/10 text-success border-success/30" />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <ProgressRow
              label="Liveness completado"
              value={Math.round((liveness.length / Math.max(1, companies.length)) * 100)}
            />
            <ProgressRow label="Screening PEP/Sanciones" value={Math.min(100, totals.pending * 15 + totals.approved * 30)} />
          </div>
        </CardPanel>

        <CardPanel title="Próximos pasos" subtitle="Checklist">
          <div className="space-y-3 text-sm text-base-content/70">
            <div className="rounded-lg border border-base-300 bg-base-100 p-3">
              <p className="font-medium text-base-content">Solicitar reintento de liveness</p>
              <p>Aplica a propietarios con score &lt; 0.8 o expirados.</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-3">
              <p className="font-medium text-base-content">Revisión manual PEP</p>
              <p>Confirmar coincidencias y evidencia documental.</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-3">
              <p className="font-medium text-base-content">Validar documentos constitutivos</p>
              <p>Acta, RNC y registro mercantil actualizados.</p>
            </div>
          </div>
        </CardPanel>
      </div>

      <CardPanel title="Casos activos" actionLabel="Exportar CSV">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Empresa</th>
                <th>Riesgo</th>
                <th>Estado</th>
                <th>Reviewer</th>
                <th>Liveness</th>
                <th>Actualizado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.company.id}>
                  <td>
                    <div className="font-semibold">{row.company.name}</div>
                    <div className="text-xs text-base-content/60">RNC {row.company.rnc}</div>
                  </td>
                  <td>
                    <span className={`badge border ${riskColor(row.company.riskLevel)}`}>{row.company.riskLevel}</span>
                  </td>
                  <td>
                    {row.case ? (
                      <span className={`badge border ${statusBadge(row.case.status)}`}>
                        {row.case.status.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="badge border bg-base-200 border-base-300 text-base-content/70">Sin caso</span>
                    )}
                  </td>
                  <td className="text-sm text-base-content/70">{row.case?.reviewer ?? 'Asignar'}</td>
                  <td className="text-sm text-base-content/70">
                    {row.livenessScore ? `${(row.livenessScore * 100).toFixed(0)}%` : 'Pendiente'}
                  </td>
                  <td className="text-sm text-base-content/60">
                    {row.case?.updatedAt ? formatDate(row.case.updatedAt) : '—'}
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

function SummaryPill({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${tone}`}>
      <p className="text-sm text-base-content/70">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}
