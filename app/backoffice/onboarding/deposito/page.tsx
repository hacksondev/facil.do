'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingDepositPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [amount, setAmount] = useState('')
  const [currency] = useState<'DOP'>('DOP')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const companyId = searchParams.get('companyId') ?? ''
  const accountId = searchParams.get('accountId') ?? ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setDone(true)
      setSubmitting(false)
    }, 800)
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
          {!done ? (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Depósito inicial</h1>
                <p className="text-base-content/70">
                  Para activar la cuenta, registra el depósito inicial en DOP luego de aprobar documentos.
                </p>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">Monto</span>
                    <input
                      type="number"
                      min={0}
                      required
                      className="input input-bordered w-full"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1000"
                    />
                  </label>
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">Moneda</span>
                    <select className="select select-bordered w-full" value={currency} disabled>
                      <option value="DOP">DOP (principal)</option>
                    </select>
                  </label>
                </div>
                <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-3 text-sm text-base-content/70 space-y-1">
                  <p>Empresa: {companyId || 'N/D'} · Cuenta: {accountId || 'N/D'}</p>
                  <p>Sube comprobante cuando se valide la transferencia.</p>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full md:w-auto px-6 text-primary-content"
                  disabled={submitting}
                >
                  {submitting ? 'Procesando...' : 'Registrar depósito'}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold">Depósito registrado</h1>
              <p className="text-base-content/70">Activaremos la cuenta al confirmar fondos.</p>
              <button className="btn btn-primary text-primary-content" onClick={() => router.push('/backoffice/login')}>
                Ir al login
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
