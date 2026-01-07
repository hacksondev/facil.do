import { BackofficeShell, CardPanel } from '../../components'
import { Company, fetchMock } from '../../utils'

type CompaniesResponse = { data: Company[] }

async function getData() {
  const companiesRes = await fetchMock<CompaniesResponse>('/api/mock/companies')
  return { companies: companiesRes.data }
}

export default async function ImpuestosPage({
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
      title="Impuestos"
      subtitle="Pagos"
      actionLabel="Pagar impuesto"
    >
      <CardPanel title="Pagos de impuestos" subtitle="Mock">
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-sm text-base-content/70">
          Aquí podrás ver obligaciones fiscales y pagos programados. Por ahora es mock.
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}
