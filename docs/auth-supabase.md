# Auth con Supabase (BaaS)

Configuración aplicada:
- Front usa `supabase.auth.signUp` en onboarding y `signInWithPassword` en login.
- `persistSession: true` en el cliente.
- Middleware con `createMiddlewareClient` protege `/backoffice/*` (excepto rutas de onboarding/login).
- Logout usa `supabase.auth.signOut`.
- Policies RLS en DB limitadas a `authenticated` (endurecer más en prod).

Variables requeridas (env):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo en backend para tareas privilegiadas)
- Storage: bucket `onboarding-docs`; si es privado, usar signed URLs o service role desde API.

Endpoints front:
- Login: `/backoffice/login`
- SignUp: `/backoffice/onboarding/create-account` (crea user + session)

Consideraciones para producción:
- Habilita confirmación de email en Supabase Auth si quieres verificar correo antes de sesión.
- Asegura cookies/sesiones en middleware: `createMiddlewareClient` ya sincroniza cookies.
- Para descargas de Storage privadas, usa URLs firmadas desde el backend.
- RLS: agrega filtros por `auth.uid()` donde aplique y roles específicos para admin/backoffice (usando service role).***
