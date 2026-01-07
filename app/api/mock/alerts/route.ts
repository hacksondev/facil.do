import { NextResponse } from 'next/server';
import { mockDb } from '../data';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const severity = searchParams.get('severity');
  const entityId = searchParams.get('entityId');

  const filtered = mockDb.alerts.filter((alert) => {
    const matchesStatus = status ? alert.status === status : true;
    const matchesSeverity = severity ? alert.severity === severity : true;
    const matchesEntity = entityId ? alert.entityId === entityId : true;
    return matchesStatus && matchesSeverity && matchesEntity;
  });

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      filters: {
        status: status ?? 'any',
        severity: severity ?? 'any',
        entityId: entityId ?? 'any',
      },
    },
  });
}
