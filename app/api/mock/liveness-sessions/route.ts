import { NextResponse } from 'next/server';
import { mockDb } from '../data';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const personId = searchParams.get('personId');

  const filtered = mockDb.livenessSessions.filter((session) =>
    personId ? session.personId === personId : true,
  );

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      filters: {
        personId: personId ?? 'any',
      },
    },
  });
}
