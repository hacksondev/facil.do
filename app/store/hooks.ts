/**
 * Hooks tipados para Redux
 *
 * Usar estos hooks en lugar de useDispatch y useSelector
 * para obtener tipado correcto en toda la aplicación.
 */

import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppStore, RootState, AppDispatch } from './store'

// Hook tipado para dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

// Hook tipado para selector
export const useAppSelector = useSelector.withTypes<RootState>()

// Hook tipado para store
export const useAppStore = useStore.withTypes<AppStore>()
