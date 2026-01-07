# Mock API de backoffice

API mock en Next.js (App Router) que sirve datos en memoria para el backoffice. Útil para integración temprana mientras se conecta una API real. No hay persistencia ni side effects.

Base URL: `http://localhost:3000/api/mock`

## Endpoints
- `GET /companies` — Lista de empresas. Query params opcionales: `riskLevel=low|medium|high`, `onboardingStage=collecting|pending_review|approved|rejected`, `country=DO|...`
- `GET /companies/:id` — Detalle de empresa + onboarding, cuentas, transacciones, owner y sesiones de liveness.
- `GET /onboarding-cases` — Lista de casos. Query param opcional: `status`.
- `GET /accounts` — Lista de cuentas. Query params: `companyId`, `currency`, `status`.
- `GET /transactions` — Lista de transacciones. Query params: `accountId`, `status`.
- `GET /liveness-sessions` — Sesiones de prueba de vida. Query param: `personId`.
- `GET /alerts` — Alertas. Query params: `status`, `severity`, `entityId`.
- `POST /auth/login` — Mock login; setea cookie `mock_backoffice_session`. Credenciales demo en `app/api/mock/auth/users.ts`.
- `POST /auth/logout` — Limpia la cookie.
- `GET /auth/me` — Devuelve usuario mock si la cookie es válida.

## Ejemplos
Listar empresas en revisión:
```bash
curl "http://localhost:3000/api/mock/companies?onboardingStage=pending_review"
```

Detalle de una empresa:
```bash
curl "http://localhost:3000/api/mock/companies/comp_001"
```

Transacciones de una cuenta:
```bash
curl "http://localhost:3000/api/mock/transactions?accountId=acc_001"
```

## Extender o reemplazar
- Los datos viven en `app/api/mock/data.ts`; se pueden ajustar o ampliar las entidades según el front.
- Para apuntar luego a una API real, conserva las mismas rutas y contratos de respuesta o agrega un adapter en el front.
