/**
 * Componente Features - DaisyUI + Facil.do Design
 *
 * Grid de características con cards interactivas.
 * Links a páginas de detalle por característica.
 */

import Link from 'next/link'
import { features } from '@/app/data/features'

export default function Features() {
  return (
    <section className="section bg-base-200/50 relative overflow-hidden" id="features">
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge badge-primary badge-outline mb-4">Características</div>
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Todo lo que necesitas para manejar tu negocio
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Herramientas diseñadas específicamente para las necesidades
            de las MIPYMES dominicanas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={`/features/${feature.id}`}
              className="card bg-base-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="card-body">
                {/* Icon + Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                    </svg>
                  </div>
                  <div className="badge badge-primary badge-sm">{feature.badge}</div>
                </div>

                {/* Content */}
                <h3 className="card-title text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-base-content/70">{feature.shortDescription}</p>

                {/* Link indicator */}
                <div className="card-actions justify-start mt-4 pt-4 border-t border-base-200">
                  <span className="text-primary text-sm font-medium inline-flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
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

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-base-content/60 mb-2">¿Quieres saber más?</p>
          <a href="#waitlist" className="link link-primary font-medium inline-flex items-center gap-2">
            Separa tu cupo y te mantendremos informado
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
