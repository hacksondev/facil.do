/**
 * Redux Slice para el manejo del Waitlist
 *
 * Maneja los estados: idle, loading, success, error
 * Incluye AsyncThunk para comunicación con Supabase
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { insertWaitlistEntry, WaitlistEntry } from '../services/supabaseClient'

// Tipos para el formulario
export interface WaitlistFormData {
  company_name: string
  contact_name: string
  email: string
  business_type: string
}

// Estados posibles del waitlist
export type WaitlistStatus = 'idle' | 'loading' | 'success' | 'error'

// Estado inicial del slice
export interface WaitlistState {
  status: WaitlistStatus
  error: string | null
  successMessage: string | null
  submittedEmail: string | null
}

const initialState: WaitlistState = {
  status: 'idle',
  error: null,
  successMessage: null,
  submittedEmail: null,
}

/**
 * AsyncThunk para enviar datos al waitlist de Supabase
 *
 * Maneja:
 * - Validación de datos
 * - Envío a Supabase
 * - Manejo de errores (incluyendo duplicados)
 */
export const submitWaitlist = createAsyncThunk<
  WaitlistEntry,
  WaitlistFormData,
  { rejectValue: string }
>(
  'waitlist/submit',
  async (formData, { rejectWithValue }) => {
    // Validación adicional del lado del cliente
    if (!formData.email || !formData.company_name || !formData.contact_name || !formData.business_type) {
      return rejectWithValue('Por favor completa todos los campos')
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return rejectWithValue('Por favor ingresa un email válido')
    }

    // Intentar insertar en Supabase
    const { data, error } = await insertWaitlistEntry({
      company_name: formData.company_name.trim(),
      contact_name: formData.contact_name.trim(),
      email: formData.email.toLowerCase().trim(),
      business_type: formData.business_type,
    })

    if (error) {
      return rejectWithValue(error)
    }

    if (!data) {
      return rejectWithValue('Error inesperado al procesar la solicitud')
    }

    return data
  }
)

/**
 * Slice del Waitlist
 */
const waitlistSlice = createSlice({
  name: 'waitlist',
  initialState,
  reducers: {
    // Reset del estado (útil si el usuario quiere volver a intentar)
    resetWaitlistState: (state) => {
      state.status = 'idle'
      state.error = null
      state.successMessage = null
    },
    // Limpiar solo el error
    clearError: (state) => {
      state.error = null
      if (state.status === 'error') {
        state.status = 'idle'
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Caso: Iniciando envío
      .addCase(submitWaitlist.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.successMessage = null
      })
      // Caso: Envío exitoso
      .addCase(submitWaitlist.fulfilled, (state, action: PayloadAction<WaitlistEntry>) => {
        state.status = 'success'
        state.error = null
        state.submittedEmail = action.payload.email
        state.successMessage = '¡Gracias por tu interés! Te contactaremos pronto.'
      })
      // Caso: Error en el envío
      .addCase(submitWaitlist.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload || 'Ocurrió un error inesperado'
        state.successMessage = null
      })
  },
})

// Exportar acciones
export const { resetWaitlistState, clearError } = waitlistSlice.actions

// Selector para obtener el estado del waitlist
export const selectWaitlistStatus = (state: { waitlist: WaitlistState }) =>
  state.waitlist.status

export const selectWaitlistError = (state: { waitlist: WaitlistState }) =>
  state.waitlist.error

export const selectWaitlistSuccess = (state: { waitlist: WaitlistState }) =>
  state.waitlist.successMessage

// Exportar reducer
export default waitlistSlice.reducer
