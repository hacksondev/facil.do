'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/mock/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'No se pudo iniciar sesión')
        setLoading(false)
        return
      }

      const redirect = searchParams.get('redirect') ?? '/backoffice'
      router.push(redirect)
      router.refresh()
    } catch (err) {
      setError('Error de red o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-4">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text text-sm font-medium">Email corporativo</span>
        </div>
        <input
          type="email"
          name="email"
          required
          placeholder="ops@facil.do"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text text-sm font-medium">Contraseña</span>
          <a className="label-text-alt link link-hover text-primary text-sm" href="#">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <input
          type="password"
          name="password"
          required
          placeholder="demo123"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <div className="flex items-center justify-between text-sm text-base-content/70">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="checkbox checkbox-sm" />
          <span>Recordar sesión</span>
        </label>
        <span className="badge bg-base-200 border-base-300">Mock, sin SSO</span>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <button type="submit" className="btn btn-primary w-full text-primary-content" disabled={loading}>
        {loading ? 'Ingresando...' : 'Entrar'}
      </button>
    </form>
  )
}
