import { NextResponse } from 'next/server';
import { mockDb } from '../data';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');
  const currency = searchParams.get('currency');
  const status = searchParams.get('status');

  const filtered = mockDb.accounts.filter((account) => {
    const matchesCompany = companyId ? account.companyId === companyId : true;
    const matchesCurrency = currency ? account.currency === currency : true;
    const matchesStatus = status ? account.status === status : true;
    return matchesCompany && matchesCurrency && matchesStatus;
  });

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      filters: {
        companyId: companyId ?? 'any',
        currency: currency ?? 'any',
        status: status ?? 'any',
      },
    },
  });
}
