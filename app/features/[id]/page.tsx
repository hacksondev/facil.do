import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFeatureById, getAllFeatureIds } from '@/app/data/features'

const baseUrl = 'https://facil.do'

type FeaturePageProps = {
  params: {
    id: string
  }
}

export function generateStaticParams() {
  return getAllFeatureIds().map((id) => ({ id }))
}

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const feature = getFeatureById(params.id)

  if (!feature) {
    return {
      title: 'Característica no encontrada | Facil.do',
      description: 'La característica que buscas no existe en Facil.do.',
      alternates: {
        canonical: `/features/${params.id}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const canonicalPath = `/features/${feature.id}`
  const canonicalUrl = `${baseUrl}${canonicalPath}`
  const title = `${feature.title} | Facil.do`

  return {
    title,
    description: feature.heroDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description: feature.heroDescription,
      url: canonicalUrl,
      siteName: 'Facil.do',
      type: 'article',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `Facil.do - ${feature.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: feature.shortDescription,
      images: [`${baseUrl}/og-image.png`],
    },
  }
}

export default function FeatureDetailPage({ params }: FeaturePageProps) {
  const feature = getFeatureById(params.id)

  if (!feature) {
    notFound()
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: feature.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Características',
        item: `${baseUrl}/#features`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: feature.title,
        item: `${baseUrl}/features/${feature.id}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header - Flat Design */}
      <header className="navbar bg-base-100 border-b-2 border-base-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center border-2 border-primary">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-base-content">Facil.do</span>
            </Link>
          </div>
          <div className="flex-none">
            <Link href="/#features" className="btn btn-ghost btn-sm gap-2 border-2 border-transparent hover:border-base-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Flat Design */}
      <section className="section relative overflow-hidden bg-base-200">
        <div className="absolute inset-0 dot-pattern-flat opacity-30" />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="badge badge-primary border-2 font-semibold mb-4">{feature.badge}</div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-base-content mb-6 leading-tight">
              {feature.heroTitle}
            </h1>
            <p className="text-xl text-base-content/70 mb-8 font-medium">
              {feature.heroDescription}
            </p>
            <a href="mailto:hola@facil.do" className="btn btn-primary btn-lg border-2">
              Contáctanos
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section - Flat Design */}
      <section className="py-8 bg-base-100 border-y-2 border-base-200">
        <div className="container-custom">
          <div className="stats stats-vertical md:stats-horizontal border-2 border-base-300 no-shadow w-full">
            {feature.stats.map((stat, index) => (
              <div key={index} className="stat">
                <div className="stat-value text-primary font-extrabold">{stat.value}</div>
                <div className="stat-desc font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-base-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">Beneficios principales</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Todo lo que obtienes con {feature.title.toLowerCase()}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {feature.benefits.map((benefit, index) => (
              <div key={index} className="card bg-base-200/50 hover:bg-base-200 transition-colors">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-base-content/70">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-base-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">Preguntas frecuentes</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="join join-vertical w-full">
              {feature.faqs.map((faq, index) => (
                <div key={index} className="collapse collapse-arrow join-item border border-base-300 bg-base-100">
                  <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                  <div className="collapse-title text-lg font-medium">
                    {faq.question}
                  </div>
                  <div className="collapse-content">
                    <p className="text-base-content/70">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-primary text-primary-content">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para simplificar tu negocio?
          </h2>
          <p className="text-primary-content/80 mb-8 max-w-2xl mx-auto">
            Más de 500 negocios ya separaron su cupo.
            Sé de los primeros en acceder a Facil.do
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#waitlist" className="btn btn-secondary btn-lg">
              Separa tu cupo
            </Link>
            <Link href="/#features" className="btn btn-ghost btn-lg text-primary-content">
              Ver más características
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer footer-center p-6 bg-neutral text-neutral-content">
        <div>
          <p>© {new Date().getFullYear()} Facil.do - Todos los derechos reservados</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema]) }}
      />
    </div>
  )
}
