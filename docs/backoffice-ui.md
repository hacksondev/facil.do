# Backoffice UI (Mock)

Pantalla de backoffice inspirada en Mercury usando datos de la Mock API. Ruta: `/backoffice`.

## Datos
- Fuente: Mock API (`/api/mock/*`). La página usa `app/api/mock/data.ts` como dataset en memoria.
- Endpoints consumidos:
  - `GET /api/mock/companies` (selecciona la primera como activa).
  - `GET /api/mock/companies/:id` (detalle, cuentas, transacciones, alertas, liveness).
- Si quieres ver otros registros, ajusta el orden o agrega empresas en `app/api/mock/data.ts`.

## Secciones de la UI
- Sidebar: navegación estática + listado de empresas con badge de riesgo.
- Topbar: buscador global y CTA “Mover fondos”.
- Banner tarjeta virtual: estado de tarjeta y acciones rápidas (gestionar/configurar límites).
- Quick actions: enviar, transferir, depositar, solicitar y cargar factura.
- Saldos y movimiento: total DOP/USD y barra de actividad (placeholder de flujo de caja).
- Cuentas: cards con alias, últimos 4 dígitos, balance y estado; slot para crear cuenta.
- Onboarding empresa: etapa, riesgo, pasos (datos legales, UBOs, liveness, screening) y reviewer.
- Alertas y casos: listado de alertas abiertas con severidad y fecha.
- Propietario principal: datos KYC, PEP, último liveness y acciones aprobar/reintentar.
- Movimientos recientes: tabla con fecha, cuenta, contraparte, monto y estado.

## Rutas mock disponibles
- `/backoffice`: dashboard general (saldos, cuentas, onboarding, alertas, movimientos).
- `/backoffice/onboarding`: tablero de casos KYB/KYC, conteos por estado y tabla de empresas.
- `/backoffice/accounts`: listado de cuentas, balances por moneda, límites y movimientos.
- `/backoffice/alerts`: alertas AML abiertas/cerradas con severidad y acciones sugeridas.
- `/backoffice/login`: formulario de ingreso al backoffice (mock, sin autenticación real).

## Autenticación mock
- Credenciales demo en `app/api/mock/auth/users.ts` (ej: ops@facil.do / demo123).
- Endpoints: `POST /api/mock/auth/login` (setea cookie `mock_backoffice_session`), `POST /api/mock/auth/logout`, `GET /api/mock/auth/me`.
- Middleware (`middleware.ts`) protege `/backoffice/*` y redirige a `/backoffice/login` si no hay cookie.

## Cómo adaptar a una API real
- Mantén los contratos actuales de `/api/mock/*` o crea un adapter en el front para el nuevo backend.
- Sustituye `apiBase` en `app/backoffice/page.tsx` por la URL del BFF real y agrega auth headers.
- Sustituye el gráfico placeholder por datos de transacciones (entradas/salidas) al migrar.

## Inspiración visual
- Layout y jerarquía basados en Mercury: sidebar fija, barra superior, tarjeta virtual destacada y paneles en grid.
- Paleta: se apalanca el tema DaisyUI existente (`facil`) con fondos suaves y acentos primarios.
