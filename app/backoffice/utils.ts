export type Company = {
  id: string
  name: string
  rnc: string
  country: string
  sector: string
  riskLevel: 'low' | 'medium' | 'high'
  onboardingStage: 'collecting' | 'pending_review' | 'approved' | 'rejected'
  ownerPersonId: string
  createdAt: string
  industry?: string
  phone?: string
  accountsMenu?: { id: string; number?: string; alias?: string; type: 'checking' | 'savings' }[]
}

export type Account = {
  id: string
  companyId: string
  type: 'checking' | 'savings'
  currency: 'DOP' | 'USD'
  number: string
  alias: string
  balance: number
  status: 'active' | 'blocked' | 'pending_activation'
  limits?: { daily: number; monthly: number }
  createdAt?: string
}

export type Transaction = {
  id: string
  accountId: string
  type: 'credit' | 'debit'
  amount: number
  currency: 'DOP' | 'USD'
  counterparty: string
  description: string
  status: 'pending' | 'settled' | 'reversed'
  createdAt: string
}

export type Alert = {
  id: string
  type: 'aml' | 'transaction' | 'liveness' | 'kyc'
  severity: 'low' | 'medium' | 'high'
  status: 'open' | 'resolved' | 'in_progress' | 'dismissed'
  entityType: string
  entityId: string
  message: string
  createdAt: string
}

export type OnboardingCase = {
  id: string
  companyId: string
  status: 'collecting' | 'pending_review' | 'approved' | 'rejected'
  reviewer?: string
  decisionReason?: string
  riskScore?: number
  updatedAt?: string
  createdAt?: string
}

export type Person = {
  id: string
  fullName: string
  documentNumber: string
  documentType: 'cedula' | 'passport'
  nationality: string
  pep: boolean
  createdAt: string
}

export type LivenessSession = {
  id: string
  personId: string
  provider: string
  sessionRef?: string
  score: number
  passed?: boolean
  createdAt: string
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
