export type Person = {
  id: string;
  fullName: string;
  documentNumber: string;
  documentType: 'cedula' | 'passport';
  nationality: string;
  pep: boolean;
  createdAt: string;
};

export type LivenessSession = {
  id: string;
  personId: string;
  provider: string;
  sessionRef: string;
  score: number;
  passed: boolean;
  createdAt: string;
  expiresAt: string;
};

export type Company = {
  id: string;
  name: string;
  rnc: string;
  sector: string;
  country: string;
  riskLevel: 'low' | 'medium' | 'high';
  onboardingStage: 'collecting' | 'pending_review' | 'approved' | 'rejected';
  ownerPersonId: string;
  createdAt: string;
};

export type OnboardingCase = {
  id: string;
  companyId: string;
  status: 'collecting' | 'pending_review' | 'approved' | 'rejected';
  reviewer?: string;
  decisionReason?: string;
  riskScore: number;
  updatedAt: string;
};

export type Account = {
  id: string;
  companyId: string;
  type: 'checking' | 'savings';
  currency: 'DOP' | 'USD';
  number: string;
  alias: string;
  balance: number;
  status: 'active' | 'blocked';
  limits: {
    daily: number;
    monthly: number;
  };
  updatedAt: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: 'DOP' | 'USD';
  counterparty: string;
  description: string;
  status: 'pending' | 'settled' | 'reversed';
  createdAt: string;
};

export type Alert = {
  id: string;
  type: 'aml' | 'transaction' | 'liveness';
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
  entityType: 'company' | 'transaction' | 'person';
  entityId: string;
  message: string;
  createdAt: string;
};

type MockDb = {
  persons: Person[];
  livenessSessions: LivenessSession[];
  companies: Company[];
  onboardingCases: OnboardingCase[];
  accounts: Account[];
  transactions: Transaction[];
  alerts: Alert[];
};

const persons: Person[] = [

];

const livenessSessions: LivenessSession[] = [

];

const companies: Company[] = [

];

const onboardingCases: OnboardingCase[] = [

];

const accounts: Account[] = [

];

const transactions: Transaction[] = [

];

const alerts: Alert[] = [

];

export const mockDb: MockDb = {
  persons,
  livenessSessions,
  companies,
  onboardingCases,
  accounts,
  transactions,
  alerts,
};
