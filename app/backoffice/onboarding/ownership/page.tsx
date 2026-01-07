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

export default function OwnershipPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [ownerName, setOwnerName] = useState(searchParams.get('ownerName') ?? '')
  const [ownerId, setOwnerId] = useState(searchParams.get('ownerId') ?? '')
  const [ownershipPct, setOwnershipPct] = useState(searchParams.get('ownershipPct') ?? '')
  const [pep, setPep] = useState(searchParams.get('pep') === 'true')
  const [loading, setLoading] = useState(false)
  const [livenessDone, setLivenessDone] = useState(!!searchParams.get('livenessScore'))
  const [livenessScore, setLivenessScore] = useState<number | null>(
    searchParams.get('livenessScore') ? Number(searchParams.get('livenessScore')) : null,
  )

  const formatCedula = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11) // cédula RD: 11 dígitos
    const part1 = digits.slice(0, 3)
    const part2 = digits.slice(3, 10)
    const part3 = digits.slice(10, 11)
    let formatted = part1
    if (part2) formatted += `-${part2}`
    if (part3) formatted += `-${part3}`
    return formatted
  }

  const forwardParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('ownerName', ownerName)
    params.set('ownerId', ownerId)
    params.set('ownershipPct', ownershipPct)
    params.set('pep', String(pep))
    if (livenessDone && livenessScore !== null) {
      params.set('livenessScore', String(livenessScore))
    }
    return params
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    router.push(`/backoffice/onboarding/documents?${forwardParams().toString()}`)
  }

  const goBack = () => {
    const params = new URLSearchParams(searchParams.toString())
    router.push(`/backoffice/onboarding/company-address?${params.toString()}`)
  }

  const handleLiveness = () => {
    setLivenessDone(true)
    setLivenessScore(0.92)
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
            <p className="text-sm font-medium text-primary">3 / 6</p>
            <nav className="space-y-2 text-sm">
              {steps.map((step, idx) => (
                <div
                  key={step}
                  className={`px-3 py-2 rounded-lg ${idx === 2 ? 'bg-primary/10 text-primary font-semibold' : 'text-base-content/60'}`}
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
                <h1 className="text-2xl font-semibold">Propietarios / UBO</h1>
                <p className="text-base-content/70">Captura datos del propietario principal.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Nombre completo</span>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Nombre y apellido"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Documento (cédula/pasaporte)</span>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={ownerId}
                    onChange={(e) => setOwnerId(formatCedula(e.target.value))}
                    placeholder="402-0000000-0"
                  />
                  <span className="text-xs text-base-content/60 mt-1">Formato RD cédula: 11 dígitos (ej. 402-0000000-0)</span>
                </label>
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">% de participación</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    className="input input-bordered w-full"
                    value={ownershipPct}
                    onChange={(e) => setOwnershipPct(e.target.value)}
                    placeholder="Ej: 60"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={pep}
                    onChange={() => setPep((v) => !v)}
                  />
                  <span>El propietario es PEP (Persona Expuesta Políticamente)</span>
                </label>

                <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-2">
                  <p className="font-semibold">Prueba de vida del propietario</p>
                  <p className="text-sm text-base-content/70">
                    Ejecuta la prueba de vida y guarda el resultado antes de avanzar.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary text-primary-content"
                      onClick={handleLiveness}
                      disabled={livenessDone}
                    >
                      {livenessDone ? 'Completada' : 'Iniciar prueba'}
                    </button>
                    {livenessDone && livenessScore !== null && (
                      <span className="badge bg-success/10 text-success border-success/30">
                        Score {livenessScore.toFixed(2)} OK
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-base-content/60">Paso 3 de 6</div>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={goBack}>
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
