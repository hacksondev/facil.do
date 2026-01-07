import {
  Account,
  Alert,
  Company,
  LivenessSession,
  OnboardingCase,
  Person,
  Transaction,
} from '../api/mock/data'

export type { Account, Alert, Company, LivenessSession, OnboardingCase, Person, Transaction }

export const apiBase =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export async function fetchMock<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Error al cargar ${path}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function formatCurrency(amount: number, currency: 'DOP' | 'USD') {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(date))
}

export function riskColor(level: Company['riskLevel']) {
  const map = {
    low: 'bg-success/10 text-success border-success/30',
    medium: 'bg-warning/10 text-warning border-warning/30',
    high: 'bg-error/10 text-error border-error/30',
  }
  return map[level]
}

export function statusBadge(status: OnboardingCase['status']) {
  const map = {
    collecting: 'bg-base-200 text-base-content border-base-300',
    pending_review: 'bg-warning/10 text-warning border-warning/30',
    approved: 'bg-success/10 text-success border-success/30',
    rejected: 'bg-error/10 text-error border-error/30',
  }
  return map[status]
}
