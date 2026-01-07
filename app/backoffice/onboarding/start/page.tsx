/* Onboarding inicial inspirado en Mercury (mock) */
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingStartPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [firstName, setFirstName] = useState(searchParams.get('firstName') ?? '')
  const [lastName, setLastName] = useState(searchParams.get('lastName') ?? '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const params = new URLSearchParams()
    params.set('firstName', firstName)
    params.set('lastName', lastName)
    router.push(`/backoffice/onboarding/create-account?${params.toString()}`)
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
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6 md:p-8 space-y-6"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Comienza tu aplicación</h1>
            <p className="text-base-content/70">Tardarás menos de 10 minutos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="form-control w-full">
              <span className="label-text text-sm font-medium">Nombre</span>
              <input
                type="text"
                required
                className="input input-bordered w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ana"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text text-sm font-medium">Apellido</span>
              <input
                type="text"
                required
                className="input input-bordered w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pérez"
              />
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full md:w-auto px-6 text-primary-content"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Comenzar solicitud'}
          </button>

          <p className="text-xs text-base-content/60 leading-relaxed">
            Al hacer clic en “Comenzar solicitud” aceptas los Términos y la Política de privacidad de Facil.do y consientes
            recibir comunicaciones electrónicas relacionadas a tu cuenta.
          </p>
        </form>
      </main>
    </div>
  )
}
