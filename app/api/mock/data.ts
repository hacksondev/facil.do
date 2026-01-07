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
  {
    id: 'per_001',
    fullName: 'Laura Espinal',
    documentNumber: '402-0012345-6',
    documentType: 'cedula',
    nationality: 'DO',
    pep: false,
    createdAt: '2024-06-02T14:20:00Z',
  },
  {
    id: 'per_002',
    fullName: 'Diego Fernandez',
    documentNumber: '402-0045678-9',
    documentType: 'cedula',
    nationality: 'DO',
    pep: false,
    createdAt: '2024-05-21T11:45:00Z',
  },
  {
    id: 'per_003',
    fullName: 'Elena Vargas',
    documentNumber: 'P-A1234567',
    documentType: 'passport',
    nationality: 'ES',
    pep: true,
    createdAt: '2024-04-10T09:10:00Z',
  },
];

const livenessSessions: LivenessSession[] = [
  {
    id: 'liv_001',
    personId: 'per_001',
    provider: 'veriff',
    sessionRef: 'VRF-9XY2',
    score: 0.92,
    passed: true,
    createdAt: '2024-06-02T14:25:00Z',
    expiresAt: '2024-06-02T15:25:00Z',
  },
  {
    id: 'liv_002',
    personId: 'per_002',
    provider: 'veriff',
    sessionRef: 'VRF-4GH1',
    score: 0.87,
    passed: true,
    createdAt: '2024-05-21T11:50:00Z',
    expiresAt: '2024-05-21T12:50:00Z',
  },
  {
    id: 'liv_003',
    personId: 'per_003',
    provider: 'veriff',
    sessionRef: 'VRF-7JK8',
    score: 0.61,
    passed: false,
    createdAt: '2024-04-10T09:20:00Z',
    expiresAt: '2024-04-10T10:20:00Z',
  },
];

const companies: Company[] = [
  {
    id: 'comp_001',
    name: 'Caribe Foods SRL',
    rnc: '131234567',
    sector: 'Alimentos y bebidas',
    country: 'DO',
    riskLevel: 'medium',
    onboardingStage: 'pending_review',
    ownerPersonId: 'per_001',
    createdAt: '2024-06-02T14:15:00Z',
  },
  {
    id: 'comp_002',
    name: 'Antillas Tech SAS',
    rnc: '130987654',
    sector: 'Tecnología',
    country: 'DO',
    riskLevel: 'low',
    onboardingStage: 'approved',
    ownerPersonId: 'per_002',
    createdAt: '2024-05-21T11:40:00Z',
  },
  {
    id: 'comp_003',
    name: 'Logistica Quisqueya SRL',
    rnc: '132233445',
    sector: 'Logística',
    country: 'DO',
    riskLevel: 'high',
    onboardingStage: 'collecting',
    ownerPersonId: 'per_003',
    createdAt: '2024-04-10T09:05:00Z',
  },
];

const onboardingCases: OnboardingCase[] = [
  {
    id: 'case_001',
    companyId: 'comp_001',
    status: 'pending_review',
    reviewer: 'compliance_01',
    decisionReason: 'Esperando screening PEP/sanciones',
    riskScore: 63,
    updatedAt: '2024-06-02T14:30:00Z',
  },
  {
    id: 'case_002',
    companyId: 'comp_002',
    status: 'approved',
    reviewer: 'compliance_02',
    decisionReason: 'Documentación completa y riesgo bajo',
    riskScore: 28,
    updatedAt: '2024-05-21T12:00:00Z',
  },
  {
    id: 'case_003',
    companyId: 'comp_003',
    status: 'collecting',
    decisionReason: 'Falta completar liveness y cédula',
    riskScore: 77,
    updatedAt: '2024-04-10T09:25:00Z',
  },
];

const accounts: Account[] = [
  {
    id: 'acc_001',
    companyId: 'comp_001',
    type: 'checking',
    currency: 'DOP',
    number: '3220012345',
    alias: 'caribe-checking',
    balance: 1523400.5,
    status: 'active',
    limits: { daily: 1500000, monthly: 5000000 },
    updatedAt: '2024-06-06T10:00:00Z',
  },
  {
    id: 'acc_002',
    companyId: 'comp_001',
    type: 'savings',
    currency: 'USD',
    number: '5123498765',
    alias: 'caribe-savings',
    balance: 48250.25,
    status: 'active',
    limits: { daily: 100000, monthly: 400000 },
    updatedAt: '2024-06-05T16:00:00Z',
  },
  {
    id: 'acc_003',
    companyId: 'comp_002',
    type: 'checking',
    currency: 'DOP',
    number: '4330088123',
    alias: 'antillas-main',
    balance: 823400.0,
    status: 'active',
    limits: { daily: 1000000, monthly: 3500000 },
    updatedAt: '2024-05-28T09:00:00Z',
  },
  {
    id: 'acc_004',
    companyId: 'comp_003',
    type: 'checking',
    currency: 'DOP',
    number: '7550022119',
    alias: 'quisqueya-flow',
    balance: 10500.75,
    status: 'blocked',
    limits: { daily: 250000, monthly: 750000 },
    updatedAt: '2024-04-15T15:00:00Z',
  },
];

const transactions: Transaction[] = [
  {
    id: 'tx_001',
    accountId: 'acc_001',
    type: 'debit',
    amount: 230000.0,
    currency: 'DOP',
    counterparty: 'Proveedor Caribe Import',
    description: 'Pago factura 1045',
    status: 'settled',
    createdAt: '2024-06-05T13:10:00Z',
  },
  {
    id: 'tx_002',
    accountId: 'acc_001',
    type: 'credit',
    amount: 540000.0,
    currency: 'DOP',
    counterparty: 'Supermercados ABC',
    description: 'Cobro ACH',
    status: 'settled',
    createdAt: '2024-06-04T09:30:00Z',
  },
  {
    id: 'tx_003',
    accountId: 'acc_002',
    type: 'credit',
    amount: 15000.5,
    currency: 'USD',
    counterparty: 'Exportadora Andina',
    description: 'Wire entrante',
    status: 'pending',
    createdAt: '2024-06-06T08:15:00Z',
  },
  {
    id: 'tx_004',
    accountId: 'acc_003',
    type: 'debit',
    amount: 125000.0,
    currency: 'DOP',
    counterparty: 'Servicios Nube Caribe',
    description: 'Pago suscripción anual',
    status: 'settled',
    createdAt: '2024-05-27T17:00:00Z',
  },
  {
    id: 'tx_005',
    accountId: 'acc_004',
    type: 'debit',
    amount: 5000.0,
    currency: 'DOP',
    counterparty: 'Transporte del Norte',
    description: 'Gasto combustible',
    status: 'reversed',
    createdAt: '2024-04-14T11:30:00Z',
  },
];

const alerts: Alert[] = [
  {
    id: 'al_001',
    type: 'aml',
    severity: 'medium',
    status: 'open',
    entityType: 'company',
    entityId: 'comp_001',
    message: 'Empresa con alerta media por volumen vs antigüedad.',
    createdAt: '2024-06-05T14:00:00Z',
  },
  {
    id: 'al_002',
    type: 'transaction',
    severity: 'high',
    status: 'open',
    entityType: 'transaction',
    entityId: 'tx_003',
    message: 'Wire USD pendiente requiere revisión de documentos.',
    createdAt: '2024-06-06T08:20:00Z',
  },
  {
    id: 'al_003',
    type: 'liveness',
    severity: 'medium',
    status: 'resolved',
    entityType: 'person',
    entityId: 'per_003',
    message: 'Prueba de vida fallida, se solicitó reintento.',
    createdAt: '2024-04-10T09:25:00Z',
  },
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
