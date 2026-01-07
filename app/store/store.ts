/**
 * Configuración del Redux Store
 *
 * Store principal de la aplicación usando Redux Toolkit.
 * Incluye el slice del waitlist para manejo de formulario.
 */

import { configureStore } from '@reduxjs/toolkit'
import waitlistReducer from './waitlistSlice'

/**
 * Crear y configurar el store de Redux
 */
export const makeStore = () => {
  return configureStore({
    reducer: {
      waitlist: waitlistReducer,
    },
    // Configuración de middleware por defecto de RTK
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Desactivar serializable check para evitar warnings con Supabase
        serializableCheck: {
          ignoredActions: ['waitlist/submit/pending', 'waitlist/submit/fulfilled', 'waitlist/submit/rejected'],
        },
      }),
    // Habilitar DevTools solo en desarrollo
    devTools: process.env.NODE_ENV !== 'production',
  })
}

// Tipos inferidos del store
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
