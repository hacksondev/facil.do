import { BackofficeShell, CardPanel } from '../components'
import { Company, fetchMock } from '../utils'

type CompaniesResponse = { data: Company[] }

async function getData() {
  const companiesRes = await fetchMock<CompaniesResponse>('/api/mock/companies')
  return { companies: companiesRes.data }
}

const tiles = [
  { title: 'Beneficiarios', desc: 'Lista y verificación de cuentas destino.', href: '/backoffice/payments/beneficiarios' },
  { title: 'Impuestos', desc: 'Pagos fiscales y retenciones.', href: '/backoffice/payments/impuestos' },
  { title: 'Autorizaciones ACH', desc: 'Mandatos y aprobaciones ACH.', href: '/backoffice/payments/ach' },
]

export default async function PaymentsPage({
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
      title="Pagos"
      subtitle="Operaciones"
      actionLabel="Nuevo pago"
    >
      <CardPanel title="Módulos de pagos">
        <div className="grid gap-3 md:grid-cols-3">
          {tiles.map((tile) => (
            <a
              key={tile.title}
              href={tile.href + (searchParams?.companyId ? `?companyId=${searchParams.companyId}` : '')}
              className="rounded-xl border border-base-300 bg-base-100 p-4 hover:border-primary/40 transition"
            >
              <p className="font-semibold">{tile.title}</p>
              <p className="text-sm text-base-content/70 mt-1">{tile.desc}</p>
            </a>
          ))}
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}
