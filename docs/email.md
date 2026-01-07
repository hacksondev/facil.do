# Sistema de correos transaccionales

Guía rápida para habilitar envíos de correo (estado de onboarding, verificación y notificaciones) en el proyecto Next.js.

## Proveedor recomendado
- **Resend** (simple, sin DNS compleja para pruebas, soporta dominio o sandbox).
- Alternativas: Postmark, AWS SES (revisar cumplimiento local RD si usas otro).

## Variables de entorno (ejemplo Resend)
```
RESEND_API_KEY=...
EMAIL_FROM=no-reply@tudominio.com
EMAIL_SUPPORT=soporte@tudominio.com
```

## Instalación
```
npm install resend
```

## API route de envío (ya creada)
Ubicación: `app/api/notifications/send/route.ts`
```ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Falta RESEND_API_KEY' }, { status: 500 })
  }

  const { to, subject, html, text } = (await req.json()) as { to: string; subject: string; html?: string; text?: string }
  const bodyHtml = html?.trim()
  const bodyText = text?.trim()

  if (!to || !subject || (!bodyHtml && !bodyText)) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  try {
    const payload =
      bodyHtml
        ? { from: process.env.EMAIL_FROM || 'no-reply@example.com', to, subject, html: bodyHtml }
        : { from: process.env.EMAIL_FROM || 'no-reply@example.com', to, subject, text: bodyText as string }

    const { error } = await resend.emails.send(payload)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Error enviando correo', err)
    return NextResponse.json({ error: 'No se pudo enviar' }, { status: 500 })
  }
}
```

## Hooks de negocio sugeridos
- Onboarding: al finalizar /complete enviar “Solicitud en verificación” al usuario y a operaciones.
- Documentos aprobados/rechazados: enviar resultado y próximos pasos.
- Depósito inicial acreditado: enviar confirmación y acceso al backoffice.
- Recuperación de contraseña y verificación de correo: usar flujos nativos de Supabase Auth o enlazar a este API.

## Buenas prácticas
- Usa plantillas HTML simples (MJML/React email opcional). Mantén texto en español y menciona DOP como moneda.
- Registra intentos en una tabla `notifications` (Supabase) si necesitas trazabilidad (status, tipo, destinatario, payload).
- Configura DKIM/SPF para el dominio productivo; en sandbox usa el dominio de prueba del proveedor.
- No llames al API de correo desde el cliente; siempre desde rutas API / server actions para no exponer la API key.

## Pruebas locales
- Con Resend sandbox: envía a direcciones verificadas o usa el modo test del panel.
- Alternativa: MailDev/Mailhog en Docker si prefieres SMTP local (requiere configurar otro transport).
