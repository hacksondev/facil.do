'use client'

export default function Hero() {
  return (
    <section className="hero min-h-screen relative overflow-hidden pt-20 bg-base-100">
      <div className="absolute inset-0 grid-pattern-flat opacity-40" />

      <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary/5 rounded-3xl rotate-12" />
      <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-secondary/5 rounded-3xl -rotate-6" />
      <div className="absolute top-1/2 right-[20%] w-48 h-48 bg-accent/5 rounded-full" />

      <div className="hero-content text-center lg:text-left relative z-10">
        <div className="max-w-4xl">
      
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border-2 border-success mb-6 animate-fade-in-down">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm font-semibold text-success">
              500+ negocios confían en Facil.do
            </span>
          </div> */}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-base-content leading-tight mb-6 animate-fade-in-up animate-fill-both animate-delay-100">
            La banca empresarial digital diseñada para{' '}
            <span className="text-primary font-extrabold">MIPYMES dominicanas</span>
          </h1>

          <p className="text-lg md:text-xl text-base-content/70 mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animate-fill-both animate-delay-200">
            Controla tus ingresos, gastos y tu negocio desde un solo lugar.
            Sin filas. Sin complicaciones. Todo digital.
          </p>

          <div className="animate-fade-in-up animate-fill-both animate-delay-400">
            {/* <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
              <div className="avatar-group -space-x-3">
                {['JM', 'AP', 'LC', 'RD'].map((initials, i) => (
                  <div key={i} className="avatar placeholder">
                    <div className="bg-primary text-white w-8 rounded-full border-2 border-base-100">
                      <span className="text-xs font-semibold">{initials}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-base-content/70">
                <span className="font-bold text-base-content">500+</span> negocios confían en nosotros
              </p>
            </div> */}

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', title: '100% Seguro', subtitle: 'Encriptación bancaria' },
                { icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', title: 'Apertura rápida', subtitle: 'En 48 horas, no días' },
                { icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', title: 'Sin cargos ocultos', subtitle: 'Transparencia total' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center border-2 border-primary">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-base-content">{stat.title}</p>
                    <p className="text-xs text-base-content/60">{stat.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-base-content/40 animate-fade-in animate-delay-500">
        <span className="text-xs font-semibold">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-base-content/20 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-base-content/30 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
