import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { BackofficeShell, CardPanel } from '../components'
import { Company } from '../utils'

type PageProps = { searchParams?: { companyId?: string } }

export default async function AjustesPage({ searchParams }: PageProps) {
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
          <p className="text-base-content/70">Inicia sesión para ver configuración.</p>
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
          <p className="text-base-content/70">Completa el onboarding para configurar tu cuenta.</p>
        </div>
      </div>
    )
  }

  const { data: companySettings } = await supabase
    .from('company_settings')
    .select('language, timezone, notifications_email, security_2fa_required, statement_day')
    .eq('company_id', activeCompany.id)
    .maybeSingle()

  const { data: companyProfile } = await supabase
    .from('company_profile')
    .select('website, logo_url, description, mission, vision, address, social_links')
    .eq('company_id', activeCompany.id)
    .maybeSingle()

  const { data: userSettings } = await supabase
    .from('user_settings')
    .select('language, timezone, theme, notifications_email, notifications_push')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <BackofficeShell
      companies={companies}
      activeCompany={activeCompany}
      activePath="/backoffice/ajustes"
      title="Configuración"
      subtitle="Preferencias de la cuenta"
      actionLabel="Editar"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <CardPanel title="Ajustes de empresa">
          <div className="space-y-3 text-sm">
            <Row label="Idioma" value={companySettings?.language ?? 'es-DO'} />
            <Row label="Zona horaria" value={companySettings?.timezone ?? 'America/Santo_Domingo'} />
            <Row
              label="Notificaciones por correo"
              value={companySettings?.notifications_email ? 'Activadas' : 'Desactivadas'}
            />
            <Row
              label="2FA requerido"
              value={companySettings?.security_2fa_required ? 'Sí' : 'No'}
            />
            <Row label="Día de corte de estados" value={companySettings?.statement_day?.toString() ?? '1'} />
          </div>
        </CardPanel>

        <CardPanel title="Ajustes de usuario">
          <div className="space-y-3 text-sm">
            <Row label="Idioma" value={userSettings?.language ?? 'es-DO'} />
            <Row label="Zona horaria" value={userSettings?.timezone ?? 'America/Santo_Domingo'} />
            <Row label="Tema" value={userSettings?.theme ?? 'light'} />
            <Row
              label="Notificaciones email"
              value={userSettings?.notifications_email ? 'Activadas' : 'Desactivadas'}
            />
            <Row
              label="Notificaciones push"
              value={userSettings?.notifications_push ? 'Activadas' : 'Desactivadas'}
            />
          </div>
        </CardPanel>
      </div>

      <CardPanel title="Perfil de empresa">
        <div className="grid gap-3 text-sm">
          <Row label="Sitio web" value={companyProfile?.website ?? 'No definido'} />
          <Row label="Logo" value={companyProfile?.logo_url ?? 'No definido'} />
          <Row label="Descripción" value={companyProfile?.description ?? 'Agrega una descripción'} />
          <Row label="Misión" value={companyProfile?.mission ?? 'Agrega tu misión'} />
          <Row label="Visión" value={companyProfile?.vision ?? 'Agrega tu visión'} />
          <Row label="Dirección" value={companyProfile?.address ?? 'No definida'} />
          <Row
            label="Redes"
            value={
              companyProfile?.social_links
                ? Object.entries(companyProfile.social_links as Record<string, string>)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' • ')
                : 'No definidas'
            }
          />
        </div>
      </CardPanel>
    </BackofficeShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-base-300 bg-base-100 px-3 py-2">
      <span className="text-base-content/70">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
