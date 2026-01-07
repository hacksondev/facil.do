/**
 * Cliente de Supabase para uso en el servidor (service role).
 * Usa SUPABASE_SERVICE_ROLE_KEY, no exponer en el cliente.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Faltan variables SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL para operaciones de servidor.')
}

export const supabaseService = createClient(supabaseUrl || '', serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export default supabaseService
