export type MockUser = {
  email: string
  password: string
  role: 'ops' | 'compliance' | 'admin'
  name: string
  token: string
}

export const mockUsers: MockUser[] = [
  {
    email: 'ops@facil.do',
    password: 'demo123',
    role: 'ops',
    name: 'Operaciones Facil.do',
    token: 'mock-ops',
  },
  {
    email: 'compliance@facil.do',
    password: 'demo123',
    role: 'compliance',
    name: 'Oficial de Cumplimiento',
    token: 'mock-compliance',
  },
  {
    email: 'admin@facil.do',
    password: 'demo123',
    role: 'admin',
    name: 'Admin Backoffice',
    token: 'mock-admin',
  },
]
