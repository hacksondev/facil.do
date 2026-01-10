# Integración Socure - Prueba de vida y verificación de identidad (mock-ready)

Objetivo: usar Socure (DocV/Liveness) para validar al propietario principal durante el onboarding en RD. Flujo propuesto con backend BFF y front Next.js.

## Variables de entorno
- `SOCURE_CLIENT_ID` — provisto por Socure.
- `SOCURE_CLIENT_SECRET` — secreto de cliente.
- `SOCURE_ENV` — `sandbox` | `preprod` | `prod`.
- `SOCURE_WEBHOOK_SECRET` — secreto para validar webhook de decisión.

## Endpoints BFF sugeridos
- `POST /api/liveness/session`  
  Entrada: `{ userId, companyId }`  
  Acción: llama a Socure para crear sesión DocV/Liveness y devuelve `sessionToken`, `sessionUrl` y `sessionId`.  
  Respuesta: `{ sessionToken, sessionUrl, sessionId, expiresAt }`.

- `POST /api/liveness/webhook` (callback Socure)  
  Valida firma con `SOCURE_WEBHOOK_SECRET`.  
  Normaliza payload a `{ sessionId, userId, score, verdict, documentType, documentNumber, selfieQuality, reasons }`.  
  Actualiza tabla `liveness_sessions` y marca `owners.liveness_status = approved/rejected/pending`.

- `GET /api/liveness/status?sessionId=...`  
  Devuelve estado y score persistido para que el front pueda mostrar el resultado.

## Flujo UX (panel/onboarding)
1) En paso “Propietarios/UBO” mostrar botón “Iniciar prueba de vida”.  
2) Al clic: `POST /api/liveness/session` → obtener `sessionToken/url`.  
3) Iniciar SDK/redirect de Socure; al terminar, Socure llama a webhook.  
4) Front puede hacer polling a `/api/liveness/status` o esperar socket/evento para mostrar “Liveness OK” con score.  
5) No permitir avanzar si `verdict != approved` o `score < umbral` (ej. 0.85).

## Modelo de datos (sugerido)
- `liveness_sessions`: `id`, `user_id`, `company_id`, `provider_session_id`, `status`, `score`, `verdict`, `document_type`, `document_number`, `selfie_quality`, `created_at`, `updated_at`.  
- `owners`: añadir `liveness_status`, `liveness_score`, `liveness_session_id`.

## Consideraciones de RD
- Documento principal: cédula dominicana. Mapear `documentType = DO_ID` y validar formato.  
- Soportar pasaporte extranjero como fallback.  
- Guardar evidencia de consentimiento y timestamps para auditoría (Cumplimiento local).

## Seguridad
- Backend-to-backend: `client_id`/`client_secret` solo en servidor.  
- Validar firma del webhook; rechazar si timestamp expira.  
- Cifrar PII sensible en reposo; no loggear documentos completos ni selfies.  
- Rate limit en `/api/liveness/session`.

## Mock/local
- Si no hay credenciales, devolver sesión simulada con `score: 0.92` y `verdict: approved`.  
- Permitir `NEXT_PUBLIC_ENABLE_SOCURE_MOCK=true` para usar el mock en front.

## Próximos pasos
- Crear endpoints BFF anteriores y conectar el botón “Prueba de vida” del paso Propietarios al endpoint real (hoy es mock).  
- Almacenar resultado en BD y bloquear progreso si falla.  
- Añadir reintentos limitados y mensajes claros de error (iluminación, rostro fuera de cuadro).  
- Configurar webhook en Socure apuntando a `/api/liveness/webhook` y probar en sandbox.***
