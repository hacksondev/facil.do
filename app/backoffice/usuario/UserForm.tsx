'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Company } from '../utils'

type Props = {
  companyId: string
}

export default function UserForm({ companyId }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'aprobador' | 'visor'>('visor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/company-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, name, email, role }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo crear el usuario')
      }
      setSuccess('Usuario creado (estado pendiente).')
      setName('')
      setEmail('')
      setRole('visor')
      router.refresh()
    } catch (err: any) {
      setError(err?.message ?? 'Error al crear usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Nombre</span>
        <input
          type="text"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Correo</span>
        <input
          type="email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="form-control w-full md:col-span-2">
        <span className="label-text text-sm font-medium">Rol</span>
        <select
          className="select select-bordered w-full"
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="admin">Admin</option>
          <option value="aprobador">Aprobador</option>
          <option value="visor">Visor</option>
        </select>
      </label>
      {error && <p className="text-error text-sm md:col-span-2">{error}</p>}
      {success && <p className="text-success text-sm md:col-span-2">{success}</p>}
      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="btn btn-primary text-primary-content" disabled={loading}>
          {loading ? 'Creando...' : 'Crear usuario'}
        </button>
      </div>
    </form>
  )
}
