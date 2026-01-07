'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import WaitlistForm from '../components/WaitlistForm'
import { logFirebaseEvent } from '../services/firebaseClient'

type BillingCycle = 'monthly' | 'annual'

type Plan = {
  id: string
  name: string
  description: string
  price: Record<BillingCycle, string>
  badge?: string
  highlight?: boolean
  perks: string[]
  note?: string
  ctaLabel?: string
}

type FeeItem = {
  label: string
  price: string
  helper?: string
}

type ComparisonRow = {
  label: string
  essential: boolean | string
  growth: boolean | string
  enterprise: boolean | string
  helper?: string
}

const plans: Plan[] = [
  {
    id: 'essential',
    name: 'Esencial',
    description: 'Todo para operar tu negocio sin costos escondidos.',
    price: {
      monthly: 'RD$0',
      annual: 'RD$0',
    },
    badge: 'Sin costo fijo',
    perks: [
      'Transferencias nacionales ilimitadas',
      'Tarjetas virtuales sin costo',
      'Reportes y exportación de movimientos',
      'Alertas en tiempo real',
      'Soporte por chat y correo',
    ],
    note: 'Ideal para iniciar y validar tu operación digital.',
  },
  {
    id: 'growth',
    name: 'Crecimiento',
    description: 'Pensado para equipos que transaccionan a diario.',
    price: {
      monthly: 'RD$1,200',
      annual: 'RD$990',
    },
    badge: 'Más popular',
    highlight: true,
    perks: [
      'Todo lo de Esencial',
      'Conciliación automática y categorización IA',
      'Tarjetas físicas para el equipo',
      'Roles y permisos avanzados',
      'Reportes fiscales listos para tu contador',
      'Soporte prioritario en minutos',
    ],
    note: 'Ahorra 18% pagando anual (cobro anticipado).',
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    description: 'Operaciones de alto volumen y acompañamiento dedicado.',
    price: {
      monthly: 'Hablemos',
      annual: 'Hablemos',
    },
    perks: [
      'Implementación guiada y onboarding para tu equipo',
      'Integraciones personalizadas y API',
      'Límites operativos flexibles',
      'Controles de aprobación y auditoría',
      'Gerente de cuenta dedicado',
    ],
    note: 'Diseñamos el esquema de cobro contigo.',
    ctaLabel: 'Habla con nosotros',
  },
]

const feeItems: FeeItem[] = [
  { label: 'Transferencias locales ACH y LBTR', price: 'Incluidas' },
  { label: 'Tarjetas virtuales', price: 'Incluidas' },
  { label: 'Tarjetas físicas adicionales', price: 'RD$450 c/u', helper: 'Envío estándar incluido' },
  { label: 'Depósitos en efectivo', price: '1% del monto', helper: 'Mínimo RD$50' },
  { label: 'Cambio de divisas', price: 'TC mercado + 0.6%', helper: 'Aplicado al monto convertido' },
  { label: 'Reposición de tarjeta', price: 'RD$300', helper: 'Solo si la pierdes o la dañas' },
]

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Transferencias nacionales ilimitadas',
    essential: true,
    growth: true,
    enterprise: true,
  },
  {
    label: 'Tarjetas virtuales',
    essential: true,
    growth: true,
    enterprise: true,
  },
  {
    label: 'Tarjetas físicas para el equipo',
    essential: 'Hasta 1',
    growth: 'Hasta 5',
    enterprise: 'Ilimitadas',
  },
  {
    label: 'Conciliación automática e IA para gastos',
    essential: false,
    growth: true,
    enterprise: true,
  },
  {
    label: 'Roles, aprobaciones y límites por usuario',
    essential: 'Básicos',
    growth: 'Avanzados',
    enterprise: 'Personalizados',
  },
  {
    label: 'Reportes fiscales y exportables',
    essential: true,
    growth: true,
    enterprise: 'Con soporte dedicado',
  },
  {
    label: 'Soporte',
    essential: 'Chat y correo',
    growth: 'Prioridad en minutos',
    enterprise: 'Gerente dedicado',
  },
]

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14" />
    </svg>
  )
}

export default function PricingContent() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const router = useRouter()
  const waitlistRef = useRef<HTMLDivElement>(null)

  const heroStats = useMemo(
    () => [
      { label: 'Costo fijo', value: 'RD$0' },
      { label: 'Transferencias locales', value: 'Incluidas' },
      { label: 'Cargos sorpresa', value: 'Ninguno' },
    ],
    []
  )

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCta = (href = '#waitlist', meta?: Record<string, string>) => {
    if (href.startsWith('#')) {
      scrollToWaitlist()
      if (meta) void logFirebaseEvent('pricing_cta', meta)
      return
    }

    if (href.startsWith('/#')) {
      router.push(href)
      if (meta) void logFirebaseEvent('pricing_cta', meta)
      return
    }

    router.push(href)
    if (meta) void logFirebaseEvent('pricing_cta', meta)
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header
        onCtaClick={() => handleCta('#waitlist', { action: 'cta_header', location: 'pricing' })}
        navLinks={[
          { href: '/#features', label: 'Características', type: 'route' },
          { href: '/pricing', label: 'Precios', type: 'route' },
          { href: '/about', label: 'Nosotros', type: 'route' },
          { href: '#waitlist', label: 'Regístrate', type: 'anchor' },
        ]}
      />

      <main className="pt-24">
        {/* Hero */}
        <section className="section relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-80" />
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="container-custom relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-base-100/80 px-4 py-2 border border-base-300  backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
                <span className="text-sm font-medium text-base-content/70">Precios claros</span>
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl font-bold text-base-content leading-tight">
                Precios transparentes, sin letra pequeña
              </h1>
              <p className="mt-4 text-lg text-base-content/70 max-w-2xl">
                Opera tu negocio sin fricción: transferencias locales incluidas, tarjetas sin costo y planes que crecen contigo.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-1 bg-base-100/80 p-1 rounded-2xl border border-base-300 backdrop-blur">
                  {(['monthly', 'annual'] as BillingCycle[]).map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => {
                        setBillingCycle(cycle)
                        void logFirebaseEvent('pricing_billing_cycle', { cycle })
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        billingCycle === cycle
                          ? 'bg-primary text-primary-content shadow-lg shadow-primary/30'
                          : 'text-base-content/70 hover:text-base-content'
                      }`}
                    >
                      {cycle === 'monthly' ? 'Mensual' : 'Anual'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-base-content/70">
                  Paga anual y ahorra 2 meses. Cambia de plan cuando quieras.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-base-300 bg-base-100/80 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-sm text-base-content/60">{stat.label}</p>
                    <p className="text-xl font-semibold text-base-content mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Planes */}
        <section className="section pt-0">
          <div className="container-custom">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">Planes</p>
                <h2 className="text-2xl md:text-3xl font-bold text-base-content mt-2">
                  Elige el plan que mejor se ajusta a tu operación
                </h2>
                <p className="text-base text-base-content/70 mt-2">
                  Todos incluyen transferencias locales y tarjetas virtuales sin costo.
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  handleCta('#waitlist', { action: 'cta_contact', location: 'plans_header' })
                }
              >
                Habla con nosotros
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const price = plan.price[billingCycle]
                return (
                  <div
                    key={plan.id}
                    className={`card h-full border ${
                      plan.highlight ? 'border-primary shadow-primary/20' : 'border-base-300'
                    } bg-base-100`}
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-base-content/70">{plan.name}</p>
                          <p className="text-base text-base-content/60">{plan.description}</p>
                        </div>
                        {plan.badge && (
                          <span
                            className={`badge badge-outline w-56 ${plan.highlight ? 'border-primary text-primary' : ''}`}
                          >
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-base-content">{price}</p>
                        {price !== 'Hablemos' && (
                          <span className="text-sm text-base-content/60">
                            {billingCycle === 'monthly' ? '/mes' : '/mes facturado anual'}
                          </span>
                        )}
                      </div>
                      {plan.note && <p className="text-sm text-base-content/60">{plan.note}</p>}

                      <div className="mt-4 space-y-3">
                        {plan.perks.map((perk) => (
                          <div key={perk} className="flex items-start gap-3 text-sm text-base-content/80">
                            <div className="mt-0.5 h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                              <CheckIcon className="w-4 h-4 text-primary" />
                            </div>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 mt-auto">
                        <button
                          className={`btn w-full ${plan.highlight ? 'btn-primary' : 'btn-outline'} `}
                          onClick={() =>
                            handleCta('#waitlist', {
                              action: 'plan_cta',
                              plan_id: plan.id,
                              billing_cycle: billingCycle,
                            })
                          }
                        >
                          {plan.ctaLabel ?? 'Separa tu cupo'}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Cargos transparentes */}
        <section className="section pt-0">
          <div className="container-custom">
            <div className="rounded-3xl border border-base-300 bg-base-100 shadow-lg shadow-base-300/30 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide">Cargos transparentes</p>
                  <h3 className="text-2xl font-bold text-base-content mt-2">Lo que cobramos (y lo que no)</h3>
                  <p className="text-base text-base-content/70 mt-1">
                    Sin sorpresas. Estos son los únicos cargos que podrías ver en tu cuenta.
                  </p>
                </div>
                <span className="badge badge-lg badge-outline text-base-content/70">
                  Sin mantenimiento mensual
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {feeItems.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-base-200">
                    <div>
                      <p className="font-semibold text-base-content">{item.label}</p>
                      {item.helper && <p className="text-sm text-base-content/60">{item.helper}</p>}
                    </div>
                    <p className="text-base font-semibold text-base-content/80 whitespace-nowrap">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparativa */}
        <section className="section pt-0">
          <div className="container-custom">
            <div className="mb-6">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">Comparativa rápida</p>
              <h3 className="text-2xl font-bold text-base-content mt-2">Lo que incluye cada plan</h3>
            </div>

            <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-lg shadow-base-300/30">
              <div className="grid grid-cols-4 bg-base-200/70 text-sm font-semibold text-base-content/80">
                <div className="px-4 py-3">Beneficio</div>
                <div className="px-4 py-3 text-center">Esencial</div>
                <div className="px-4 py-3 text-center">Crecimiento</div>
                <div className="px-4 py-3 text-center">Empresarial</div>
              </div>
              <div>
                {comparisonRows.map((row, idx) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-4 px-4 md:px-6 py-4 text-sm ${
                      idx % 2 === 0 ? 'bg-base-100' : 'bg-base-200/50'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-base-content">{row.label}</span>
                      {row.helper && <span className="text-xs text-base-content/60">{row.helper}</span>}
                    </div>
                    {[row.essential, row.growth, row.enterprise].map((value, i) => (
                      <div key={i} className="flex items-center justify-center text-base-content">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                              <CheckIcon className="w-4 h-4 text-primary" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-lg bg-base-300/50 flex items-center justify-center">
                              <MinusIcon className="w-3.5 h-3.5 text-base-content/50" />
                            </div>
                          )
                        ) : (
                          <span className="text-sm text-base-content/80">{value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ + CTA */}
        <section className="section pt-0">
          <div className="container-custom grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">Preguntas frecuentes</p>
              <h3 className="text-2xl font-bold text-base-content mt-2">Todo lo que necesitas saber</h3>
              <div className="mt-4 space-y-3">
                {[
                  {
                    q: '¿Hay cargos de mantenimiento o mínimos de balance?',
                    a: 'No. No cobramos mantenimiento ni exigimos saldo mínimo. Solo aplican los cargos específicos listados arriba cuando corresponden.',
                  },
                  {
                    q: '¿Puedo cambiar de plan cuando quiera?',
                    a: 'Sí. Puedes subir o bajar de plan en cualquier momento. Si pagas anual, prorrateamos el cambio en la siguiente factura.',
                  },
                  {
                    q: '¿Qué pasa si mi equipo crece?',
                    a: 'Los usuarios adicionales y sus tarjetas están incluidos en Crecimiento y Empresarial. Ajustamos límites y permisos para que controles cada gasto.',
                  },
                  {
                    q: '¿Cómo empiezo si aún no estoy en producción?',
                    a: 'Separa tu cupo en la lista de espera y te avisamos en cuanto abramos cuentas nuevas. Mientras, te ayudamos a preparar tu negocio para el onboarding.',
                  },
                ].map((item) => (
                  <div key={item.q} className="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="checkbox" />
                    <div className="collapse-title text-base font-semibold text-base-content">{item.q}</div>
                    <div className="collapse-content text-sm text-base-content/70">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
              <div className="absolute inset-0 opacity-20 grid-pattern" />
              <div className="relative p-8 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wide">Listo para empezar</p>
                <h3 className="text-3xl font-bold leading-tight">
                  Separa tu cupo y lanza con un equipo que te acompaña.
                </h3>
                <p className="text-base text-primary-content/80 max-w-xl">
                  Te guiamos en el onboarding, configuramos tus tarjetas y reportes, y te ayudamos a migrar información si ya usas otro banco digital.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleCta('#waitlist', {
                        action: 'cta_banner',
                        location: 'pricing_bottom',
                      })
                    }
                  >
                    Separa tu cupo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <button
                    className="btn btn-outline border-primary/50 text-primary-content"
                    onClick={() =>
                      handleCta('/#features', { action: 'cta_banner', location: 'pricing_bottom_features' })
                    }
                  >
                    Ver producto
                  </button>
                </div>
                <p className="text-sm text-primary-content/70">Sin costos ocultos. Puedes cancelar cuando quieras.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist embebido */}
        <div ref={waitlistRef}>
          <WaitlistForm />
        </div>
      </main>
    </div>
  )
}
