import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'Sobre nosotros | Facil.do',
  description:
    'Conoce al equipo detrás de Facil.do. Nuestra misión es simplificar las finanzas de las MIPYMES dominicanas con una cuenta empresarial 100% digital.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Sobre nosotros | Facil.do',
    description:
      'Conoce al equipo detrás de Facil.do y cómo estamos construyendo la banca empresarial digital para MIPYMES dominicanas.',
    url: 'https://facil.do/about',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Facil.do - Sobre nosotros',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre nosotros | Facil.do',
    description:
      'Conoce al equipo detrás de Facil.do y cómo estamos construyendo la banca empresarial digital para MIPYMES dominicanas.',
    images: ['/og-image.png'],
  },
}

export default function AboutPage() {
  return <AboutContent />
}
