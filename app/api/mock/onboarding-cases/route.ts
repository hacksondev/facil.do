import { NextResponse } from 'next/server';
import { mockDb } from '../data';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const filtered = mockDb.onboardingCases.filter((item) =>
    status ? item.status === status : true,
  );

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      filters: {
        status: status ?? 'any',
      },
    },
  });
}
