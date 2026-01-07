import { BackofficeShell, CardPanel } from '../components'
import { Company, fetchMock } from '../utils'

type CompaniesResponse = { data: Company[] }

async function getData() {
  const companiesRes = await fetchMock<CompaniesResponse>('/api/mock/companies')
  return { companies: companiesRes.data }
}

export default async function ReferidosPage({ searchParams }: { searchParams?: { companyId?: string } }) {
  const { companies } = await getData()
  const activeCompany =
    companies.find((c) => (searchParams?.companyId ? c.id === searchParams.companyId : c)) ?? companies[0]

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/referidos"
      title="Referidos"
      subtitle="Programa de referidos"
      actionLabel="Compartir enlace"
    >
      <CardPanel title="Invitaciones" subtitle="Mock">
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-sm text-base-content/70 space-y-2">
          <p>Comparte el programa de referidos y rastrea invitaciones. (Mock, sin datos aún)</p>
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}
