'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const steps = [
  'Información de la empresa',
  'Dirección',
  'Propietarios',
  'Documentos',
  'Actividad esperada',
  'Preguntas adicionales',
]

export default function CompanyInfoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [legalName, setLegalName] = useState(searchParams.get('companyName') ?? '')
  const [dba, setDba] = useState(false)
  const [country, setCountry] = useState('República Dominicana')
  const [phone, setPhone] = useState(searchParams.get('phone') ?? '+1 809 000 0000')
  const [rnc, setRnc] = useState(searchParams.get('rnc') ?? '')
  const [website, setWebsite] = useState(searchParams.get('website') ?? '')
  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [industry, setIndustry] = useState(searchParams.get('industry') ?? '')
  const [description, setDescription] = useState(searchParams.get('description') ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const firstName = searchParams.get('firstName') ?? ''
  const lastName = searchParams.get('lastName') ?? ''
  const email = searchParams.get('email') ?? ''
  const initialCaseId = searchParams.get('caseId') ?? ''
  const initialCompanyId = searchParams.get('companyId') ?? ''
  const [caseId, setCaseId] = useState(initialCaseId)
  const [companyId, setCompanyId] = useState(initialCompanyId)

  const formatRnc = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9) // RNC RD: 9 dígitos
    const part1 = digits.slice(0, 1)
    const part2 = digits.slice(1, 3)
    const part3 = digits.slice(3, 8)
    const part4 = digits.slice(8, 9)
    let formatted = part1
    if (part2) formatted += `-${part2}`
    if (part3) formatted += `-${part3}`
    if (part4) formatted += `-${part4}`
    return formatted
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const validateRes = await fetch('/api/onboarding/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Solo validar RNC en este paso; el correo se valida en crear cuenta
        body: JSON.stringify({ rnc }),
      })
      if (!validateRes.ok) {
        const body = await validateRes.json().catch(() => ({}))
        if (validateRes.status === 409 && body.conflicts?.rnc) {
          setError(body.message ?? 'Ya existe una empresa con este RNC.')
          setLoading(false)
          return
        }
        if (validateRes.status === 409 && body.conflicts?.email) {
          setError(body.message ?? 'Este correo ya está registrado.')
          setLoading(false)
          return
        }
        const detail = body.details ? ` Detalle: ${body.details}` : ''
        throw new Error((body.error ?? 'No se pudo validar duplicados') + detail)
      }

      const saveRes = await fetch('/api/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'company_info',
          caseId,
          companyId,
          data: {
            companyName: legalName,
            rnc,
            country,
            phone,
            industry,
            description,
          },
        }),
      })

      if (!saveRes.ok) {
        const body = await saveRes.json().catch(() => ({}))
        throw new Error(body.error ?? 'No se pudo guardar la empresa')
      }

      const body = await saveRes.json()
      const newCaseId = body.caseId as string
      const newCompanyId = body.companyId as string
      setCaseId(newCaseId)
      setCompanyId(newCompanyId)

      const params = new URLSearchParams()
      params.set('firstName', firstName)
      params.set('lastName', lastName)
      params.set('email', email)
      params.set('companyName', legalName)
      params.set('rnc', rnc)
      params.set('country', country)
      params.set('phone', phone)
      params.set('industry', industry)
      params.set('description', description)
      if (newCaseId) params.set('caseId', newCaseId)
      if (newCompanyId) params.set('companyId', newCompanyId)
      router.push(`/backoffice/onboarding/company-address?${params.toString()}`)
    } catch (err: any) {
      console.error('Error validando RNC/correo:', err)
      setError(err?.message ?? 'No se pudo validar duplicados')
      setLoading(false)
    }
  }

  const handleBack = () => {
    const params = new URLSearchParams()
    params.set('firstName', firstName)
    params.set('lastName', lastName)
    params.set('email', email)
    if (caseId) params.set('caseId', caseId)
    if (companyId) params.set('companyId', companyId)
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

      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
          <aside className="md:w-56 flex-shrink-0 space-y-3">
            <p className="text-sm font-medium text-primary">1 / 6</p>
            <nav className="space-y-2 text-sm">
              {steps.map((step, idx) => (
                <div
                  key={step}
                  className={`px-3 py-2 rounded-lg ${idx === 0 ? 'bg-primary/10 text-primary font-semibold' : 'text-base-content/60'}`}
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
                <h1 className="text-2xl font-semibold">Información de la empresa</h1>
                <p className="text-base-content/70">Cuéntanos sobre tu empresa para iniciar la verificación.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Nombre legal</span>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="Facil.do SRL"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={dba}
                    onChange={() => setDba((v) => !v)}
                  />
                  <span>Mi empresa usa un nombre comercial (DBA) o tuvo cambio de nombre.</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">País de constitución</span>
                    <select
                      className="select select-bordered w-full"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option>República Dominicana</option>
                    </select>
                  </label>
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">Teléfono</span>
                    <input
                      type="text"
                      required
                      className="input input-bordered w-full"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 809 000 0000"
                    />
                  </label>
                </div>

                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">RNC / EIN</span>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={rnc}
                    onChange={(e) => setRnc(formatRnc(e.target.value))}
                    placeholder="1-23-45678-9"
                  />
                  <span className="text-xs text-base-content/60 mt-1">Formato RD: 9 dígitos (ej. 1-23-45678-9)</span>
                </label>

                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Sitio web (opcional)</span>
                  <input
                    type="url"
                    className="input input-bordered w-full"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://miempresa.com"
                  />
                </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Tipo de empresa</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      placeholder="SRL / SAS / INC"
                    />
                  </label>
                  <label className="form-control w-full">
                    <span className="label-text text-sm font-medium">Industria</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Tecnología, Retail, Logística..."
                    />
                  </label>
                </div>

                <label className="form-control w-full">
                  <span className="label-text text-sm font-medium">Descripción</span>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe qué hace tu empresa y cómo usa la cuenta."
                  />
                </label>
              </div>

              {error && <p className="text-sm text-error">{error}</p>}

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-base-content/60">
                  Paso 1 de 6 · Completa para continuar.
                </div>
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
