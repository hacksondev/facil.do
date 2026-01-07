# Supabase MVP (RD/DOP) - Tablas y despliegue

Este esquema cubre onboarding, cuentas y alertas mock-ready. Moneda fija DOP y foco RD.

## Tablas principales (supabase/schema.sql)
- `waitlist` — leads del landing.
- `persons` — propietarios/UBO; cédula/pasaporte, PEP, liveness_status/score.
- `liveness_sessions` — sesiones de prueba de vida (socure u otro).
- `companies` — empresa (RNC, país DO, industria, riesgo).
- `owners` — relación company ↔ person, % participación, UBO, liveness_session_id.
- `onboarding_cases` — estado del caso (collecting/pending_review/approved/rejected), reviewer, riesgo.
- `documents` — URLs de documentos (acta, RNC, UBO, address).
- `catalog_doc_types` — catálogo de tipos de documentos.
- `company_addresses` — dirección de la empresa (DO).
- `expected_activity` — volumen, países, origen de fondos y notas.
- `accounts` — cuenta bancaria mock (tipo, alias, balance, límites, status pending_activation/active/bloqueada).
- `transactions` — movimientos debit/credit con status pending/settled/reversed.
- `alerts` — aml/transaction/liveness con severidad (low/medium/high).
- `audit_log` — auditoría simple de acciones.

## Enums
- `onboarding_status`, `account_status`, `transaction_status`, `alert_severity`.

## RLS
- Todas las tablas tienen RLS habilitado. Policies actuales: solo `authenticated`. Para prod, refina con filtros por `user_id/company_id` y usa service role para backoffice/admin.

## Índices
- Personas por documento, empresas por RNC, cuentas por empresa, transacciones por cuenta, alertas por entidad.

## Moneda y país
- `currency` fijo a DOP; `country` default DO. Ajusta si se requiere multi-moneda.

## Pasos de despliegue
1) Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
2) Configura variables en el front/back para usar la API (URL y anon key).
3) Endurece RLS en producción: refina políticas con filtros por owner/company_id y roles; usa service role para backoffice.
4) Crea service role en Supabase y úsalo desde el BFF para acciones admin.
5) Storage: crea bucket `onboarding-docs` (público o con signed URLs). El front sube documentos al bucket y guarda el enlace en la tabla `documents` o en el flujo mock.
6) Variables frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` para Auth/Storage. Usa `SUPABASE_SERVICE_ROLE_KEY` en backend (API routes) para operaciones privilegiadas (ej. uploads o admin).

## Extensiones
- `uuid-ossp` habilitada para UUIDs.

## Mock vs prod
- El esquema permite ingesta abierta para desarrollo. Antes de prod:
  - Restringe INSERT/SELECT a roles apropiados.
  - Agrega triggers de auditoría completos.
  - Añade constraints adicionales (únicos: RNC, alias de cuenta si aplica).

## Referencias rápidas
- Archivo: `supabase/schema.sql`
- Guías relacionadas: `docs/socure-liveness.md`, `docs/rd-validaciones.md`.
