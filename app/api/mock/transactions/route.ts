import { NextResponse } from 'next/server';
import { mockDb } from '../data';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');
  const status = searchParams.get('status');

  const filtered = mockDb.transactions.filter((tx) => {
    const matchesAccount = accountId ? tx.accountId === accountId : true;
    const matchesStatus = status ? tx.status === status : true;
    return matchesAccount && matchesStatus;
  });

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      filters: {
        accountId: accountId ?? 'any',
        status: status ?? 'any',
      },
    },
  });
}
