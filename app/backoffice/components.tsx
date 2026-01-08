/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Company } from './utils'
import supabase from '../services/supabaseClient'

type IconName =
  | 'home'
  | 'tasks'
  | 'arrows'
  | 'payments'
  | 'card'
  | 'capital'
  | 'accounts'
  | 'checking'
  | 'savings'
  | 'workflows'
  | 'bill'
  | 'invoice'
  | 'catalog'
  | 'customers'
  | 'reimburse'
  | 'accounting'
  | 'user'
  | 'tax'
  | 'ach'
  | 'dot'

type NavItem = {
  label: string
  href: string
  icon: IconName
  children?: NavItem[]
}

function buildNavItems(companyQuery: string, accountChildren: NavItem[] = []): NavItem[] {
  const withQuery = (href: string) => (href === '#' ? href : `${href}${companyQuery}`)
  return [
    { label: 'Inicio', href: withQuery('/backoffice'), icon: 'home' },
    { label: 'Tareas', href: withQuery('/backoffice/tasks'), icon: 'tasks' },
    { label: 'Transacciones', href: withQuery('/backoffice/transactions'), icon: 'arrows' },
    {
      label: 'Pagos',
      href: withQuery('/backoffice/payments'),
      icon: 'payments',
      children: [
        { label: 'Beneficiarios', href: withQuery('/backoffice/payments/beneficiarios'), icon: 'user' },
        { label: 'Autorizaciones ACH', href: withQuery('/backoffice/payments/ach'), icon: 'ach' },
      ],
    },
    { label: 'Tarjetas', href: withQuery('/backoffice/cards'), icon: 'card' },
    { label: 'Capital', href: withQuery('/backoffice/capital'), icon: 'capital' },
    {
      label: 'Cuentas',
      href: withQuery('/backoffice/accounts'),
      icon: 'accounts',
      children: accountChildren,
    },
    {
      label: 'Workflows',
      href: withQuery('/backoffice/workflows'),
      icon: 'workflows',
      children: [
        { label: 'Bill Pay', href: withQuery('/backoffice/workflows/bill-pay'), icon: 'bill' },
        {
          label: 'Facturación',
          href: withQuery('/backoffice/workflows/facturacion'),
          icon: 'invoice',
          children: [
            { label: 'Catálogo', href: withQuery('/backoffice/workflows/facturacion/catalogo'), icon: 'catalog' },
            { label: 'Clientes', href: withQuery('/backoffice/workflows/facturacion/clientes'), icon: 'customers' },
          ],
        },
        { label: 'Reembolsos', href: withQuery('/backoffice/workflows/reembolsos'), icon: 'reimburse' },
        { label: 'Contabilidad', href: withQuery('/backoffice/workflows/contabilidad'), icon: 'accounting' },
      ],
    },
  ]
}

type ShellProps = {
  children: React.ReactNode
  companies: Company[]
  activeCompany?: Company
  activePath: string
  title: string
  subtitle?: string
  actionLabel?: string
}

export function BackofficeShell({
  children,
  companies,
  activeCompany,
  activePath,
  title,
  subtitle,
  actionLabel = 'Mover fondos',
  onActionClick,
}: ShellProps & { onActionClick?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const companyQuery = activeCompany?.id ? `?companyId=${activeCompany.id}` : ''
  const accountChildren =
    activeCompany?.accountsMenu?.map((acc) => ({
      label: `${acc.alias || acc.type === 'checking' ? 'Corriente' : 'Ahorro'} ·· ${acc.number?.slice(-4) ?? ''}`,
      href: `${'/backoffice/accounts/' + acc.id}${companyQuery}`,
      icon: acc.type === 'checking' ? 'checking' : 'savings',
    })) ?? []

  const navItems = buildNavItems(companyQuery, accountChildren)
  return (
    <div className="h-screen overflow-hidden bg-base-200 text-base-content">
      <div className="flex h-screen">
        <Sidebar
          companies={companies}
          activeCompanyId={activeCompany?.id}
          activePath={activePath}
          navItems={navItems}
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="p-4 md:p-6 lg:p-8 space-y-4 overflow-y-auto h-full">
            <TopBar
              title={title}
              subtitle={subtitle ?? activeCompany?.name}
              searchPlaceholder="Busca cuentas, personas..."
              actionLabel={actionLabel}
              onActionClick={onActionClick}
              onMenuClick={() => setMobileOpen(true)}
            />
            <MobileDrawer
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              navItems={navItems}
              activePath={activePath}
            />
            <div className="space-y-4 pb-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sidebar({
  companies,
  activeCompanyId,
  activePath,
  navItems,
}: {
  companies: Company[]
  activeCompanyId?: string
  activePath: string
  navItems: ReturnType<typeof buildNavItems>
}) {
  const router = useRouter()
  const activeCompany = companies.find((c) => c.id === activeCompanyId) ?? companies[0]

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navItems.forEach((item) => {
      if (item.children && item.href !== '#' && activePath.startsWith(item.href)) {
        initial[item.label] = true
        item.children?.forEach((child) => {
          if (child.children && activePath.startsWith(child.href)) {
            initial[`${item.label}-${child.label}`] = true
          }
        })
      }
    })
    return initial
  })

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-base-100 border-r border-base-300/70">
      <div className="px-3 py-4 border-b border-base-300/70">
        <div className="dropdown dropdown-bottom w-full">
          <div tabIndex={0} role="button" className="w-full px-3 py-2 rounded-lg hover:bg-base-200 text-left">
            <p className="text-xs font-semibold uppercase text-base-content/60">Backoffice</p>
            <p className="text-lg font-bold flex items-center justify-between">
              {activeCompany?.name ?? 'Facil.do Ops'}
              <svg
                className="w-4 h-4 text-base-content/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </p>
            <p className="text-xs text-base-content/60">RNC {activeCompany?.rnc ?? '—'}</p>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 border border-base-300 rounded-xl w-64 shadow-lg p-2"
          >
            <li><Link href={`/backoffice/ajustes${activeCompanyId ? `?companyId=${activeCompanyId}` : ''}`} className="justify-start">Configuración</Link></li>
            <li><Link href={`/backoffice/usuario${activeCompanyId ? `?companyId=${activeCompanyId}` : ''}`} className="justify-start">Usuario</Link></li>
            {/* <li><Link href={`/backoffice/documentos${activeCompanyId ? `?companyId=${activeCompanyId}` : ''}`} className="justify-start">Documentos y datos</Link></li> */}
            {/* <li><Link href={`/backoffice/plan-facturacion${activeCompanyId ? `?companyId=${activeCompanyId}` : ''}`} className="justify-start">Plan y facturación</Link></li> */}
            {/* <li><Link href={`/backoffice/referidos${activeCompanyId ? `?companyId=${activeCompanyId}` : ''}`} className="justify-start">Referidos</Link></li> */}
            <li className="menu-title mt-2">Switch account</li>
            {companies.map((c) => (
              <li key={c.id}>
                <Link
                  href={`${activePath}?companyId=${c.id}`}
                  className="flex items-center justify-between"
                >
                  <span>{c.name}</span>
                  {c.id === activeCompanyId && (
                    <span className="badge badge-sm bg-primary/10 text-primary border-primary/30">Activo</span>
                  )}
                </Link>
              </li>
            ))}
            <li><hr className="my-2" /></li>
              {/* <li><button type="button" className="justify-start">Aplicar a nueva cuenta</button></li> */}
              {/* <li><button type="button" className="justify-start">Vincular cuenta existente</button></li> */}
              <li>
                <button
                  className="text-error text-left"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    router.push('/backoffice/login')
                    router.refresh()
                  }}
                >
                  Log out
                </button>
              </li>
          </ul>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href !== '#' && activePath.startsWith(item.href)
          const isOpen = !!openSections[item.label]
          return (
            <div key={item.label} className="space-y-1">
              {item.children ? (
                <button
                  type="button"
                  onClick={() => toggleSection(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium ${
                    isActive || isOpen ? 'bg-base-200 text-base-content' : 'text-base-content/70 hover:bg-base-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={item.icon} />
                    {item.label}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
                    isActive ? 'bg-base-200 text-base-content' : 'text-base-content/70 hover:bg-base-200'
                  }`}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              )}
              {item.children && (
                <div className={`pl-3 space-y-1 ${isOpen ? 'block' : 'hidden'}`}>
                  {item.children.map((child) => {
                    const childHref = child.href
                    const childOpen = !!openSections[`${item.label}-${child.label}`]
                    return (
                      <div key={child.label} className="space-y-1">
                        {child.children ? (
                          <button
                            type="button"
                            onClick={() => toggleSection(`${item.label}-${child.label}`)}
                            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm text-base-content/70 hover:bg-base-200"
                          >
                            <span className="flex items-center gap-2">
                              <Icon name={child.icon} size="sm" />
                              {child.label}
                            </span>
                            <svg
                              className={`w-3.5 h-3.5 transition-transform ${childOpen ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        ) : (
                          <Link
                            href={childHref}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-base-content/70 hover:bg-base-200"
                          >
                            <Icon name={child.icon} size="sm" />
                            {child.label}
                          </Link>
                        )}
                        {child.children && (
                          <div className={`pl-3 space-y-1 ${childOpen ? 'block' : 'hidden'}`}>
                            {child.children.map((grand) => {
                              const grandHref = grand.href
                              return (
                                <Link
                                  key={grand.label}
                                  href={grandHref}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-base-content/60 hover:bg-base-200"
                                >
                                  <Icon name={grand.icon ?? 'dot'} size="xs" />
                                  {grand.label}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-base-300/70 text-sm text-base-content/70">
        Última sync: hace 5 min
      </div>
    </aside>
  )
}

function MobileDrawer({
  open,
  onClose,
  navItems,
  activePath,
}: {
  open: boolean
  onClose: () => void
  navItems: NavItem[]
  activePath: string
}) {
  if (!open) return null
  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-base-100/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
        <p className="text-sm font-semibold">Menú</p>
        <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Cerrar menú">
          ✕
        </button>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-52px)]">
        {navItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <Link
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
                activePath.startsWith(item.href.replace(/\?.*/, ''))
                  ? 'bg-base-200 text-base-content'
                  : 'text-base-content/70 hover:bg-base-200'
              }`}
              onClick={onClose}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
            {item.children && (
              <div className="pl-4 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-base-content/70 hover:bg-base-200"
                    onClick={onClose}
                  >
                    <Icon name={child.icon} size="sm" />
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TopBar({
  title,
  subtitle,
  searchPlaceholder,
  actionLabel,
  onMenuClick,
  onActionClick,
}: {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  actionLabel?: string
  onMenuClick?: () => void
  onActionClick?: () => void
}) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="hidden md:block h-10 w-10 rounded-xl bg-primary/10 border border-primary/20" />
        <button
          type="button"
          className="btn btn-ghost btn-sm lg:hidden"
          aria-label="Abrir menú"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <div>
          <p className="text-sm text-base-content/60">{subtitle}</p>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <input
            type="search"
            placeholder={searchPlaceholder ?? 'Buscar'}
            className="input input-bordered w-full bg-base-100"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/60">⌘K</span>
        </div>
        {actionLabel && (
          <button className="btn btn-primary text-primary-content" type="button" onClick={onActionClick}>
            {actionLabel}
          </button>
        )}
      </div>
    </header>
  )
}

export function CardPanel({
  title,
  subtitle,
  actionLabel,
  children,
}: {
  title: string
  subtitle?: string
  actionLabel?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-base-content/70">{subtitle}</p>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {actionLabel && (
          <button className="btn btn-sm bg-base-100 border-base-300 text-sm" type="button">
            {actionLabel}
          </button>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function ProgressRow({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-base-content/60">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-base-200 mt-2 overflow-hidden">
        <div
          className={`h-full ${accent ?? 'bg-primary'}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}

function Icon({ name, size = 'md' }: { name: IconName; size?: 'md' | 'sm' | 'xs' }) {
  const dimension = size === 'md' ? 16 : size === 'sm' ? 14 : 10
  const strokeWidth = size === 'xs' ? 2 : 1.8
  const iconPaths: Record<IconName, JSX.Element> = {
    home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" />,
    tasks: <path d="m5 7 2 2 3-3m3 0h6m-9 6 2 2 3-3m3 0h1M4 17h6m-6-4h6M4 9h1" />,
    arrows: <path d="M4 10h12l-3-3m3 7H4l3 3" />,
    payments: <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5v1h-7v3h7v5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5z" />,
    card: <path d="M4 6.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5Zm0 4h16" />,
    capital: <path d="M5 15.5 10 10l3.5 3.5L19 8v9M4 19h16" />,
    accounts: <path d="M4 8.5 12 4l8 4.5v8H4z" />,
    checking: <path d="M4 8.5 12 5l8 3.5v8H4z" />,
    savings: <path d="M6 9h12v9H6z" />,
    workflows: <path d="M6 6h5v5H6zm7 0h5v5h-5zM6 13h5v5H6zm7 3h5" />,
    bill: <path d="M7 4.5h10v15l-3-2-2 2-2-2-3 2z" />,
    invoice: <path d="M7 4h10v14H7z M9 8h6M9 11h6M9 14h4" />,
    catalog: <path d="M6 5.5h12v13H6z M6 9h12" />,
    customers: <path d="M9 9a3 3 0 1 1 6 0v1a3 3 0 0 1-6 0zM5 18a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4" />,
    reimburse: <path d="M6 6h12v12H6z M9 9h6M9 12h4M9 15h3" />,
    accounting: <path d="M5 6h14v12H5z M9 9v6m6-6v6M5 12h14" />,
    user: <path d="M12 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-6 6a6 6 0 0 1 12 0" />,
    tax: <path d="M7 8h10M7 12h10M7 16h4" />,
    ach: <path d="M5 12h14M9 8l-4 4 4 4m6-8 4 4-4 4" />,
    dot: <circle cx="12" cy="12" r="2" />,
  }

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {iconPaths[name]}
    </svg>
  )
}
