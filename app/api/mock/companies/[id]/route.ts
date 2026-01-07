import { NextResponse } from 'next/server';
import { mockDb } from '../../data';

type Params = {
  params: {
    id: string;
  };
};

export function GET(_request: Request, { params }: Params) {
  const company = mockDb.companies.find((item) => item.id === params.id);

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const onboardingCase = mockDb.onboardingCases.find((item) => item.companyId === company.id);
  const accounts = mockDb.accounts.filter((item) => item.companyId === company.id);
  const accountIds = accounts.map((item) => item.id);
  const transactions = mockDb.transactions.filter((item) => accountIds.includes(item.accountId));
  const alerts = mockDb.alerts.filter((item) => item.entityId === company.id);
  const owner = mockDb.persons.find((person) => person.id === company.ownerPersonId);
  const livenessSessions = owner
    ? mockDb.livenessSessions.filter((session) => session.personId === owner.id)
    : [];

  return NextResponse.json({
    company,
    onboardingCase,
    owner,
    livenessSessions,
    accounts,
    transactions,
    alerts,
  });
}
