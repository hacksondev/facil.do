import { BackofficeShell, CardPanel } from '../components'
import { Alert, Company, fetchMock, formatDate } from '../utils'

type CompaniesResponse = {
  data: Company[]
}

type AlertsResponse = {
  data: Alert[]
}

async function getData() {
  const [companiesRes, alertsRes] = await Promise.all([
    fetchMock<CompaniesResponse>('/api/mock/companies'),
    fetchMock<AlertsResponse>('/api/mock/alerts'),
  ])

  return {
    companies: companiesRes.data,
    alerts: alertsRes.data,
  }
}

type PageProps = {
  searchParams?: {
    companyId?: string
  }
}

export default async function AlertsPage({ searchParams }: PageProps) {
  const { companies, alerts } = await getData()
  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]

  const scopedAlerts = activeCompany
    ? alerts.filter((a) => a.entityType !== 'company' || a.entityId === activeCompany.id)
    : alerts

  const open = scopedAlerts.filter((a) => a.status === 'open')
  const resolved = scopedAlerts.filter((a) => a.status === 'resolved')

  const high = scopedAlerts.filter((a) => a.severity === 'high').length
  const medium = scopedAlerts.filter((a) => a.severity === 'medium').length
  const low = scopedAlerts.filter((a) => a.severity === 'low').length

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/alerts"
      title="Alertas AML"
      subtitle="Screening y monitoreo"
      actionLabel="Crear caso AML"
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
        <CardPanel title="Resumen de alertas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SummaryBox label="Abiertas" value={open.length} tone="bg-warning/10 text-warning border-warning/30" />
            <SummaryBox label="Resueltas" value={resolved.length} tone="bg-success/10 text-success border-success/30" />
            <SummaryBox label="Total" value={alerts.length} tone="bg-base-200 text-base-content border-base-300" />
          </div>
          <div className="mt-4 flex gap-2 text-sm text-base-content/70">
            <Badge tone="bg-error/10 text-error border-error/30" label={`${high} altas`} />
            <Badge tone="bg-warning/10 text-warning border-warning/30" label={`${medium} medias`} />
            <Badge tone="bg-base-200 text-base-content border-base-300" label={`${low} bajas`} />
          </div>
        </CardPanel>

        <CardPanel title="Acciones sugeridas">
          <div className="space-y-3 text-sm text-base-content/70">
            <div className="rounded-lg border border-base-300 bg-base-100 p-3">
              <p className="font-medium text-base-content">Revisión de wires USD pendientes</p>
              <p>Solicita documentos de soporte y confirma beneficiarios finales.</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-3">
              <p className="font-medium text-base-content">Actualiza listas internas</p>
              <p>Sincroniza listas de fraude y contracargos con el core.</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100 p-3">
              <p className="font-medium text-base-content">Audita PEP recientes</p>
              <p>Confirma coincidencias manuales antes de cerrar casos.</p>
            </div>
          </div>
        </CardPanel>
      </div>

      <CardPanel title="Alertas abiertas" actionLabel="Exportar CSV">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Tipo</th>
                <th>Entidad</th>
                <th>Severidad</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {open.map((alert) => {
                const company = alert.entityType === 'company' ? companies.find((c) => c.id === alert.entityId) : null
                return (
                  <tr key={alert.id}>
                    <td className="font-semibold capitalize">{alert.type}</td>
                    <td className="text-sm text-base-content/70">
                      {alert.entityType === 'company' ? company?.name ?? alert.entityId : `${alert.entityType} ·· ${alert.entityId.slice(-4)}`}
                    </td>
                    <td>
                      <span
                        className={`badge border ${
                          alert.severity === 'high'
                            ? 'bg-error/10 text-error border-error/30'
                            : alert.severity === 'medium'
                              ? 'bg-warning/10 text-warning border-warning/30'
                              : 'bg-base-200 text-base-content border-base-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td>
                      <span className="badge border bg-warning/10 text-warning border-warning/30">open</span>
                    </td>
                    <td className="text-sm text-base-content/60">{formatDate(alert.createdAt)}</td>
                    <td className="text-sm text-base-content/70">{alert.message}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardPanel>

      <CardPanel title="Alertas cerradas">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Tipo</th>
                <th>Entidad</th>
                <th>Severidad</th>
                <th>Fecha</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {resolved.map((alert) => {
                const company = alert.entityType === 'company' ? companies.find((c) => c.id === alert.entityId) : null
                return (
                  <tr key={alert.id}>
                    <td className="font-semibold capitalize">{alert.type}</td>
                    <td className="text-sm text-base-content/70">
                      {alert.entityType === 'company' ? company?.name ?? alert.entityId : `${alert.entityType} ·· ${alert.entityId.slice(-4)}`}
                    </td>
                    <td>
                      <span
                        className={`badge border ${
                          alert.severity === 'high'
                            ? 'bg-error/10 text-error border-error/30'
                            : alert.severity === 'medium'
                              ? 'bg-warning/10 text-warning border-warning/30'
                              : 'bg-base-200 text-base-content border-base-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="text-sm text-base-content/60">{formatDate(alert.createdAt)}</td>
                    <td className="text-sm text-base-content/70">{alert.message}</td>
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

function SummaryBox({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <p className="text-sm text-base-content/70">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  )
}

function Badge({ label, tone }: { label: string; tone: string }) {
  return <span className={`badge border ${tone}`}>{label}</span>
}
