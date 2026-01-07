'use client'

/**
 * Provider de Redux para Next.js App Router
 *
 * Este componente envuelve la aplicación y proporciona
 * acceso al store de Redux en todos los componentes cliente.
 */

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './store'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Crear store una sola vez usando useRef
  const storeRef = useRef<AppStore>()

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
