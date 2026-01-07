import { BackofficeShell, CardPanel } from '../../components'
import { Company, fetchMock } from '../../utils'

type CompaniesResponse = { data: Company[] }

async function getData() {
  const companiesRes = await fetchMock<CompaniesResponse>('/api/mock/companies')
  return { companies: companiesRes.data }
}

export default async function BeneficiariosPage({
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
      activePath="/backoffice/payments"
      title="Beneficiarios"
      subtitle="Pagos"
      actionLabel="Nuevo beneficiario"
    >
      <CardPanel title="Beneficiarios" subtitle="Listado mock">
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-sm text-base-content/70">
          No hay beneficiarios mock. Agrega registros al conectar la API real.
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}
