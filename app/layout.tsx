import type { Metadata, Viewport } from 'next'
import { StoreProvider } from './store/StoreProvider'
import './globals.css'

/**
 * Metadata para SEO y Open Graph
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://facil.do'),
  alternates: {
    canonical: '/',
  },
  title: 'Facil.do - La cuenta empresarial digital para MIPYMES dominicanas',
  description:
    'Controla tus ingresos, gastos y tu negocio desde un solo lugar. Apertura 100% digital, reportes claros y preparación fiscal.',
  keywords: [
    'cuenta empresarial',
    'MIPYMES',
    'República Dominicana',
    'fintech',
    'banca digital',
    'pymes',
    'cuenta de negocios',
    'facil.do',
  ],
  authors: [{ name: 'Facil.do' }],
  creator: 'Facil.do',
  publisher: 'Facil.do',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: 'https://facil.do',
    siteName: 'Facil.do',
    title: 'Facil.do - La cuenta empresarial digital para MIPYMES dominicanas',
    description:
      'Controla tus ingresos, gastos y tu negocio desde un solo lugar. Apertura 100% digital.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Facil.do - Banca digital para MIPYMES',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facil.do - Cuenta empresarial digital para MIPYMES',
    description: 'Controla tus ingresos, gastos y tu negocio desde un solo lugar.',
    images: ['/og-image.png'],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Facil.do',
  url: 'https://facil.do',
  logo: 'https://facil.do/og-image.png',
  description:
    'Cuenta empresarial digital para MIPYMES dominicanas. Apertura online, control de ingresos y gastos, reportes y preparación fiscal.',
}

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Facil.do',
  url: 'https://facil.do',
  inLanguage: 'es-DO',
  potentialAction: [
    {
      '@type': 'ContactPage',
      name: 'Regístrate en la lista de espera',
      url: 'https://facil.do/#waitlist',
    },
  ],
}

/**
 * Viewport configuration para mobile-first
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f5f4f0',
}

/**
 * Layout principal de la aplicación
 *
 * Incluye:
 * - StoreProvider de Redux
 * - Estilos globales
 * - Metadata SEO
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" data-theme="facil" className="scroll-smooth">
      <head>
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, webSiteJsonLd]) }}
        />
      </head>
      <body className="min-h-screen bg-base-100">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
