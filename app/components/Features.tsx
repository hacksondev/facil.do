import Link from 'next/link'
import { features } from '@/app/data/features'

export default function Features() {
  return (
    <section className="section bg-base-200 relative overflow-hidden" id="features">
      <div className="absolute inset-0 dot-pattern-flat opacity-30" />

      <div className="container-custom relative">

        <div className="text-center mb-16">
          <div className="mb-4 font-bold text-5xl">Características</div>
          <h2 className="text-3xl md:text-3xl font-semibold text-base-content mb-4">
            Todo lo que necesitas para manejar tu negocio
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Herramientas diseñadas específicamente para las necesidades
            de las MIPYMES dominicanas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={`/features/${feature.id}`}
              className="card bg-base-100 border-2 border-base-300 hover:border-slate-300 transition-all duration-200 group cursor-pointer no-shadow"
            >
              <div className="card-body">

                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center border-2 border-primary">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <div className="badge badge-primary font-semibold p-3">{feature.badge}</div>
                </div>

                <h3 className="card-title text-xl font-bold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-base-content/70 font-medium">{feature.shortDescription}</p>

                <div className="card-actions justify-start mt-4 pt-4 border-t-2 border-base-200">
                  <span className="text-primary text-sm font-semibold inline-flex items-center gap-2">
                    Conocer más
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
