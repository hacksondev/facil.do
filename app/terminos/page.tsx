import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Facil.do',
  description: 'Términos y condiciones de uso de la plataforma Facil.do',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-5 h-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-base-content">Facil.do</span>
            </Link>
          </div>
          <div className="flex-none">
            <Link href="/" className="btn btn-ghost btn-sm gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-base-content mb-4">Términos y Condiciones</h1>
              <p className="text-base-content/70">Última actualización: Enero 2025</p>
            </div>

            {/* Important Notice */}
            <div className="alert alert-warning mb-8">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold">Aviso Importante</h3>
                <p className="text-sm">
                  Facil.do es una empresa de tecnología financiera y no es un banco ni una institución asegurada por la FDIC.
                  Los servicios financieros son proporcionados por instituciones bancarias asociadas, debidamente autorizadas y miembros de la FDIC, según corresponda.
                  El seguro de depósitos aplica únicamente en caso de quiebra de la institución financiera que mantiene los fondos.
                  Facil.do actúa como una plataforma tecnológica que facilita el acceso a servicios financieros a través de alianzas con entidades bancarias locales.
                </p>
              </div>
            </div>

            {/* Terms Content */}
            <div className="prose prose-lg max-w-none">
              {/* Section 1 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">1. Sobre Facil.do</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>
                      <strong>Facil.do</strong> es una plataforma tecnológica diseñada para simplificar la gestión financiera de las Micro, Pequeñas y Medianas Empresas (MIPYMES) en República Dominicana.
                    </p>
                    <div className="bg-base-100 p-4 rounded-xl border-l-4 border-primary">
                      <p className="font-semibold text-base-content mb-2">Declaración clara:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li><strong>NO somos un banco</strong> ni una institución de intermediación financiera.</li>
                        <li><strong>NO captamos depósitos</strong> del público de manera directa.</li>
                        <li><strong>NO otorgamos préstamos</strong> con recursos propios.</li>
                        <li>Somos una <strong>plataforma tecnológica</strong> que conecta a las MIPYMES con servicios financieros.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">2. Nuestras Alianzas Bancarias</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>
                      Los servicios financieros ofrecidos a través de Facil.do son proporcionados por instituciones bancarias locales debidamente reguladas y supervisadas por las autoridades competentes de República Dominicana.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-base-100 p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold">Bancos Regulados</h3>
                        </div>
                        <p className="text-sm">Nuestros socios bancarios están supervisados por la Superintendencia de Bancos de la República Dominicana.</p>
                      </div>
                      <div className="bg-base-100 p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold">Fondos Protegidos</h3>
                        </div>
                        <p className="text-sm">Tu dinero está depositado en cuentas de instituciones bancarias reguladas, no en Facil.do.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">3. Servicios de la Plataforma</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Facil.do proporciona las siguientes funcionalidades tecnológicas:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Interfaz de gestión:</strong> Una plataforma web y móvil para visualizar y administrar tus finanzas empresariales.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Reportes y análisis:</strong> Herramientas para generar reportes financieros y fiscales.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Facilitación de apertura:</strong> Proceso digital para solicitar productos financieros de nuestros socios bancarios.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Cumplimiento fiscal:</strong> Generación de formatos requeridos por la DGII.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">4. Responsabilidades del Usuario</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Al utilizar Facil.do, te comprometes a:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">1</span>
                        <span>Proporcionar información veraz y actualizada sobre tu empresa y tus datos personales.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">2</span>
                        <span>Mantener la confidencialidad de tus credenciales de acceso.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">3</span>
                        <span>Utilizar la plataforma únicamente para fines lícitos y relacionados con tu actividad empresarial.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">4</span>
                        <span>Cumplir con todas las leyes y regulaciones aplicables en República Dominicana.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">5. Protección de Datos</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>
                      Nos comprometemos a proteger tu información personal y empresarial de acuerdo con las leyes de protección de datos vigentes en República Dominicana.
                    </p>
                    <div className="bg-base-100 p-4 rounded-xl">
                      <h3 className="font-semibold mb-2">Tus datos están protegidos mediante:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Encriptación de extremo a extremo</li>
                        <li>Servidores seguros con certificación</li>
                        <li>Acceso restringido y monitoreado</li>
                        <li>Políticas estrictas de manejo de información</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">6. Limitación de Responsabilidad</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>
                      Facil.do actúa únicamente como intermediario tecnológico. Por lo tanto:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>No somos responsables de las decisiones de las instituciones bancarias respecto a la aprobación o rechazo de productos financieros.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Las condiciones, tasas y términos de los productos financieros son determinados por las instituciones bancarias aliadas.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>No garantizamos la disponibilidad ininterrumpida de la plataforma, aunque nos esforzamos por mantenerla operativa.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">7. Contacto</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Para cualquier consulta sobre estos términos y condiciones, puedes contactarnos:</p>
                    <div className="flex flex-col gap-3">
                      <a href="mailto:legal@facil.do" className="flex items-center gap-3 text-primary hover:underline">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        legal@facil.do
                      </a>
                      <a href="mailto:hola@facil.do" className="flex items-center gap-3 text-primary hover:underline">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        hola@facil.do
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Acceptance */}
              <section className="card bg-primary text-primary-content">
                <div className="card-body text-center">
                  <h2 className="text-2xl font-bold mb-2">Aceptación de Términos</h2>
                  <p className="mb-4">
                    Al registrarte en Facil.do y utilizar nuestros servicios, confirmas que has leído, entendido y aceptado estos términos y condiciones en su totalidad.
                  </p>
                  <Link href="/#waitlist" className="btn btn-secondary">
                    Separa tu cupo
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-neutral text-neutral-content mt-16">
        <div>
          <p>© {new Date().getFullYear()} Facil.do - Todos los derechos reservados</p>
          <p className="text-sm opacity-70 mt-1">Facil.do no es un banco. Servicios financieros provistos por instituciones bancarias aliadas.</p>
        </div>
      </footer>
    </div>
  )
}
