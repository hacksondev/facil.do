/**
 * Componente ValueProposition - Flat Design
 *
 * Sección comparativa problema vs solución.
 */

import { useState } from "react"

export default function ValueProposition() {
  const [mostrarTodo, setMostrarTodo] = useState(false)
  const features = [
    'Todo desde tu celular o Web, sin salir de tu negocio',
    'Inteligencia artificial para optimizar tus finanzas',
    'Tarifas claras y 100% transparentes',
    'Reportes diseñados para MIPYMES',
    'Apertura de cuentas bancarias empresariales 100% digital',
    'Dashboard con vista clara de tu dinero',
    'Atención al cliente dedicada a MIPYMES',
    'Integraciones con las herramientas que ya usas',
    'Seguridad de nivel bancario',
    'Actualizaciones y mejoras constantes',
    'Cumplimiento con regulaciones locales',
    'Soporte en español y adaptado al mercado dominicano',
    'Educación financiera para dueños de MIPYMES',
    'Funcionalidades diseñadas para crecer contigo',
    'Acceso anticipado a nuevas herramientas y servicios',
  ]

  const visibles = mostrarTodo ? features : features.slice(0, 5)

  return (
    <section className="section bg-base-100 relative">
      <div className="divider absolute top-0 left-0 right-0 m-0"></div>

      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4 font-bold text-5xl">Por qué elegirnos</div>
          <h2 className="text-3xl md:text-3xl font-semibold text-base-content mb-4">
            Tu negocio merece una plataforma que realmente lo entienda.
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Sabemos los retos que enfrentan las MIPYMES dominicanas cada día.
            Por eso creamos una solución pensada específicamente para ti.
          </p>
        </div>

        {/* Comparison Cards - Flat Design */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 mb-16">
          {/* Problem Card */}
          <div className="card bg-base-100 no-shadow">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-error flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-error uppercase tracking-wide">El problema</p>
                  <h3 className="text-lg font-bold">Banca tradicional</h3>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  'Horas perdidas en filas bancarias',
                  'Comisiones y cargos difíciles de entender',
                  'Reportes que no sirven para tu negocio',
                  'Procesos de apertura complicados',
                  'Falta de visibilidad de tus finanzas',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-base-content/70 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 no-shadow">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-success flex items-center justify-center border-2 border-success">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-success uppercase tracking-wide">La solución</p>
                  <h3 className="text-lg font-bold">Nuestra plataforma</h3>
                </div>
              </div>

              <ul className="space-y-3">
                {visibles.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-base-content font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              {features.length > 5 && (
                <button
                  className="btn btn-link px-0 mt-2"
                  onClick={() => setMostrarTodo((v: any) => !v)}
                >
                  {mostrarTodo ? 'Ver menos' : 'Ver más'}
                </button>
              )}
              {/* <ul className="space-y-3">
                {[
                  'Todo desde tu celular o Web, sin salir de tu negocio',
                  'Inteligencia artificial para optimizar tus finanzas',
                  'Tarifas claras y 100% transparentes',
                  'Reportes diseñados para MIPYMES',
                  'Apertura de cuentas bancarias empresariales 100% digital',
                  'Dashboard con vista clara de tu dinero',
                  'Atención al cliente dedicada a MIPYMES',
                  'Integraciones con las herramientas que ya usas',
                  'Seguridad de nivel bancario',
                  'Actualizaciones y mejoras constantes',
                  'Cumplimiento con regulaciones locales',
                  'Soporte en español y adaptado al mercado dominicano',
                  'Educación financiera para dueños de MIPYMES',
                  'Funcionalidades diseñadas para crecer contigo',
                  'Acceso anticipado a nuevas herramientas y servicios',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-base-content font-medium">{item}</span>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>

        {/* Stats - Flat Design */}
        <div className="flex justify-center">
          <div className="stats bg-base-200 border-1 border-base-300 no-shadow">
            <div className="stat">
              <div className="stat-value text-primary font-extrabold">85%</div>
              <div className="stat-title font-semibold">de las MIPYMES</div>
              <div className="stat-desc font-medium">pierden tiempo en trámites bancarios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
