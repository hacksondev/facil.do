'use client'

/**
 * Inicializa Firebase y Analytics para el proyecto web.
 * Incluye guardas para evitar errores en SSR y reutiliza la instancia ya creada.
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCjlj_203SRkWb-3Ms4hEY0A-WMqpBVxJs',
  authDomain: 'facildo-82ced.firebaseapp.com',
  projectId: 'facildo-82ced',
  storageBucket: 'facildo-82ced.firebasestorage.app',
  messagingSenderId: '485351635508',
  appId: '1:485351635508:web:b23d5a1b06655a23036861',
  measurementId: 'G-1SF8CB3B69',
}

let firebaseApp: FirebaseApp | null = null
let analyticsInstance: Analytics | null = null

function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
  }
  return firebaseApp
}

export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null
  if (analyticsInstance) return analyticsInstance

  const supported = await isSupported().catch(() => false)
  if (!supported) return null

  analyticsInstance = getAnalytics(getFirebaseApp())
  return analyticsInstance
}

export async function logFirebaseEvent(
  eventName: string,
  params?: Record<string, unknown>
): Promise<void> {
  const analytics = await initFirebaseAnalytics()
  if (!analytics) return
  logEvent(analytics, eventName, params)
}
