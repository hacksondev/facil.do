import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import supabaseService from '../../../services/supabaseService'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const docType = (formData.get('docType') as string | null) ?? 'documento'
  const companyId = formData.get('companyId') as string | null
  const personId = formData.get('personId') as string | null

  if (!file) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el entorno' }, { status: 500 })
  }

  try {
    const bucket = 'onboarding-docs'
    const safeDocType = docType
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    const folder = safeDocType.length ? safeDocType : 'documento'
    const safeName = file.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.\-_]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    const path = `${folder}/${randomUUID()}-${safeName}`
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabaseService.storage
      .from(bucket)
      .upload(path, Buffer.from(arrayBuffer), {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/octet-stream',
      })
    if (uploadError) throw uploadError

    const { data: publicData } = supabaseService.storage.from(bucket).getPublicUrl(path)
    const publicUrl = publicData?.publicUrl
    if (!publicUrl) throw new Error('No se pudo obtener URL pública')

    const { error: insertError } = await supabaseService.from('documents').insert({
      company_id: companyId,
      person_id: personId,
      type: docType,
      url: publicUrl,
      status: 'uploaded',
    })
    if (insertError) throw insertError

    return NextResponse.json({ url: publicUrl })
  } catch (err: any) {
    console.error('Error subiendo documento:', err)
    const message = err?.message ?? 'No se pudo subir'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
