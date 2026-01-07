import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad - Facil.do',
  description: 'Política de privacidad y protección de datos de Facil.do',
}

export default function PrivacidadPage() {
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
              <h1 className="text-4xl font-bold text-base-content mb-4">Política de Privacidad</h1>
              <p className="text-base-content/70">Última actualización: Enero 2026</p>
            </div>

            {/* Intro */}
            <div className="alert alert-info mb-8">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Tu privacidad es nuestra prioridad</h3>
                <p className="text-sm">En Facil.do nos comprometemos a proteger tu información personal y empresarial con los más altos estándares de seguridad.</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {/* Section 1 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">1. Información que Recopilamos</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Para brindarte nuestros servicios, recopilamos los siguientes tipos de información:</p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-base-100 p-4 rounded-xl">
                        <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Datos Personales
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Nombre completo</li>
                          <li>Número de cédula</li>
                          <li>Correo electrónico</li>
                          <li>Número de teléfono</li>
                          <li>Dirección</li>
                        </ul>
                      </div>

                      <div className="bg-base-100 p-4 rounded-xl">
                        <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Datos Empresariales
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Nombre de la empresa</li>
                          <li>RNC</li>
                          <li>Tipo de negocio</li>
                          <li>Dirección comercial</li>
                          <li>Información financiera</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-base-100 p-4 rounded-xl">
                      <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Datos Técnicos
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Dirección IP</li>
                        <li>Tipo de navegador y dispositivo</li>
                        <li>Páginas visitadas y tiempo de uso</li>
                        <li>Cookies y tecnologías similares</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">2. Cómo Usamos tu Información</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Utilizamos la información recopilada para:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Prestación de servicios:</strong> Facilitar tu acceso a productos financieros de nuestras instituciones bancarias aliadas.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Verificación de identidad:</strong> Cumplir con las regulaciones de Conozca a su Cliente (KYC) y prevención de lavado de activos.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Comunicación:</strong> Enviarte actualizaciones, alertas de seguridad y notificaciones sobre tu cuenta.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Mejora del servicio:</strong> Analizar el uso de la plataforma para mejorar la experiencia del usuario.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Cumplimiento legal:</strong> Atender requerimientos de autoridades competentes cuando sea legalmente obligatorio.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">3. Compartición de Información</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Tu información puede ser compartida con:</p>

                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Destinatario</th>
                            <th>Propósito</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="font-medium">Bancos aliados</td>
                            <td>Evaluación y apertura de productos financieros</td>
                          </tr>
                          <tr>
                            <td className="font-medium">Proveedores de servicios</td>
                            <td>Servicios de infraestructura tecnológica y seguridad</td>
                          </tr>
                          <tr>
                            <td className="font-medium">Autoridades regulatorias</td>
                            <td>Cumplimiento de obligaciones legales (DGII, SIB, UAF)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="alert">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span><strong>Nunca vendemos</strong> tu información personal a terceros con fines comerciales o publicitarios.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">4. Seguridad de la Información</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Implementamos medidas de seguridad robustas para proteger tu información:</p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-base-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold">Encriptación</h3>
                          <p className="text-sm">Toda la información se transmite con encriptación SSL/TLS de 256 bits.</p>
                        </div>
                      </div>

                      <div className="bg-base-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold">Autenticación</h3>
                          <p className="text-sm">Autenticación multifactor para acceso a la plataforma.</p>
                        </div>
                      </div>

                      <div className="bg-base-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold">Servidores Seguros</h3>
                          <p className="text-sm">Infraestructura en la nube con certificaciones de seguridad.</p>
                        </div>
                      </div>

                      <div className="bg-base-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold">Monitoreo 24/7</h3>
                          <p className="text-sm">Vigilancia continua para detectar actividades sospechosas.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">5. Tus Derechos</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Como usuario de Facil.do, tienes derecho a:</p>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 bg-base-100 p-3 rounded-xl">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">A</span>
                        <span><strong>Acceder</strong> a la información personal que tenemos sobre ti.</span>
                      </div>
                      <div className="flex items-center gap-3 bg-base-100 p-3 rounded-xl">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">R</span>
                        <span><strong>Rectificar</strong> datos incorrectos o desactualizados.</span>
                      </div>
                      <div className="flex items-center gap-3 bg-base-100 p-3 rounded-xl">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">C</span>
                        <span><strong>Cancelar</strong> el tratamiento de tus datos cuando sea procedente.</span>
                      </div>
                      <div className="flex items-center gap-3 bg-base-100 p-3 rounded-xl">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">O</span>
                        <span><strong>Oponerte</strong> a ciertos usos de tu información.</span>
                      </div>
                    </div>
                    <p className="text-sm">Para ejercer estos derechos, contáctanos a <a href="mailto:privacidad@facil.do" className="text-primary hover:underline">privacidad@facil.do</a></p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">6. Cookies</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Utilizamos cookies y tecnologías similares para:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Mantener tu sesión activa mientras usas la plataforma</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Recordar tus preferencias de usuario</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Analizar el rendimiento y uso de la plataforma</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Mejorar la seguridad de tu cuenta</span>
                      </li>
                    </ul>
                    <p className="text-sm">Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad de la plataforma.</p>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">7. Retención de Datos</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Conservamos tu información personal durante el tiempo necesario para:</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Prestarte nuestros servicios mientras seas usuario activo</li>
                      <li>Cumplir con obligaciones legales y regulatorias</li>
                      <li>Resolver disputas y hacer cumplir nuestros acuerdos</li>
                    </ul>
                    <div className="bg-base-100 p-4 rounded-xl">
                      <p className="text-sm">Según las regulaciones dominicanas, ciertos registros financieros deben conservarse por un mínimo de <strong>10 años</strong>.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">8. Cambios a esta Política</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>
                      Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos a través de:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Correo electrónico a la dirección registrada</li>
                      <li>Notificación en la plataforma</li>
                      <li>Actualización de la fecha de "última modificación"</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 9 */}
              <section className="card bg-base-200/50 mb-6">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">9. Contacto</h2>
                  <div className="space-y-4 text-base-content/80">
                    <p>Para consultas sobre privacidad y protección de datos:</p>
                    <div className="flex flex-col gap-3">
                      <a href="mailto:privacidad@facil.do" className="flex items-center gap-3 text-primary hover:underline">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        privacidad@facil.do
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

              {/* Important Reminder */}
              <section className="card bg-warning/10 border border-warning mb-6">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <svg className="w-8 h-8 text-warning flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h2 className="text-xl font-bold text-base-content mb-2">Recordatorio Importante</h2>
                      <p className="text-base-content/80">
                        <strong>Facil.do no es un banco.</strong> Somos una plataforma tecnológica que trabaja en alianza con instituciones bancarias locales debidamente reguladas. Los servicios financieros son provistos por nuestros socios bancarios, quienes tienen sus propias políticas de privacidad que aplican a los productos que ofrecen.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <section className="card bg-primary text-primary-content">
                <div className="card-body text-center">
                  <h2 className="text-2xl font-bold mb-2">¿Tienes preguntas?</h2>
                  <p className="mb-4">
                    Estamos aquí para ayudarte. Contáctanos si tienes dudas sobre cómo manejamos tu información.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="mailto:privacidad@facil.do" className="btn btn-secondary">
                      Contactar sobre privacidad
                    </a>
                    <Link href="/" className="btn btn-ghost text-primary-content">
                      Volver al inicio
                    </Link>
                  </div>
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
