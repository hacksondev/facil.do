import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BackofficeShell, CardPanel } from '../components'
import { Company } from '../utils'
import UserForm from './UserForm'

type PageProps = { searchParams?: { companyId?: string } }

export default async function UsuarioPage({ searchParams }: PageProps) {
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
          <p className="text-base-content/70">Inicia sesión para ver usuarios.</p>
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
          <p className="text-base-content/70">Completa el onboarding para gestionar usuarios.</p>
        </div>
      </div>
    )
  }

  const { data: companyUsers } = await supabase
    .from('company_users')
    .select('id,name,email,role,status,invited_at,accepted_at')
    .eq('company_id', activeCompany.id)
    .order('invited_at', { ascending: false })

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/usuario"
      title="Usuarios"
      subtitle="Perfil y roles"
      actionLabel="Agregar"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <CardPanel title="Usuarios de la empresa" actionLabel="Refrescar">
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr className="text-xs uppercase text-base-content/60">
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {companyUsers?.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.name}</td>
                    <td className="text-sm text-base-content/70">{u.email}</td>
                    <td>
                      <span className="badge border bg-base-200">{u.role}</span>
                    </td>
                    <td>
                      <span
                        className={`badge border ${
                          u.status === 'active'
                            ? 'bg-success/10 text-success border-success/30'
                            : u.status === 'disabled'
                              ? 'bg-error/10 text-error border-error/30'
                              : 'bg-warning/10 text-warning border-warning/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!companyUsers || companyUsers.length === 0) && (
                  <tr>
                    <td colSpan={4} className="text-sm text-base-content/60 text-center py-4">
                      Aún no hay usuarios en esta empresa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardPanel>

        <CardPanel title="Crear usuario" subtitle="Rol y correo de invitación">
          <UserForm companyId={activeCompany.id} />
        </CardPanel>
      </div>
    </BackofficeShell>
  )
}
