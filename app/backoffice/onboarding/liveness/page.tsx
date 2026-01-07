'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingLivenessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'capturing' | 'success'>('idle')
  const [score, setScore] = useState<number | null>(null)

  const firstName = searchParams.get('firstName') ?? ''
  const lastName = searchParams.get('lastName') ?? ''
  const email = searchParams.get('email') ?? ''

  const startLiveness = () => {
    setStatus('capturing')
    setTimeout(() => {
      const mockScore = 0.92
      setScore(mockScore)
      setStatus('success')
    }, 1200)
  }

  const handleContinue = () => {
    const params = new URLSearchParams()
    params.set('firstName', firstName)
    params.set('lastName', lastName)
    params.set('email', email)
    if (score) params.set('livenessScore', String(score))
    router.push(`/backoffice/onboarding/complete?${params.toString()}`)
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

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-xl rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Prueba de vida</h1>
            <p className="text-base-content/70">
              Necesitamos validar que eres el propietario. Completa la detección de rostro.
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-4 text-sm text-base-content/70 space-y-2">
            <p>Recomendado: luz frontal, sin gorra, rostro centrado. Sigue los gestos que aparecen.</p>
            <p>Aplicante: {firstName} {lastName} · {email || 'sin email'}</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-48 h-48 rounded-full border-4 border-primary/30 bg-base-200 flex items-center justify-center text-base-content/60">
              {status === 'capturing' && 'Capturando...'}
              {status === 'success' && 'Liveness ok'}
              {status === 'idle' && 'Listo para iniciar'}
            </div>
            <button
              type="button"
              className="btn btn-primary text-primary-content"
              onClick={startLiveness}
              disabled={status === 'capturing'}
            >
              {status === 'capturing' ? 'Procesando...' : 'Iniciar prueba'}
            </button>
            {status === 'success' && score !== null && (
              <p className="text-sm text-success">Score: {score.toFixed(2)} — propietario verificado.</p>
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary w-full md:w-auto px-6 text-primary-content"
            onClick={handleContinue}
            disabled={status !== 'success'}
          >
            Continuar
          </button>
        </div>
      </main>
    </div>
  )
}
