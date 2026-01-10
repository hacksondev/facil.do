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

  return (
    <div className="min-h-screen bg-base-200">
      <Header navLinks={navLinks} />

      <main className="pt-24">
        {/* Hero - Flat Design */}
        <section className="section relative overflow-hidden bg-base-200">
          <div className="absolute inset-0 dot-pattern-flat opacity-30" />

          <div className="container-custom relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border-2 border-primary mb-6">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-primary">Nuestro porqué</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-base-content leading-tight">
                Estamos construyendo la cuenta que las MIPYMES merecen.
              </h1>
              <p className="mt-4 text-lg text-base-content/70 max-w-2xl font-medium">
                Creemos que una cuenta empresarial debe ser tan fácil como un chat y tan robusta como un banco. Sin filas,
                sin tantos papeleos y con herramientas que sí resuelven el día a día.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {milestones.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border-2 border-base-300 bg-base-100 p-4 no-shadow"
                  >
                    <p className="text-sm text-base-content/60 font-semibold uppercase tracking-wide">{item.label}</p>
                    <p className="text-3xl font-extrabold text-primary mt-1">{item.value}</p>
                    <p className="text-sm text-base-content/60 font-medium">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Misión y cómo trabajamos - Flat Design */}
        <section className="section pt-0 bg-base-100">
          <div className="container-custom grid gap-10 ">
            <div className="card bg-base-100 border-2 border-base-300 no-shadow">
              <div className="card-body space-y-4">
                <div className="badge badge-primary border-2 font-semibold">Misión</div>
                <h2 className="text-3xl font-extrabold text-base-content">Finanzas simples para negocios que no pueden parar</h2>
                <p className="text-base text-base-content/70 font-medium">
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
                    <div key={item.title} className="p-4 rounded-xl bg-base-200 border-2 border-base-300">
                      <p className="font-bold text-base-content">{item.title}</p>
                      <p className="text-sm text-base-content/70 font-medium mt-1">{item.text}</p>
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

        {/* Valores - Flat Design */}
        <section className="section pt-0 bg-base-200">
          <div className="container-custom">
            <div className="mb-8">
              <div className="badge badge-primary border-2 font-semibold mb-3">Valores</div>
              <h3 className="text-3xl font-extrabold text-base-content">Lo que guía cada decisión</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="p-6 rounded-2xl border-2 border-base-300 bg-base-100 no-shadow">
                  <h4 className="text-xl font-bold text-base-content">{value.title}</h4>
                  <p className="text-base text-base-content/70 mt-2 font-medium">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipo - Flat Design */}
        <section className="section pt-0 bg-base-100">
          <div className="container-custom">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="badge badge-primary border-2 font-semibold mb-3">Equipo</div>
                <h3 className="text-3xl font-extrabold text-base-content">Quienes lo hacemos posible</h3>
                <p className="text-base text-base-content/70 mt-2 font-medium">
                  Un equipo de producto, ingeniería y operaciones obsesionado con la experiencia.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {team.map((member) => (
                <div key={member.name} className="card bg-base-100 border-2 border-base-300 no-shadow">
                  <div className="card-body space-y-2">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg border-2 border-primary">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <p className="text-xl font-bold text-base-content">{member.name}</p>
                    <p className="text-sm text-base-content/70 font-semibold">{member.role}</p>
                    <p className="text-sm text-base-content/80 font-medium">{member.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final - Flat Design */}
        <section className="section pt-0 bg-base-200">
          <div className="container-custom">
            <div className="relative overflow-hidden rounded-3xl border-2 border-primary bg-primary text-white">
              <div className="absolute inset-0 opacity-10 grid-pattern-flat" />
              <div className="relative p-8 md:p-12 space-y-4">
                <div className="badge badge-outline border-2 border-white text-white font-semibold">Hablemos</div>
                <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">¿Listo para simplificar tus finanzas?</h3>
                <p className="text-base text-white/90 max-w-2xl font-medium">
                  Conoce nuestros planes y descubre cómo podemos ayudarte. Sin costo de mantenimiento, sin letras pequeñas.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="/pricing"
                    className="btn bg-white text-primary border-2 border-white hover:bg-white/90 font-bold"
                    onClick={() =>
                      void logFirebaseEvent('about_cta', { location: 'cta_bottom', destination: 'pricing' })
                    }
                  >
                    Ver planes
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="/#features"
                    className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-primary font-bold"
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
