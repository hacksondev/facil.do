# Validaciones RD: Padrón JCE y RNC/DGII (mock-ready)

Objetivo: validar identidad (cédula) contra el padrón de la Junta Central Electoral (JCE) y validar RNC contra DGII durante el onboarding.

## Flujos recomendados
1) Propietario (persona)
   - Validar cédula en padrón JCE: nombre completo, estatus, fecha de nacimiento, coincidencia de género/estado civil si aplica.
   - Comparar cédula + selfie (liveness) para consistencia.
2) Empresa (RNC)
   - Consultar DGII: razón social, estado, fecha de registro, actividad económica, dirección fiscal.
   - Cruzar actividad/industria declarada vs. actividad DGII y vs. matriz de riesgo.

## Endpoints BFF sugeridos
- `POST /api/rd/jce/cedula`  
  Entrada: `{ cedula: "402-XXXXXXX-X", nombre?: string, fechaNacimiento?: string }`  
  Respuesta estandarizada: `{ valid: boolean, nombre, apellido, estado, nacimiento, raw }`.

- `POST /api/rd/dgii/rnc`  
  Entrada: `{ rnc: "1-23-45678-9" }`  
  Respuesta estandarizada: `{ valid: boolean, razonSocial, estado, actividad, direccion, raw }`.

## Variables de entorno
- `JCE_API_URL`, `JCE_API_KEY` (si se usa un integrador externo).
- `DGII_API_URL`, `DGII_API_KEY` (si se usa integrador o scraping autorizado).
- Flags mock:
  - `MOCK_JCE=true` → devuelve coincidencia simple para cédulas de prueba.
  - `MOCK_DGII=true` → devuelve razón social y estado “Activo” para RNC de prueba.

## Integración en onboarding
- Paso Propietarios:
  - Al ingresar cédula → `POST /api/rd/jce/cedula` y guardar resultado en `owners.identity_check`.
  - Mostrar badge “Coincide con padrón JCE” o error si no coincide.
- Paso Empresa (Company info):
  - Al ingresar RNC → `POST /api/rd/dgii/rnc` y prefills: razón social, estado, actividad fiscal.
  - Bloquear avance si RNC inválido o estado ≠ activo (según reglas).

## Modelo de datos (sugerido)
- `owners`: `cedula`, `identity_check_status`, `identity_check_raw`, `jce_match` (boolean).
- `companies`: `rnc`, `dgii_status`, `dgii_activity`, `dgii_match` (boolean), `dgii_raw`.

## Reglas y errores
- Formato cédula/RNC obligatorio (usar mascarillas y validación de dígito verificador).
- Si JCE devuelve no encontrado → marcar `identity_check_status = failed`.
- Si DGII devuelve inactivo/suspendido → requerir revisión manual.
- Mostrar mensajes claros en UI: “Cédula no coincide con padrón” o “RNC inactivo en DGII”.

## Seguridad y cumplimiento
- No almacenar respuestas completas sin cifrado; guardar hash de cédula o último dígito en claro según política.
- No loggear PII. Usar almacenamiento cifrado para respuestas crudas (`*_raw`).
- Rate limit y captura de auditoría por usuario/admin que dispara las consultas.

## Mock/local
- `MOCK_JCE=true`: si la cédula empieza con `402`, devolver válido con nombre “Demo JCE”.
- `MOCK_DGII=true`: si el RNC tiene 9 dígitos, devolver válido con razón social “Demo DGII SRL”.

## Próximos pasos
- Implementar endpoints BFF anteriores y conectar a los campos de cédula (Propietarios) y RNC (Company info).  
- Normalizar errores y prellenar campos en UI con los datos DGII/JCE cuando haya match.  
- Añadir verificación de dígito verificador en frontend para cédula y RNC antes de llamar al BFF.***
