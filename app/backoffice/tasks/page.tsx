import { BackofficeShell, CardPanel } from '../components'
import { Company, fetchMock } from '../utils'

type CompaniesResponse = {
  data: Company[]
}

async function getData() {
  const companiesRes = await fetchMock<CompaniesResponse>('/api/mock/companies')
  return { companies: companiesRes.data }
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams?: { companyId?: string }
}) {
  const { companies } = await getData()
  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/tasks"
      title="Tareas"
      subtitle="Backoffice"
      actionLabel="Crear tarea"
    >
      <CardPanel title="Tareas pendientes">
        <div className="grid gap-3 md:grid-cols-2">
          {['Revisar PEP', 'Verificar factura', 'Aprobar liveness', 'Revisar alerta ACH'].map((task, idx) => (
            <div key={task} className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{task}</p>
                <span className="badge bg-base-200 border-base-300 text-xs">Prioridad {idx + 1}</span>
              </div>
              <p className="text-sm text-base-content/70">Asignado a equipo Ops. SLA: 4h.</p>
              <div className="flex gap-2">
                <button className="btn btn-sm bg-base-100 border-base-300">Detalle</button>
                <button className="btn btn-sm btn-primary text-primary-content">Marcar listo</button>
              </div>
            </div>
          ))}
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}
