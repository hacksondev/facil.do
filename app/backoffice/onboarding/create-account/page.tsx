/* Paso de creación de credenciales - onboarding mock */
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import supabase from '../../../services/supabaseClient'

export default function OnboardingCreateAccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const firstName = searchParams.get('firstName') ?? ''
  const lastName = searchParams.get('lastName') ?? ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const validateRes = await fetch('/api/onboarding/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!validateRes.ok) {
        const body = await validateRes.json().catch(() => ({}))
        if (validateRes.status === 409) {
          setError(body.message ?? 'Este correo ya está registrado. Inicia sesión o usa otro.')
          setLoading(false)
          return
        }
        throw new Error(body.error ?? 'No se pudo validar el correo')
      }

      const fullName = `${firstName} ${lastName}`.trim()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message ?? 'No se pudo crear la cuenta')
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      params.set('firstName', firstName)
      params.set('lastName', lastName)
      params.set('email', email)
      router.push(`/backoffice/onboarding/company-info?${params.toString()}`)
    } catch (err: any) {
      console.error('Error creando cuenta:', err)
      setError(err?.message ?? 'No se pudo crear la cuenta')
      setLoading(false)
    }
  }

  const handleBack = () => {
    const params = new URLSearchParams()
    params.set('firstName', firstName)
    params.set('lastName', lastName)
    router.push(`/backoffice/onboarding/start?${params.toString()}`)
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
            <h1 className="text-2xl font-semibold">Crea tu acceso</h1>
            <p className="text-base-content/70">Usarás este correo y contraseña para ingresar.</p>
          </div>

          <div className="space-y-3">
            <label className="form-control w-full">
              <span className="label-text text-sm font-medium">Correo de trabajo</span>
              <input
                type="email"
                required
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text text-sm font-medium">Contraseña</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={10}
                  className="input input-bordered w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 10 caracteres"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-base-content/60 hover:text-base-content"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Mostrar u ocultar contraseña"
                >
                  👁
                </button>
              </div>
              <span className="text-xs text-base-content/60 mt-1">Mínimo 10 caracteres</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full md:w-auto px-6 text-primary-content"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Siguiente'}
          </button>

          <p className="text-xs text-base-content/60 leading-relaxed">
            Continuar implica aceptar los Términos y la Política de privacidad de Facil.do y consentir comunicaciones
            electrónicas sobre tu cuenta.
          </p>
          {(firstName || lastName) && (
            <p className="text-xs text-base-content/60">Aplicante: {firstName} {lastName}</p>
          )}
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex justify-start">
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleBack}>
              Atrás
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
