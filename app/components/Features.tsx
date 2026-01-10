/**
 * Componente Features - Flat Design
 *
 * Grid de características con cards flat design.
 * Links a páginas de detalle por característica.
 */

import Link from 'next/link'
import { features } from '@/app/data/features'

export default function Features() {
  return (
    <section className="section bg-base-200 relative overflow-hidden" id="features">
      <div className="absolute inset-0 dot-pattern-flat opacity-30" />

      <div className="container-custom relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge badge-primary border-2 mb-4 font-semibold">Características</div>
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Todo lo que necesitas para manejar tu negocio
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Herramientas diseñadas específicamente para las necesidades
            de las MIPYMES dominicanas.
          </p>
        </div>

        {/* Features Grid - Flat Design */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={`/features/${feature.id}`}
              className="card bg-base-100 border-2 border-base-300 hover:border-primary transition-all duration-200 group cursor-pointer no-shadow"
            >
              <div className="card-body">
                {/* Icon + Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center border-2 border-primary">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <div className="badge badge-primary border-2 font-semibold">{feature.badge}</div>
                </div>

                {/* Content */}
                <h3 className="card-title text-xl font-bold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-base-content/70 font-medium">{feature.shortDescription}</p>

                {/* Link indicator */}
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

        {/* CTA */}
        {/* <div className="text-center mt-16">
          <p className="text-base-content/60 mb-2">¿Quieres saber más?</p>
          <a href="#waitlist" className="link link-primary font-medium inline-flex items-center gap-2">
            Separa tu cupo y te mantendremos informado
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div> */}
      </div>
    </section>
  )
}
