'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  companyId: string
}

export default function BeneficiarioForm({ companyId }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountType, setAccountType] = useState('corriente')
  const [currency, setCurrency] = useState('DOP')
  const [documentType, setDocumentType] = useState<'rnc' | 'cedula' | 'pasaporte'>('rnc')
  const [documentNumber, setDocumentNumber] = useState('')
  const [alias, setAlias] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/beneficiaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          name,
          email,
          bankName,
          accountNumber,
          accountType,
          currency,
          documentType,
          documentNumber,
          alias,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo crear el beneficiario')
      }
      router.refresh()
      setName('')
      setEmail('')
      setBankName('')
      setAccountNumber('')
      setAccountType('corriente')
      setCurrency('DOP')
      setDocumentType('rnc')
      setDocumentNumber('')
      setAlias('')
    } catch (err: any) {
      setError(err?.message ?? 'Error al crear beneficiario')
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
        <span className="label-text text-sm font-medium">Correo (opcional)</span>
        <input
          type="email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Banco</span>
        <input
          type="text"
          className="input input-bordered w-full"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
        />
      </label>
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Número de cuenta</span>
        <input
          type="text"
          className="input input-bordered w-full"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />
      </label>
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Tipo de cuenta</span>
        <select
          className="select select-bordered w-full"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="corriente">Corriente</option>
          <option value="ahorros">Ahorros</option>
        </select>
      </label>
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Moneda</span>
        <select
          className="select select-bordered w-full"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="DOP">DOP</option>
          <option value="USD">USD</option>
        </select>
      </label>
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Tipo de documento</span>
        <select
          className="select select-bordered w-full"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as any)}
        >
          <option value="rnc">RNC</option>
          <option value="cedula">Cédula</option>
          <option value="pasaporte">Pasaporte</option>
        </select>
      </label>
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Número de documento</span>
        <input
          type="text"
          className="input input-bordered w-full"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          required
        />
      </label>
      <label className="form-control w-full md:col-span-2">
        <span className="label-text text-sm font-medium">Alias (opcional)</span>
        <input
          type="text"
          className="input input-bordered w-full"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Ej: Proveedor logística"
        />
      </label>
      {error && <p className="text-sm text-error md:col-span-2">{error}</p>}
      <div className="md:col-span-2 flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={() => router.refresh()}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary text-primary-content" disabled={loading}>
          {loading ? 'Creando...' : 'Crear beneficiario'}
        </button>
      </div>
    </form>
  )
}
