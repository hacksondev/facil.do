import { NextResponse } from 'next/server';
import { mockDb } from '../data';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const riskLevel = searchParams.get('riskLevel');
  const onboardingStage = searchParams.get('onboardingStage');
  const country = searchParams.get('country');

  const filtered = mockDb.companies.filter((company) => {
    const matchesRisk = riskLevel ? company.riskLevel === riskLevel : true;
    const matchesStage = onboardingStage ? company.onboardingStage === onboardingStage : true;
    const matchesCountry = country ? company.country === country : true;
    return matchesRisk && matchesStage && matchesCountry;
  });

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      filters: {
        riskLevel: riskLevel ?? 'any',
        onboardingStage: onboardingStage ?? 'any',
        country: country ?? 'any',
      },
    },
  });
}
