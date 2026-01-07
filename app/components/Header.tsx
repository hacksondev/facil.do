'use client'

/**
 * Componente Header - DaisyUI + Facil Design
 *
 * Navbar con drawer para móvil, efecto glass en scroll y soporte
 * para enlaces internos o rutas (ej. página de pricing).
 */

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type NavLink = {
  href: string
  label: string
  type?: 'anchor' | 'route'
}

interface HeaderProps {
  onCtaClick: () => void
  navLinks?: NavLink[]
}

export default function Header({ onCtaClick, navLinks }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const defaultNavLinks: NavLink[] = [
    { href: '#features', label: 'Características', type: 'anchor' },
    { href: '/pricing', label: 'Precios', type: 'route' },
    { href: '/about', label: 'Nosotros', type: 'route' },
    { href: '#waitlist', label: 'Regístrate', type: 'anchor' },
  ]

  const linksToRender = navLinks ?? defaultNavLinks

  const closeDrawer = () => {
    const checkbox = document.getElementById('mobile-drawer') as HTMLInputElement
    if (checkbox) checkbox.checked = false
  }

  const handleNavClick = (link: NavLink) => {
    const isRoute = link.type === 'route' || link.href.startsWith('/')

    if (isRoute) {
      // Si es un hash hacia home y ya estamos en '/', hacemos scroll suave
      if (link.href.startsWith('/#') && pathname === '/') {
        const targetId = link.href.split('#')[1]
        if (targetId) {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
        }
        closeDrawer()
        return
      }

      router.push(link.href)
      closeDrawer()
      return
    }

    // Anclas internas dentro de la misma página
    if (link.href.startsWith('#')) {
      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
      closeDrawer()
      return
    }

    router.push(link.href)
    closeDrawer()
  }

  return (
    <div className="drawer">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page content */}
      <div className="drawer-content">
        {/* Navbar */}
        <header
          className={`navbar fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 transition-all duration-300 ${
            isScrolled ? 'navbar-glass py-2' : 'bg-transparent py-4'
          }`}
        >
          {/* Logo */}
          <div className="navbar-start">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-base-content">Facil.do</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-1">
              {linksToRender.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link)}
                    className="font-medium text-base-content/70 hover:text-base-content hover:bg-base-200/50"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop CTA + Mobile Menu Button */}
          <div className="navbar-end gap-2">
            <button onClick={onCtaClick} className="btn btn-primary btn-md hidden lg:flex">
              Separa tu cupo
            </button>

            {/* Mobile menu button */}
            <label htmlFor="mobile-drawer" className="btn btn-ghost btn-circle lg:hidden">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      <div className="drawer-side z-50">
        <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

        <div className="menu bg-base-100 min-h-full w-80 p-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-semibold">Menú</span>
            <label htmlFor="mobile-drawer" className="btn btn-ghost btn-circle btn-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </label>
          </div>

          {/* Navigation Links */}
          <ul className="space-y-2 flex-1">
            {linksToRender.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link)}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-base font-medium hover:bg-base-200 transition-colors"
                >
                  {link.label}
                  <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-base-200">
            <button
              onClick={() => {
                const checkbox = document.getElementById('mobile-drawer') as HTMLInputElement
                if (checkbox) checkbox.checked = false
                onCtaClick()
              }}
              className="btn btn-primary w-full"
            >
              Separa tu cupo
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p className="text-center text-sm text-base-content/50 mt-4">
              500+ negocios ya separaron su cupo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
