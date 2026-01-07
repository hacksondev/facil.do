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

export default function ExpectedActivityPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [monthlyVolume, setMonthlyVolume] = useState(searchParams.get('monthlyVolume') ?? '')
  const [countries, setCountries] = useState(searchParams.get('countries') ?? 'República Dominicana')
  const [fundingSource, setFundingSource] = useState(searchParams.get('fundingSource') ?? '')
  const [loading, setLoading] = useState(false)

  const forwardParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('monthlyVolume', monthlyVolume)
    params.set('countries', countries)
    params.set('fundingSource', fundingSource)
    return params
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    router.push(`/backoffice/onboarding/follow-up?${forwardParams().toString()}`)
  }

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString())
    router.push(`/backoffice/onboarding/documents?${params.toString()}`)
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
            <p className="text-sm font-medium text-primary">5 / 6</p>
            <nav className="space-y-2 text-sm">
              {steps.map((step, idx) => (
                <div
                  key={step}
                  className={`px-3 py-2 rounded-lg ${idx === 4 ? 'bg-primary/10 text-primary font-semibold' : 'text-base-content/60'}`}
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
                <h1 className="text-2xl font-semibold">Actividad esperada</h1>
                <p className="text-base-content/70">Ayúdanos a entender el volumen y origen de fondos.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Volumen mensual estimado</span>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(e.target.value)}
                    placeholder="Ej: DOP 50,000"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Países con los que operas</span>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={countries}
                    onChange={(e) => setCountries(e.target.value)}
                    placeholder="Rep. Dominicana, EE.UU., ... "
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Origen de fondos</span>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value)}
                    placeholder="Ventas, inversiones, préstamos, etc."
                  />
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-base-content/60">Paso 5 de 6</div>
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
