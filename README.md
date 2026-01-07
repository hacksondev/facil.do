# Facil.do Landing Page

Landing page mobile-first para una plataforma de banca digital empresarial para MIPYMES dominicanas. Incluye formulario de waitlist funcional conectado a Supabase.

## Stack Tecnológico

- **Next.js 14** (App Router)
- **React 18**
- **Redux Toolkit** (manejo de estado)
- **Supabase** (base de datos)
- **Tailwind CSS + DaisyUI** (estilos mobile-first)
- **TypeScript**
- **Docker** (containerización)

## Estructura del Proyecto

```
/app
├── components/
│   ├── Header.tsx            # Navbar con drawer móvil
│   ├── Hero.tsx              # Sección principal con CTA
│   ├── ValueProposition.tsx  # Problema vs solución
│   ├── Features.tsx          # Características del producto
│   ├── WaitlistForm.tsx      # Formulario de captura de leads
│   └── Footer.tsx            # Pie de página
├── store/
│   ├── store.ts              # Configuración de Redux
│   ├── waitlistSlice.ts      # Slice del waitlist con async thunk
│   ├── StoreProvider.tsx     # Provider de Redux
│   └── hooks.ts              # Hooks tipados
├── services/
│   └── supabaseClient.ts     # Cliente de Supabase
├── layout.tsx                # Layout principal
├── page.tsx                  # Página principal
└── globals.css               # Estilos globales
/supabase
└── schema.sql                # Script SQL para crear la tabla
```

## Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Docker (opcional, para containerización)

## Configuración Rápida

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** en el dashboard
3. Copia el contenido de `supabase/schema.sql` y ejecútalo
4. Ve a **Settings > API** y copia:
   - Project URL
   - anon/public key

### 3. Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 5. Build para producción

```bash
npm run build
npm start
```

## Docker

### Build y ejecutar con Docker

```bash
# Build de la imagen
docker build -t facil-do-landing .

# Ejecutar el contenedor
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key \
  facil-do-landing
```

### Docker Compose

```bash
# Ejecutar con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## Funcionalidades

### Formulario de Waitlist

- Validación en frontend (campos requeridos, formato email)
- Prevención de emails duplicados
- Estados manejados con Redux:
  - `idle` - Estado inicial
  - `loading` - Enviando datos
  - `success` - Registro exitoso
  - `error` - Error en el envío

### Diseño Mobile-First

- Optimizado para dispositivos móviles
- Drawer móvil para navegación
- Scroll suave a secciones
- Tipografía grande y legible
- Espacios generosos para touch

### Accesibilidad

- Labels asociados a inputs
- Estados de focus visibles
- Mensajes de error descriptivos
- Atributos ARIA

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | Verificar errores de linting |

## Personalización

### Tema DaisyUI

Edita `tailwind.config.ts` para modificar el tema "facil":

```typescript
daisyui: {
  themes: [
    {
      facil: {
        "primary": "#5266eb",
        "secondary": "#7856d8",
        // ...
      },
    },
  ],
}
```

### Tipos de Negocio

Edita el array `businessTypes` en `WaitlistForm.tsx`:

```typescript
const businessTypes = [
  { value: 'retail', label: 'Comercio / Retail' },
  // Agrega más opciones...
]
```

### Copy del Landing

Modifica el texto directamente en los componentes:
- `Hero.tsx` - Headline y subheadline
- `Features.tsx` - Características
- `ValueProposition.tsx` - Problemas y soluciones

## Deploy

### Vercel (Recomendado)

1. Sube el proyecto a GitHub
2. Importa en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Deploy automático

### Docker en producción

El proyecto incluye un Dockerfile multi-stage optimizado para producción:
- Imagen base Alpine (ligera)
- Standalone output de Next.js
- Health check incluido

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js o Docker:
- Railway
- AWS ECS/Fargate
- Google Cloud Run
- DigitalOcean App Platform

## Mock API de Backoffice

Se incluyó una API mock para el backoffice (sin persistencia) servida desde Next.js:

- Base: `/api/mock`
- Endpoints principales: compañías, casos de onboarding, cuentas, transacciones, sesiones de liveness y alertas.
- Documentación y ejemplos en `docs/mock-api.md`.

## Backoffice UI (Mock)

- Pantalla mock en `/backoffice` inspirada en Mercury, consumiendo la API mock.
- Muestra saldos DOP/USD, cuentas, onboarding, alertas AML y movimientos recientes.
- Rutas adicionales: `/backoffice/onboarding`, `/backoffice/accounts`, `/backoffice/alerts`, `/backoffice/login`.
- Autenticación con Supabase: login y alta de usuario usan Supabase Auth; middleware protege `/backoffice/*`.
- Cómo adaptarla a la API real: ver `docs/backoffice-ui.md`.
- Integración Socure (prueba de vida): guía en `docs/socure-liveness.md`.
- Validaciones RD (Padrón JCE y RNC/DGII): ver `docs/rd-validaciones.md`.
- Auth con Supabase (BaaS): ver `docs/auth-supabase.md`.

## Seguridad

- Row Level Security (RLS) habilitado en Supabase
- Solo se permite INSERT público
- SELECT requiere autenticación
- Variables sensibles en .env.local (no se suben al repo)

## Soporte

Para preguntas o problemas, abre un issue en el repositorio.

---

Desarrollado con Next.js, Redux Toolkit, DaisyUI y Supabase.
