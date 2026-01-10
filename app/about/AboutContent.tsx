'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { logFirebaseEvent } from '../services/firebaseClient'

const values = [
  {
    title: 'Claridad radical',
    description: 'Hablamos claro sobre precios, tiempos y procesos. Sin letras pequeñas ni sorpresas.',
  },
  {
    title: 'Diseño centrado en negocios reales',
    description: 'Creamos para el día a día de las MIPYMES: rápido, móvil y sin burocracia.',
  },
  {
    title: 'Seguridad bancaria',
    description: 'Infraestructura y controles de nivel bancario, con trazabilidad completa de cada movimiento.',
  },
  {
    title: 'Acompañamiento humano',
    description: 'Soporte en minutos y un equipo que te ayuda a configurar límites, reportes y permisos.',
  },
]

const milestones = [
  { label: 'Fundación', value: '2026', detail: 'Arrancamos con el primer prototipo y pruebas con comercios.' },
  { label: 'Validación', value: '500+', detail: 'Negocios en lista de espera en menos de 90 días.' },
  { label: 'Operación', value: '24/7', detail: 'Plataforma diseñada para operar en cualquier dispositivo.' },
]

const team = [
  {
    name: 'Jackson Cuevas',
    role: 'CEO & Founder',
    focus: 'Producto y experiencia de usuario',
  },
  {
    name: 'Starling Javier Diaz',
    role: 'CTO & Co-founder',
    focus: 'Infraestructura, seguridad y datos',
  }
  // {
  //   name: 'Barbara De Peña',
  //   role: 'Head of Operations',
  //   focus: 'Onboarding y soporte a negocios',
  // },
]

export default function AboutContent() {
  const navLinks = [
    { href: '/#features', label: 'Características', type: 'route' as const },
    { href: '/about', label: 'Nosotros', type: 'route' as const },
  ]

  const handleCta = () => {
    void logFirebaseEvent('about_cta', { location: 'header', destination: 'waitlist' })
    window.location.href = '/#waitlist'
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header onCtaClick={handleCta} navLinks={navLinks} />

      <main className="pt-24">
        {/* Hero */}
        <section className="section relative overflow-hidden">
    
          <div className="container-custom relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-base-100/80 px-4 py-2 border border-base-300  backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                <span className="text-sm font-medium text-base-content/70">Nuestro porqué</span>
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold text-base-content leading-tight">
                Estamos construyendo la cuenta que las MIPYMES merecen.
              </h1>
              <p className="mt-4 text-lg text-base-content/70 max-w-2xl">
                Creemos que una cuenta empresarial debe ser tan fácil como un chat y tan robusta como un banco. Sin filas,
                sin tantos papeleos y con herramientas que sí resuelven el día a día.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {milestones.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-base-300 bg-base-100/80 p-4 backdrop-blur"
                  >
                    <p className="text-sm text-base-content/60">{item.label}</p>
                    <p className="text-2xl font-bold text-base-content mt-1">{item.value}</p>
                    <p className="text-sm text-base-content/60">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Misión y cómo trabajamos */}
        <section className="section pt-0">
          <div className="container-custom grid gap-10 ">
            <div className="card bg-base-100  border border-base-300">
              <div className="card-body space-y-4">
                <div className="badge badge-outline badge-lg text-base-content/70">Misión</div>
                <h2 className="text-2xl font-bold text-base-content">Finanzas simples para negocios que no pueden parar</h2>
                <p className="text-base text-base-content/70">
                  Nuestro objetivo es quitarle fricción a cada operación financiera de una MIPYME. Desde abrir la cuenta,
                  hasta pagar proveedores, controlar gastos del equipo o preparar reportes fiscales.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { title: 'Apertura 100% digital', text: 'Sin sucursales ni citas. Documentos desde tu app o web.' },
                    { title: 'Control en tiempo real', text: 'Alertas, límites y conciliación automática.' },
                    { title: 'Listo para el contador', text: 'Reportes claros y exportables cuando los necesitas.' },
                    { title: 'Soporte en minutos', text: 'Chat, correo y acompañamiento personalizado.' },
                  ].map((item) => (
                    <div key={item.title} className="p-3 rounded-xl bg-base-200/60 border border-base-200">
                      <p className="font-semibold text-base-content">{item.title}</p>
                      <p className="text-sm text-base-content/70">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* <div className="card bg-base-100 border border-base-300">
              <div className="card-body space-y-4">
                <div className="badge badge-outline badge-lg text-base-content/70">Cómo trabajamos</div>
                <h3 className="text-xl font-bold text-base-content">Pruebas rápidas, feedback real</h3>
                <p className="text-base text-base-content/70">
                  Iteramos con negocios que ya están en la lista de espera para validar cada flujo. Lanzamos mejoras cada semana
                  y medimos todo para que las decisiones sean datos, no suposiciones.
                </p>
                <ul className="space-y-3 text-sm text-base-content/80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>Workshops quincenales con clientes beta para priorizar features.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>Pruebas de usabilidad en móvil y desktop para cada release.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>Monitoreo en tiempo real de onboarding y transferencias para detectar fricción.</span>
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
        </section>

        {/* Valores */}
        <section className="section pt-0">
          <div className="container-custom">
            <div className="mb-6">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">Valores</p>
              <h3 className="text-2xl font-bold text-base-content mt-2">Lo que guía cada decisión</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="p-6 rounded-2xl border border-base-300 bg-base-100">
                  <h4 className="text-lg font-semibold text-base-content">{value.title}</h4>
                  <p className="text-base text-base-content/70 mt-2">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="section pt-0">
          <div className="container-custom">
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">Equipo</p>
                <h3 className="text-2xl font-bold text-base-content mt-2">Quienes lo hacemos posible</h3>
                <p className="text-base text-base-content/70 mt-1">
                  Un equipo de producto, ingeniería y operaciones obsesionado con la experiencia.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {team.map((member) => (
                <div key={member.name} className="card bg-base-100 border border-base-300">
                  <div className="card-body space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <p className="text-lg font-semibold text-base-content">{member.name}</p>
                    <p className="text-sm text-base-content/70">{member.role}</p>
                    <p className="text-sm text-base-content/80">{member.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="section pt-0">
          <div className="container-custom">
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary to-secondary text-primary-content">
              <div className="absolute inset-0 opacity-20 grid-pattern" />
              <div className="relative p-8 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wide">Hablemos</p>
                <h3 className="text-3xl font-bold leading-tight">¿Listo para simplificar tus finanzas?</h3>
                <p className="text-base text-primary-content/80 max-w-2xl">
                  Súmate a la lista de espera y te acompañamos en el onboarding. Sin costo de mantenimiento, sin letras pequeñas.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/#waitlist"
                    className="btn btn-primary"
                    onClick={() =>
                      void logFirebaseEvent('about_cta', { location: 'cta_bottom', destination: 'waitlist' })
                    }
                  >
                    Separa tu cupo
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="/#features"
                    className="btn btn-outline border-primary/50 text-primary-content"
                    onClick={() =>
                      void logFirebaseEvent('about_cta', { location: 'cta_bottom', destination: 'features' })
                    }
                  >
                    Ver producto
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
