'use client'

/**
 * Componente Hero - DaisyUI + Facil Design
 *
 * Sección principal con gradientes y animaciones.
 */

interface HeroProps {
  onCtaClick: () => void
}

export default function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="hero min-h-screen relative overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float animate-delay-300" />

      {/* Content */}
      <div className="hero-content text-center lg:text-left relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="mb-8 animate-fade-in animate-fill-both flex justify-center lg:justify-start">
            <div className="badge badge-lg badge-outline gap-2 px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
              </span>
              Próximamente disponible
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content leading-tight mb-6 animate-fade-in-up animate-fill-both animate-delay-100">
            La cuenta empresarial digital diseñada para{' '}
            <span className="text-gradient">MIPYMES dominicanas</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-base-content/70 mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animate-fill-both animate-delay-200">
            Controla tus ingresos, gastos y tu negocio desde un solo lugar.
            Sin filas. Sin complicaciones. Todo digital.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-fade-in-up animate-fill-both animate-delay-300">
            <button onClick={onCtaClick} className="btn btn-primary btn-lg">
              Separa tu cupo
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <a href="#features" className="btn btn-ghost btn-lg">
              Conoce más
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up animate-fill-both animate-delay-400">
            {/* Avatar group */}
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
              <div className="avatar-group -space-x-3">
                {['JM', 'AP', 'LC', 'RD'].map((initials, i) => (
                  <div key={i} className="avatar placeholder">
                    <div className="bg-base-300 text-base-content/70 w-8 rounded-full">
                      <span className="text-xs">{initials}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-base-content/70">
                <span className="font-semibold text-base-content">500+</span> negocios ya separaron su cupo
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', title: '100% Seguro', subtitle: 'Encriptación bancaria' },
                { icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', title: 'Apertura rápida', subtitle: 'En minutos, no días' },
                { icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', title: 'Sin cargos ocultos', subtitle: 'Transparencia total' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-base-content">{stat.title}</p>
                    <p className="text-xs text-base-content/50">{stat.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-base-content/40 animate-fade-in animate-delay-500">
        <span className="text-xs font-medium">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-base-content/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-base-content/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
