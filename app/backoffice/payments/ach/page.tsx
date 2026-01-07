import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import AchClient from './AchClient'
import { Company } from '../../utils'

type PageProps = { searchParams?: { companyId?: string } }

export default async function AchPage({ searchParams }: PageProps) {
  try {
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
            <p className="text-base-content/70">Inicia sesión para ver autorizaciones ACH.</p>
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
            <p className="text-base-content/70">Completa el onboarding para gestionar ACH.</p>
          </div>
        </div>
      )
    }

    const { data: achRaw } = await supabase
      .from('ach_authorizations')
      .select('id,amount,currency,description,status,created_at')
      .eq('company_id', activeCompany.id)
      .order('created_at', { ascending: false })

    const ach = achRaw ?? []

    return <AchClient companies={companies} activeCompany={activeCompany} ach={ach} />
  } catch (err: any) {
    console.error('Error cargando ACH', err)
    return (
      <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Backoffice</p>
          <h1 className="text-2xl font-bold">Error al cargar ACH</h1>
          <p className="text-base-content/70">{err?.message ?? 'Revisa la conexión a Supabase.'}</p>
        </div>
      </div>
    )
  }
}
