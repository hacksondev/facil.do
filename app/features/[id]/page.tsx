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
            <Link href="/#features" className="btn btn-ghost btn-sm gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </Link>
          </div>
        </div>
      </header>

      <section className="section relative overflow-hidden bg-gradient-to-b from-base-200/50 to-base-100">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-10 right-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-3xl">
            <div className="badge badge-primary badge-outline mb-4">{feature.badge}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
              {feature.heroTitle}
            </h1>
            <p className="text-xl text-base-content/70 mb-8">
              {feature.heroDescription}
            </p>
            <Link href="/#waitlist" className="btn btn-primary btn-lg">
              Separa tu cupo
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-base-100 border-y border-base-200">
        <div className="container-custom">
          <div className="stats stats-vertical md:stats-horizontal shadow-lg w-full">
            {feature.stats.map((stat, index) => (
              <div key={index} className="stat">
                <div className="stat-value text-primary">{stat.value}</div>
                <div className="stat-desc">{stat.label}</div>
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

      {/* <section className="section bg-base-200/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">Cómo funciona</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Empezar es muy sencillo
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <ul className="timeline timeline-vertical">
              {feature.howItWorks.map((step, index) => (
                <li key={index}>
                  {index > 0 && <hr className="bg-primary" />}
                  <div className="timeline-start timeline-box bg-base-100 shadow-md">
                    <div className="font-semibold text-primary mb-1">Paso {step.step}</div>
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-base-content/70 mt-1">{step.description}</div>
                  </div>
                  <div className="timeline-middle">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                      {step.step}
                    </div>
                  </div>
                  {index < feature.howItWorks.length - 1 && <hr className="bg-primary" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section> */}

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
