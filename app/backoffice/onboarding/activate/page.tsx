'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type DocItem = { id: string; label: string; checked: boolean }

export default function OnboardingActivatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [docs, setDocs] = useState<DocItem[]>([
    { id: 'constitutivo', label: 'Acta constitutiva / Registro mercantil', checked: false },
    { id: 'rnc', label: 'Comprobante RNC/DGII', checked: false },
    { id: 'ubo', label: 'Beneficiarios finales (UBO)', checked: false },
    { id: 'address', label: 'Comprobante de dirección', checked: false },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const firstName = searchParams.get('firstName') ?? ''
  const lastName = searchParams.get('lastName') ?? ''
  const email = searchParams.get('email') ?? ''
  const companyId = searchParams.get('companyId') ?? ''
  const accountId = searchParams.get('accountId') ?? ''

  const toggleDoc = (id: string) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d)))
  }

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
        <div className="w-full max-w-2xl rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6 md:p-8 space-y-6">
          {!done ? (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Subir documentos</h1>
                <p className="text-base-content/70">
                  Sube los documentos requeridos para revisión. El depósito inicial se solicitará tras aprobación.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-2">
                  <p className="font-semibold">Documentos</p>
                  {docs.map((doc) => (
                    <label key={doc.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={doc.checked}
                        onChange={() => toggleDoc(doc.id)}
                      />
                      <span>{doc.label}</span>
                    </label>
                  ))}
                </div>

                <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-3 text-sm text-base-content/70 space-y-1">
                  <p>Aplicante: {firstName} {lastName} · {email || 'sin email'}</p>
                  <p>Empresa: {companyId || 'N/D'} · Cuenta: {accountId || 'N/D'}</p>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full md:w-auto px-6 text-primary-content"
                  disabled={submitting}
                >
                  {submitting ? 'Enviando...' : 'Enviar para revisión'}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-semibold">En revisión</h1>
              <p className="text-base-content/70">
                Documentos registrados. Tras aprobarlos, solicita el depósito inicial para activar la cuenta.
              </p>
              <button
                className="btn btn-primary text-primary-content"
                onClick={() => router.push('/backoffice/onboarding/deposito')}
              >
                Ir a depósito inicial
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
