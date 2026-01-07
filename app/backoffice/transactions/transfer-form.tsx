'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Account } from '../utils'

type Props = {
  accounts: Account[]
}

export default function TransferForm({ accounts }: Props) {
  const router = useRouter()
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [counterparty, setCounterparty] = useState('')
  const [type, setType] = useState<'debit' | 'credit'>('debit')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          amount: Number(amount),
          currency: accounts.find((a) => a.id === accountId)?.currency ?? 'DOP',
          description,
          counterparty,
          type,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo crear la transferencia')
      }

      setSuccess('Transferencia creada. Actualizando...')
      router.refresh()
    } catch (err: any) {
      setError(err?.message ?? 'Error al crear transferencia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Cuenta origen</span>
        <select
          className="select select-bordered w-full"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.alias || acc.number} · {acc.currency} · {acc.balance.toFixed(2)}
            </option>
          ))}
        </select>
      </label>

      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Tipo</span>
        <select
          className="select select-bordered w-full"
          value={type}
          onChange={(e) => setType(e.target.value as 'debit' | 'credit')}
        >
          <option value="debit">Débito (enviar)</option>
          <option value="credit">Crédito (recibir)</option>
        </select>
      </label>

      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Monto</span>
        <input
          type="number"
          min="0"
          step="0.01"
          required
          className="input input-bordered w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text text-sm font-medium">Contraparte</span>
        <input
          type="text"
          className="input input-bordered w-full"
          value={counterparty}
          onChange={(e) => setCounterparty(e.target.value)}
          placeholder="Ej: Proveedor SRL"
        />
      </label>

      <label className="form-control w-full md:col-span-2">
        <span className="label-text text-sm font-medium">Descripción</span>
        <input
          type="text"
          className="input input-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalle de la transferencia"
        />
      </label>

      {error && <p className="text-sm text-error md:col-span-2">{error}</p>}
      {success && <p className="text-sm text-success md:col-span-2">{success}</p>}

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="btn btn-primary text-primary-content" disabled={loading || !accountId}>
          {loading ? 'Creando...' : 'Crear transferencia'}
        </button>
      </div>
    </form>
  )
}
