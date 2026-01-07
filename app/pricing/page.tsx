import type { Metadata } from 'next'
import PricingContent from './PricingContent'

export const metadata: Metadata = {
  title: 'Precios | Facil.do',
  description: 'Planes claros y sin letra pequeña. Transferencias locales incluidas, tarjetas virtuales y herramientas para controlar tus finanzas empresariales.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Precios | Facil.do',
    description: 'Planes transparentes sin costos ocultos. Transferencias incluidas, tarjetas virtuales y herramientas financieras para tu negocio.',
    url: 'https://facil.do/pricing',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Facil.do - Precios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Precios | Facil.do',
    description: 'Planes transparentes sin costos ocultos. Transferencias incluidas, tarjetas virtuales y herramientas financieras para tu negocio.',
    images: ['/og-image.png'],
  },
}

export default function PricingPage() {
  return <PricingContent />
}
