'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
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

  const heroStats = useMemo(
    () => [
      { label: 'Costo fijo', value: 'RD$0' },
      { label: 'Transferencias locales', value: 'Incluidas' },
      { label: 'Cargos sorpresa', value: 'Ninguno' },
    ],
    []
  )

  const handleCta = (href: string, meta?: Record<string, string>) => {
    if (meta) void logFirebaseEvent('pricing_cta', meta)
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header
        navLinks={[
          { href: '/#features', label: 'Características', type: 'route' },
          { href: '/pricing', label: 'Precios', type: 'route' },
          { href: '/about', label: 'Nosotros', type: 'route' },
        ]}
      />

      <main className="pt-24">
        {/* Hero - Flat Design */}
        <section className="section relative overflow-hidden bg-base-200">
          <div className="absolute inset-0 dot-pattern-flat opacity-30" />
          <div className="container-custom relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 border-2 border-success mb-6">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm font-semibold text-success">Precios claros</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-base-content leading-tight">
                Precios transparentes, sin letra pequeña
              </h1>
              <p className="mt-4 text-lg text-base-content/70 max-w-2xl font-medium">
                Opera tu negocio sin fricción: transferencias locales incluidas, tarjetas sin costo y planes que crecen contigo.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-1 bg-base-100 p-1 rounded-2xl border-2 border-base-300">
                  {(['monthly', 'annual'] as BillingCycle[]).map((cycle) => (
                    <button
                      key={cycle}
                      onClick={() => {
                        setBillingCycle(cycle)
                        void logFirebaseEvent('pricing_billing_cycle', { cycle })
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        billingCycle === cycle
                          ? 'bg-primary text-primary-content border-2 border-primary'
                          : 'text-base-content/70 hover:text-base-content'
                      }`}
                    >
                      {cycle === 'monthly' ? 'Mensual' : 'Anual'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-base-content/70 font-medium">
                  Paga anual y ahorra 2 meses. Cambia de plan cuando quieras.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border-2 border-base-300 bg-base-100 p-4 no-shadow"
                  >
                    <p className="text-sm text-base-content/60 font-semibold uppercase tracking-wide">{stat.label}</p>
                    <p className="text-xl font-extrabold text-primary mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Planes - Flat Design */}
        <section className="section pt-0 bg-base-100">
          <div className="container-custom">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="badge badge-primary border-2 font-semibold mb-3">Planes</div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-base-content">
                  Elige el plan que mejor se ajusta a tu operación
                </h2>
                <p className="text-base text-base-content/70 mt-2 font-medium">
                  Todos incluyen transferencias locales y tarjetas virtuales sin costo.
                </p>
              </div>
              <a
                href="mailto:hola@facil.do"
                className="btn btn-ghost border-2 border-base-300"
              >
                Habla con nosotros
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const price = plan.price[billingCycle]
                return (
                  <div
                    key={plan.id}
                    className={`card h-full border-2 ${
                      plan.highlight ? 'border-primary' : 'border-base-300'
                    } bg-base-100 no-shadow`}
                  >
                    <div className="card-body">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-base-content">{plan.name}</p>
                          <p className="text-base text-base-content/60 font-medium">{plan.description}</p>
                        </div>
                        {plan.badge && (
                          <span
                            className={`badge border-2 font-semibold ${plan.highlight ? 'badge-primary' : 'badge-outline'}`}
                          >
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-baseline gap-2">
                        <p className="text-3xl font-extrabold text-primary">{price}</p>
                        {price !== 'Hablemos' && (
                          <span className="text-sm text-base-content/60 font-medium">
                            {billingCycle === 'monthly' ? '/mes' : '/mes facturado anual'}
                          </span>
                        )}
                      </div>
                      {plan.note && <p className="text-sm text-base-content/60 font-medium">{plan.note}</p>}

                      <div className="mt-4 space-y-3">
                        {plan.perks.map((perk) => (
                          <div key={perk} className="flex items-start gap-3 text-sm text-base-content/80 font-medium">
                            <div className="mt-0.5 h-6 w-6 rounded-lg bg-success flex items-center justify-center">
                              <CheckIcon className="w-4 h-4 text-white" />
                            </div>
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 mt-auto">
                        <a
                          href="mailto:hola@facil.do"
                          className={`btn w-full ${plan.highlight ? 'btn-primary' : 'btn-outline'} border-2`}
                          onClick={() =>
                            void logFirebaseEvent('pricing_cta', {
                              action: 'plan_cta',
                              plan_id: plan.id,
                              billing_cycle: billingCycle,
                            })
                          }
                        >
                          {plan.ctaLabel ?? 'Contáctanos'}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Cargos transparentes - Flat Design */}
        <section className="section pt-0 bg-base-200">
          <div className="container-custom">
            <div className="rounded-3xl border-2 border-base-300 bg-base-100 no-shadow p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="badge badge-primary border-2 font-semibold mb-3">Cargos transparentes</div>
                  <h3 className="text-2xl font-extrabold text-base-content">Lo que cobramos (y lo que no)</h3>
                  <p className="text-base text-base-content/70 mt-1 font-medium">
                    Sin sorpresas. Estos son los únicos cargos que podrías ver en tu cuenta.
                  </p>
                </div>
                <span className="badge badge-lg border-2 badge-outline font-semibold text-base-content">
                  Sin mantenimiento mensual
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {feeItems.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 p-4 rounded-2xl border-2 border-base-200">
                    <div>
                      <p className="font-bold text-base-content">{item.label}</p>
                      {item.helper && <p className="text-sm text-base-content/60 font-medium">{item.helper}</p>}
                    </div>
                    <p className="text-base font-extrabold text-primary whitespace-nowrap">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparativa - Flat Design */}
        <section className="section pt-0 bg-base-100">
          <div className="container-custom">
            <div className="mb-6">
              <div className="badge badge-primary border-2 font-semibold mb-3">Comparativa rápida</div>
              <h3 className="text-2xl font-extrabold text-base-content">Lo que incluye cada plan</h3>
            </div>

            <div className="overflow-hidden rounded-3xl border-2 border-base-300 bg-base-100 no-shadow">
              <div className="grid grid-cols-4 bg-base-200 text-sm font-bold text-base-content border-b-2 border-base-300">
                <div className="px-4 py-3">Beneficio</div>
                <div className="px-4 py-3 text-center">Esencial</div>
                <div className="px-4 py-3 text-center">Crecimiento</div>
                <div className="px-4 py-3 text-center">Empresarial</div>
              </div>
              <div>
                {comparisonRows.map((row, idx) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-4 px-4 md:px-6 py-4 text-sm border-b border-base-200 last:border-b-0 ${
                      idx % 2 === 0 ? 'bg-base-100' : 'bg-base-200/50'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-base-content">{row.label}</span>
                      {row.helper && <span className="text-xs text-base-content/60 font-medium">{row.helper}</span>}
                    </div>
                    {[row.essential, row.growth, row.enterprise].map((value, i) => (
                      <div key={i} className="flex items-center justify-center text-base-content">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <div className="h-6 w-6 rounded-lg bg-success flex items-center justify-center">
                              <CheckIcon className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-lg bg-base-300 flex items-center justify-center">
                              <MinusIcon className="w-3.5 h-3.5 text-base-content/50" />
                            </div>
                          )
                        ) : (
                          <span className="text-sm text-base-content font-semibold">{value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ + CTA - Flat Design */}
        <section className="section pt-0 bg-base-200">
          <div className="container-custom grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <div className="badge badge-primary border-2 font-semibold mb-3">Preguntas frecuentes</div>
              <h3 className="text-2xl font-extrabold text-base-content">Todo lo que necesitas saber</h3>
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
                    q: '¿Cómo empiezo?',
                    a: 'Contáctanos por correo o a través del formulario de contacto. Te ayudamos a preparar tu negocio para el onboarding y configurar todo lo que necesitas.',
                  },
                ].map((item) => (
                  <div key={item.q} className="collapse collapse-plus bg-base-100 border-2 border-base-300 no-shadow">
                    <input type="checkbox" />
                    <div className="collapse-title text-base font-bold text-base-content">{item.q}</div>
                    <div className="collapse-content text-sm text-base-content/70 font-medium">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border-2 border-primary bg-primary text-white no-shadow">
              <div className="absolute inset-0 opacity-10 grid-pattern-flat" />
              <div className="relative p-8 space-y-4">
                <div className="badge badge-outline border-2 border-white text-white font-semibold">Listo para empezar</div>
                <h3 className="text-3xl font-extrabold leading-tight">
                  Comienza con un equipo que te acompaña.
                </h3>
                <p className="text-base text-white/90 max-w-xl font-medium">
                  Te guiamos en el onboarding, configuramos tus tarjetas y reportes, y te ayudamos a migrar información si ya usas otro banco digital.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="mailto:hola@facil.do"
                    className="btn bg-white text-primary border-2 border-white hover:bg-white/90 font-bold"
                    onClick={() =>
                      void logFirebaseEvent('pricing_cta', {
                        action: 'cta_banner',
                        location: 'pricing_bottom',
                      })
                    }
                  >
                    Contáctanos
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="/#features"
                    className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-primary font-bold"
                    onClick={() =>
                      void logFirebaseEvent('pricing_cta', { action: 'cta_banner', location: 'pricing_bottom_features' })
                    }
                  >
                    Ver producto
                  </a>
                </div>
                <p className="text-sm text-white/80 font-medium">Sin costos ocultos. Puedes cancelar cuando quieras.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
