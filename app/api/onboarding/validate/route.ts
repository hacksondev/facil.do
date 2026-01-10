import { NextResponse } from 'next/server'
import supabaseService from '../../../services/supabaseService'

export const runtime = 'nodejs'

type ValidationRequest = {
  email?: string
  rnc?: string
}

export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el entorno' },
      { status: 500 },
    )
  }

  let body: ValidationRequest = {}
  try {
    body = (await request.json()) as ValidationRequest
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const rncRaw = body.rnc?.trim()

  if (!email && !rncRaw) {
    return NextResponse.json({ error: 'Se requiere email o RNC para validar' }, { status: 400 })
  }

  const conflicts: { email?: boolean; rnc?: boolean } = {}

  try {
    if (email) {
      const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      if (!isEmailFormatValid) {
        return NextResponse.json({ error: 'Correo inválido' }, { status: 400 })
      }

      const { data: existingUser, error: emailError } = await supabaseService
        .schema('auth')
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (emailError && emailError.code !== 'PGRST116') throw emailError
      if (existingUser) {
        conflicts.email = true
      }
    }

    if (rncRaw) {
      const normalizedRnc = rncRaw.replace(/[^0-9]/g, '')

      const { data: rncExact, error: rncErrorExact } = await supabaseService
        .from('companies')
        .select('id')
        .eq('rnc', rncRaw)
        .maybeSingle()

      if (rncErrorExact && rncErrorExact.code !== 'PGRST116') {
        throw rncErrorExact
      }

      if (rncExact) {
        conflicts.rnc = true
      } else if (normalizedRnc && normalizedRnc !== rncRaw) {
        const { data: rncNormalized, error: rncErrorNorm } = await supabaseService
          .from('companies')
          .select('id')
          .eq('rnc', normalizedRnc)
          .maybeSingle()

        if (rncErrorNorm && rncErrorNorm.code !== 'PGRST116') {
          throw rncErrorNorm
        }
        if (rncNormalized) {
          conflicts.rnc = true
        }
      }
    }

    if (conflicts.email || conflicts.rnc) {
      return NextResponse.json(
        {
          error: 'Conflicto de duplicado',
          conflicts,
          message: conflicts.email
            ? 'El correo ya está registrado. Usa otro correo o inicia sesión.'
            : 'Ya existe una empresa con este RNC.',
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ ok: true, conflicts })
  } catch (err: any) {
    console.error('Error validando onboarding:', err)
    return NextResponse.json(
      {
        error: 'No se pudo validar duplicados. Intenta de nuevo o contacta soporte.',
        details: err?.message,
      },
      { status: 500 },
    )
  }
}
