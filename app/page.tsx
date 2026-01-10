'use client'

/**
 * Página principal del Landing Page - Flat Design
 *
 * Landing page moderna con diseño flat: colores sólidos, bordes limpios, sin gradientes.
 * Optimizada con lazy loading para mejor performance.
 */

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Header from './components/Header'
import Hero from './components/Hero'
import { initFirebaseAnalytics } from './services/firebaseClient'

// Lazy loading de componentes below-the-fold
const ValueProposition = dynamic(() => import('./components/ValueProposition'), {
  loading: () => <div className="h-96 animate-pulse bg-base-200" />,
  ssr: true
})

const Features = dynamic(() => import('./components/Features'), {
  loading: () => <div className="h-96 animate-pulse bg-base-200" />,
  ssr: true
})

const Footer = dynamic(() => import('./components/Footer'), {
  ssr: true
})

export default function HomePage() {
  useEffect(() => {
    initFirebaseAnalytics()
  }, [])

  return (
    <>
      {/* Header */}
      <Header />

      <main className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <Hero />

        {/* Value Proposition */}
        <ValueProposition />

        {/* Features */}
        <Features />

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}
