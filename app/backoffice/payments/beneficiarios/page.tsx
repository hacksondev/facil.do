import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BackofficeShell, CardPanel } from '../../components'
import { Company, formatCurrency } from '../../utils'
import BeneficiarioForm from './BeneficiarioForm'

type PageProps = { searchParams?: { companyId?: string } }

export default async function BeneficiariosPage({ searchParams }: PageProps) {
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
          <p className="text-base-content/70">Inicia sesión para ver beneficiarios.</p>
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
          <p className="text-base-content/70">Completa el onboarding para gestionar beneficiarios.</p>
        </div>
      </div>
    )
  }

  const { data: beneficiariesRaw } = await supabase
    .from('beneficiaries')
    .select('id,name,email,bank_name,account_number,account_type,currency,status,created_at')
    .eq('company_id', activeCompany.id)
    .order('created_at', { ascending: false })

  const beneficiaries = beneficiariesRaw ?? []

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/payments"
      title="Beneficiarios"
      subtitle="Pagos"
      actionLabel="Nuevo beneficiario"
    >
      <div className="flex justify-end mb-3">
        <button
          className="btn btn-primary text-primary-content"
          onClick={() => {
            const dialog = document.getElementById('modal-beneficiario') as HTMLDialogElement | null
            dialog?.showModal()
          }}
        >
          Nuevo beneficiario
        </button>
      </div>

      <CardPanel title="Beneficiarios">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Nombre</th>
                <th>Banco</th>
                <th>Cuenta</th>
                <th className="text-right">Moneda</th>
                <th className="text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-base-content/60">{b.email}</div>
                  </td>
                  <td className="text-sm text-base-content/70">{b.bank_name}</td>
                  <td className="text-sm text-base-content/70">{b.account_number}</td>
                  <td className="text-right text-sm font-semibold">{b.currency}</td>
                  <td className="text-right">
                    <span
                      className={`badge border ${
                        b.status === 'active'
                          ? 'bg-success/10 text-success border-success/30'
                          : b.status === 'pending'
                            ? 'bg-warning/10 text-warning border-warning/30'
                            : 'bg-error/10 text-error border-error/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {beneficiaries.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-base-content/60 py-4">
                    No hay beneficiarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardPanel>

      <dialog id="modal-beneficiario" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-semibold text-lg mb-3">Nuevo beneficiario</h3>
          <BeneficiarioForm companyId={activeCompany.id} />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </BackofficeShell>
  )
}
