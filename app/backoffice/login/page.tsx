export const metadata = {
  title: 'Login Backoffice - Facil.do',
}

import LoginForm from './LoginForm'

export default function BackofficeLoginPage() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-primary/80 uppercase tracking-wide">Backoffice</p>
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
          <p className="text-sm text-base-content/70">
            Ingresa para acceder al internet banking empresarial.
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-base-content/60 space-y-1">
          <p>Mock creds: ops@facil.do / demo123</p>
          <p>¿No tienes acceso? Contacta a tu administrador de backoffice.</p>
        </div>
      </div>
    </div>
  )
}
