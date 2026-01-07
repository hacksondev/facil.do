'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function OnboardingCompletePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const firstName = searchParams.get('firstName') ?? ''
  const lastName = searchParams.get('lastName') ?? ''
  const email = searchParams.get('email') ?? ''
  const companyName = searchParams.get('companyName') ?? ''
  const rnc = searchParams.get('rnc') ?? ''
  const livenessScore = searchParams.get('livenessScore')

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
        <div className="w-full max-w-2xl rounded-2xl border border-base-300 bg-base-100 shadow-sm p-6 md:p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Solicitud en verificación</h1>
            <p className="text-base-content/70">
              Recibimos tu información. Estamos verificando tus datos y te notificaremos por correo cuando tu cuenta esté lista.
            </p>
          </div>
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-sm space-y-2 text-left">
            <p><span className="font-semibold">Aplicante:</span> {firstName} {lastName} · {email || 'sin email'}</p>
            {companyName && <p><span className="font-semibold">Empresa:</span> {companyName}</p>}
            {rnc && <p><span className="font-semibold">RNC:</span> {rnc}</p>}
            {livenessScore && <p><span className="font-semibold">Prueba de vida:</span> aprobada (score {parseFloat(livenessScore).toFixed(2)})</p>}
          </div>
          <button className="btn btn-primary text-primary-content" onClick={() => router.push('/backoffice/login')}>
            Volver al login
          </button>
        </div>
      </main>
    </div>
  )
}
