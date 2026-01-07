/**
 * Componente ValueProposition - DaisyUI + Mercury Design
 *
 * Sección comparativa problema vs solución.
 */

export default function ValueProposition() {
  return (
    <section className="section bg-base-100 relative">
      <div className="divider absolute top-0 left-0 right-0 m-0"></div>

      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge badge-primary badge-outline mb-4">Por qué elegirnos</div>
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Tu negocio merece un banco que lo entienda
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Sabemos los retos que enfrentan las MIPYMES dominicanas cada día.
            Por eso creamos una solución pensada específicamente para ti.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 mb-16">
          {/* Problem Card */}
          <div className="card bg-base-200/50 border border-base-300">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-error uppercase tracking-wide">El problema</p>
                  <h3 className="text-lg font-semibold">Banca tradicional</h3>
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
                    <div className="w-5 h-5 rounded-full bg-error/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-base-content/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution Card */}
          <div className="card bg-base-100 border border-primary/20">
            <div className="card-body relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-success uppercase tracking-wide">La solución</p>
                    <h3 className="text-lg font-semibold">Nuestra plataforma</h3>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    'Todo desde tu celular o Web, sin salir de tu negocio',
                    'Tarifas claras y 100% transparentes',
                    'Reportes diseñados para MIPYMES',
                    'Apertura 100% digital en minutos',
                    'Dashboard con vista clara de tu dinero',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-base-content">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center">
          <div className="stats shadow-lg bg-base-100">
            <div className="stat">
              <div className="stat-value text-primary">85%</div>
              <div className="stat-title">de las MIPYMES</div>
              <div className="stat-desc">pierden tiempo en trámites bancarios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
