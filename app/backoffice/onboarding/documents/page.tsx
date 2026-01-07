'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef } from 'react'

const steps = [
  'Información de la empresa',
  'Dirección',
  'Propietarios',
  'Documentos',
  'Actividad esperada',
  'Preguntas adicionales',
]

export default function DocumentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialDocs = (() => {
    const raw = searchParams.get('docs')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        return {
          constitutivo: !!parsed.constitutivo,
          rnc: !!parsed.rnc,
          ubo: !!parsed.ubo,
          address: !!parsed.address,
        }
      } catch (e) {
        return {
          constitutivo: false,
          rnc: false,
          ubo: false,
          address: false,
        }
      }
    }
    return {
      constitutivo: false,
      rnc: false,
      ubo: false,
      address: false,
    }
  })()

  const [docChecks, setDocChecks] = useState(initialDocs)
  const uploadsInitial = (() => {
    const raw = searchParams.get('uploads')
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return {}
      }
    }
    return {}
  })()

  const [uploads, setUploads] = useState<Record<string, string>>(uploadsInitial)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})
  const companyId = searchParams.get('companyId') ?? undefined
  const personId = searchParams.get('personId') ?? undefined

  const forwardParams = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('docs', JSON.stringify(docChecks))
    params.set('uploads', JSON.stringify(uploads))
    return params
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    router.push(`/backoffice/onboarding/expected-activity?${forwardParams().toString()}`)
  }

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString())
    router.push(`/backoffice/onboarding/ownership?${params.toString()}`)
  }

  const triggerInput = (key: keyof typeof docChecks) => {
    fileInputs.current[key]?.click()
  }

  const handleFileChange = async (key: keyof typeof docChecks, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const file = fileList[0]
    setUploading(key)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('docType', key)
      if (companyId) form.append('companyId', companyId)
      if (personId) form.append('personId', personId)

      const res = await fetch('/api/uploads/documents', {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Error al subir')
      }
      const body = (await res.json()) as { url: string }
      setUploads((prev) => ({ ...prev, [key]: body.url }))
      setDocChecks((prev) => ({ ...prev, [key]: true }))
    } catch (err: any) {
      console.error('Error al subir documento', err)
      setError(err?.message ?? 'No se pudo subir el documento. Revisa configuración de Supabase o intenta de nuevo.')
    } finally {
      setUploading(null)
    }
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

      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
          <aside className="md:w-56 flex-shrink-0 space-y-3">
            <p className="text-sm font-medium text-primary">4 / 6</p>
            <nav className="space-y-2 text-sm">
              {steps.map((step, idx) => (
                <div
                  key={step}
                  className={`px-3 py-2 rounded-lg ${idx === 3 ? 'bg-primary/10 text-primary font-semibold' : 'text-base-content/60'}`}
                >
                  {step}
                </div>
              ))}
            </nav>
          </aside>

          <section className="flex-1">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6 md:p-8 space-y-4"
            >
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">Documentos requeridos</h1>
                <p className="text-base-content/70">
                  Marca y sube cada documento. Se guardan en Supabase Storage (bucket onboarding-docs).
                </p>
              </div>

              <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-3 text-sm">
                {(
                  [
                    { key: 'constitutivo', label: 'Acta constitutiva / Registro mercantil' },
                    { key: 'rnc', label: 'Comprobante RNC / DGII' },
                    { key: 'ubo', label: 'Declaración de beneficiarios finales' },
                    { key: 'address', label: 'Comprobante de dirección' },
                  ] as const
                ).map((item) => (
                  <div key={item.key} className="flex flex-col gap-2 border border-base-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={docChecks[item.key]}
                        readOnly
                      />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm bg-base-200 border-base-300"
                        onClick={() => triggerInput(item.key)}
                        disabled={uploading === item.key}
                      >
                        {uploading === item.key ? 'Subiendo...' : 'Subir archivo'}
                      </button>
                      {uploads[item.key] && (
                        <a href={uploads[item.key]} target="_blank" rel="noreferrer" className="link text-sm">
                          Ver archivo
                        </a>
                      )}
                    </div>
                    <input
                      ref={(el) => {
                        if (!fileInputs.current) fileInputs.current = {}
                        fileInputs.current[item.key] = el
                      }}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(item.key, e.target.files)}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-error">{error}</p>}

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-base-content/60">Paso 4 de 6</div>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleBack}>
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-primary-content"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Siguiente'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
