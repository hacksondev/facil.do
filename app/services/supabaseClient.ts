/**
 * Cliente de Supabase para la aplicación
 *
 * Este archivo configura e inicializa el cliente de Supabase
 * usando las variables de entorno del proyecto.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Tipos para la tabla waitlist
export interface WaitlistEntry {
  id?: string
  company_name: string
  contact_name: string
  email: string
  business_type: string
  created_at?: string
}

export type WaitlistInsert = Omit<WaitlistEntry, 'id' | 'created_at'>

// Validación de variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Variables de entorno de Supabase no configuradas. ' +
    'Asegúrate de crear el archivo .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

// Crear cliente de Supabase
export const supabase: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        'x-application-name': 'facil-do-landing',
      },
    },
  }
)

/**
 * Función helper para insertar en el waitlist
 * Incluye manejo de errores para emails duplicados
 */
export async function insertWaitlistEntry(
  entry: WaitlistInsert
): Promise<{ data: WaitlistEntry | null; error: string | null }> {
  try {
    // Primero verificamos si el email ya existe
    const { data: existing } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', entry.email.toLowerCase().trim())
      .single()

    if (existing) {
      return {
        data: null,
        error: 'Este email ya está registrado en el waitlist',
      }
    }

    // Insertar el nuevo registro
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        company_name: entry.company_name,
        contact_name: entry.contact_name,
        email: entry.email.toLowerCase().trim(),
        business_type: entry.business_type,
      })
      .select()
      .single()

    if (error) {
      // Manejo específico para error de duplicado (por si la verificación falla)
      if (error.code === '23505') {
        return {
          data: null,
          error: 'Este email ya está registrado en el waitlist',
        }
      }
      throw error
    }

    return { data: data as WaitlistEntry, error: null }
  } catch (err) {
    console.error('Error al insertar en waitlist:', err)
    return {
      data: null,
      error: 'Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.',
    }
  }
}

export default supabase
