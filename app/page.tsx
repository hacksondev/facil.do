'use client'

/**
 * Página principal del Landing Page - Mercury-Inspired Design
 *
 * Landing page premium mobile-first para captura de leads.
 */

import { useRef } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ValueProposition from './components/ValueProposition'
import Features from './components/Features'
import WaitlistForm from './components/WaitlistForm'
import Footer from './components/Footer'

export default function HomePage() {
  const waitlistRef = useRef<HTMLDivElement>(null)

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <>
      {/* Header */}
      <Header onCtaClick={scrollToWaitlist} />

      <main className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <Hero onCtaClick={scrollToWaitlist} />

        {/* Value Proposition */}
        <ValueProposition />

        {/* Features */}
        <Features />

        {/* Waitlist Form */}
        <WaitlistForm ref={waitlistRef} />

        {/* Footer */}
        <Footer />

        {/* Mobile sticky CTA - hidden when near waitlist section */}
        <div className="fixed bottom-0 left-0 right-0 p-4 mobile-cta-bar md:hidden z-30">
          <button
            onClick={scrollToWaitlist}
            className="btn-primary w-full"
            aria-label="Separar mi cupo"
          >
            <span className="flex items-center justify-center gap-2">
              Separa tu cupo
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </main>
    </>
  )
}
