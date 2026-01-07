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
  const [info, setInfo] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [confirmingLogin, setConfirmingLogin] = useState(false)

  const firstName = searchParams.get('firstName') ?? ''
  const lastName = searchParams.get('lastName') ?? ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

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
        const detail = body.details ? ` Detalle: ${body.details}` : ''
        throw new Error((body.error ?? 'No se pudo validar el correo') + detail)
      }

      const emailRedirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/backoffice/login`
          : undefined

      const fullName = `${firstName} ${lastName}`.trim()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
          },
          emailRedirectTo,
        },
      })

      if (signUpError) {
        setError(signUpError.message ?? 'No se pudo crear la cuenta')
        setLoading(false)
        return
      }

      setConfirmationSent(true)
      setInfo('Revisa tu correo y confirma tu cuenta para continuar con el onboarding.')
      setLoading(false)
    } catch (err: any) {
      console.error('Error creando cuenta:', err)
      setError(err?.message ?? 'No se pudo crear la cuenta')
      setLoading(false)
    }
  }

  const handleConfirmAndContinue = async () => {
    setConfirmingLogin(true)
    setError(null)
    setInfo(null)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        if (signInError.message?.toLowerCase().includes('email not confirmed')) {
          setError('Aún no confirmas tu correo. Revisa tu bandeja o reenvía el enlace.')
        } else {
          setError(signInError.message ?? 'No se pudo iniciar sesión')
        }
        setConfirmingLogin(false)
        return
      }

      if (!data.session) {
        setError('Aún no hay sesión activa. Confirma el correo e inténtalo de nuevo.')
        setConfirmingLogin(false)
        return
      }

      const params = new URLSearchParams()
      params.set('firstName', firstName)
      params.set('lastName', lastName)
      params.set('email', email)
      router.push(`/backoffice/onboarding/company-info?${params.toString()}`)
    } catch (err: any) {
      console.error('Error al confirmar e ingresar:', err)
      setError(err?.message ?? 'No se pudo continuar')
    } finally {
      setConfirmingLogin(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError(null)
    setInfo(null)
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      if (resendError) {
        setError(resendError.message ?? 'No se pudo reenviar el correo')
      } else {
        setInfo('Correo de confirmación reenviado. Revisa tu bandeja.')
      }
    } catch (err: any) {
      console.error('Error reenviando correo:', err)
      setError(err?.message ?? 'No se pudo reenviar el correo')
    } finally {
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
            <p className="text-base-content/70">
              Usarás este correo y contraseña para ingresar. Debes confirmar el correo para continuar.
            </p>
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

          {!confirmationSent && (
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto px-6 text-primary-content"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>
          )}

          {confirmationSent && (
            <div className="rounded-lg border border-base-300 bg-base-200 p-4 space-y-3">
              <p className="text-sm">
                Enviamos un correo de confirmación a <strong>{email}</strong>. Confírmalo para seguir con el onboarding.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm text-primary-content"
                  onClick={handleConfirmAndContinue}
                  disabled={confirmingLogin}
                >
                  {confirmingLogin ? 'Verificando...' : 'Ya confirmé, continuar'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleResend}
                  disabled={loading}
                >
                  Reenviar correo
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-base-content/60 leading-relaxed">
            Continuar implica aceptar los Términos y la Política de privacidad de Facil.do y consentir comunicaciones
            electrónicas sobre tu cuenta.
          </p>
          {(firstName || lastName) && (
            <p className="text-xs text-base-content/60">Aplicante: {firstName} {lastName}</p>
          )}
          {info && <p className="text-sm text-success">{info}</p>}
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
