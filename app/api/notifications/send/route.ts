import { NextResponse } from 'next/server'
import { Resend, type CreateEmailOptions } from 'resend'

export const runtime = 'nodejs'

const resendKey = process.env.RESEND_API_KEY
const defaultFrom = process.env.EMAIL_FROM || 'no-reply@example.com'

export async function POST(req: Request) {
  if (!resendKey) {
    return NextResponse.json({ error: 'Falta RESEND_API_KEY en el entorno' }, { status: 500 })
  }

  let payload: { to?: string; subject?: string; html?: string; text?: string }
  try {
    payload = (await req.json()) as typeof payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const { to, subject, html, text } = payload
  const bodyHtml = html?.trim()
  const bodyText = text?.trim()

  if (!to || !subject || (!bodyHtml && !bodyText)) {
    return NextResponse.json({ error: 'Faltan campos requeridos (to, subject, html/text)' }, { status: 400 })
  }

  const resend = new Resend(resendKey)

  try {
    const emailPayload: CreateEmailOptions = bodyHtml
      ? { from: defaultFrom, to, subject, html: bodyHtml }
      : { from: defaultFrom, to, subject, text: bodyText as string }

    const { error } = await resend.emails.send(emailPayload)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Error enviando correo Resend', err)
    const message = err?.message ?? 'No se pudo enviar'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
