'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const steps = [
  'Información de la empresa',
  'Dirección',
  'Propietarios',
  'Documentos',
  'Actividad esperada',
  'Preguntas adicionales',
]

export default function CompanyAddressPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [address, setAddress] = useState(searchParams.get('address') ?? '')
  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [province, setProvince] = useState(searchParams.get('province') ?? '')
  const [postalCode, setPostalCode] = useState(searchParams.get('postalCode') ?? '')
  const [country, setCountry] = useState('República Dominicana')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const caseId = searchParams.get('caseId') ?? ''
  const companyId = searchParams.get('companyId') ?? ''

  const forwardParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('address', address)
    params.set('city', city)
    params.set('province', province)
    params.set('postalCode', postalCode)
    params.set('country', country)
    if (caseId) params.set('caseId', caseId)
    if (companyId) params.set('companyId', companyId)
    return params
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'company_address',
          caseId: caseId || undefined,
          companyId: companyId || undefined,
          data: { address, city, province, postalCode, country },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo guardar la dirección')
      }
      router.push(`/backoffice/onboarding/ownership?${forwardParams().toString()}`)
    } catch (err: any) {
      console.error('Error guardando dirección', err)
      setError(err?.message ?? 'No se pudo guardar la dirección')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString())
    router.push(`/backoffice/onboarding/company-info?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20" />
        <button
          type="button"
          className="text-sm font-medium text-base-content/70 hover:text-base-content"
          onClick={() => router.push('/backoffice/login')}
        >
          Iniciar sesión →
        </button>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
          <aside className="md:w-56 flex-shrink-0 space-y-3">
            <p className="text-sm font-medium text-primary">2 / 6</p>
            <nav className="space-y-2 text-sm">
              {steps.map((step, idx) => (
                <div
                  key={step}
                  className={`px-3 py-2 rounded-lg ${idx === 1 ? 'bg-primary/10 text-primary font-semibold' : 'text-base-content/60'}`}
                >
                  {step}
                </div>
              ))}
            </nav>
          </aside>

          <section className="flex-1">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6 md:p-8 space-y-4"
            >
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Dirección de la empresa</h1>
                <p className="text-base-content/70">Usaremos esta dirección para verificaciones y notificaciones.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Dirección</span>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, número, referencia"
                  />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">Ciudad</span>
                    <input
                      type="text"
                      required
                      className="input input-bordered w-full"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Santo Domingo"
                    />
                  </label>
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">Provincia</span>
                    <input
                      type="text"
                      required
                      className="input input-bordered w-full"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Distrito Nacional"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">Código postal</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10101"
                    />
                  </label>
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">País</span>
                    <select
                      className="select select-bordered w-full"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option>República Dominicana</option>
                    </select>
                  </label>
                </div>
              </div>

              {error && <p className="text-sm text-error">{error}</p>}

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-base-content/60">Paso 2 de 6</div>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleBack}>
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-primary-content"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Siguiente'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
