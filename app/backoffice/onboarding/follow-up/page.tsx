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

export default function FollowUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [additionalInfo, setAdditionalInfo] = useState(searchParams.get('additionalInfo') ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const caseId = searchParams.get('caseId') ?? undefined
  const companyId = searchParams.get('companyId') ?? undefined
  const personId = searchParams.get('personId') ?? undefined

  const forwardParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('additionalInfo', additionalInfo)
    if (caseId) params.set('caseId', caseId)
    if (companyId) params.set('companyId', companyId)
    if (personId) params.set('personId', personId)
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
          step: 'follow_up',
          caseId,
          companyId,
          personId,
          data: { additionalInfo },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo finalizar el onboarding')
      }
      router.push(`/backoffice/onboarding/complete?${forwardParams().toString()}`)
    } catch (err: any) {
      console.error('Error finalizando onboarding', err)
      setError(err?.message ?? 'No se pudo finalizar el onboarding')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString())
    router.push(`/backoffice/onboarding/expected-activity?${params.toString()}`)
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
            <p className="text-sm font-medium text-primary">6 / 6</p>
            <nav className="space-y-2 text-sm">
              {steps.map((step, idx) => (
                <div
                  key={step}
                  className={`px-3 py-2 rounded-lg ${idx === 5 ? 'bg-primary/10 text-primary font-semibold' : 'text-base-content/60'}`}
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
                <h1 className="text-2xl font-semibold">Preguntas adicionales</h1>
                <p className="text-base-content/70">Comparte cualquier detalle relevante para la revisión.</p>
              </div>

              <label className="form-control w-full">
                <span className="label-text text-sm font-medium">Notas</span>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Describe casos de uso, clientes clave o certificaciones."
                />
              </label>

              {error && <p className="text-sm text-error">{error}</p>}

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-base-content/60">Paso 6 de 6</div>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleBack}>
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-primary-content"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Finalizar'}
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
