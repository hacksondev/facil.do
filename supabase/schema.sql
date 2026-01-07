-- ============================================
-- FINTECH B2B - SCHEMA SQL PARA SUPABASE
-- ============================================
-- Este script crea la tabla waitlist y configura
-- las políticas de seguridad (RLS) necesarias.
--
-- Instrucciones:
-- 1. Ve a tu proyecto en Supabase Dashboard
-- 2. Navega a SQL Editor
-- 3. Copia y pega este script
-- 4. Ejecuta el script
-- ============================================

-- Habilitar extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: waitlist
-- ============================================
-- Almacena los leads del formulario de waitlist

CREATE TABLE IF NOT EXISTS public.waitlist (
    -- ID único generado automáticamente
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Nombre de la empresa
    company_name VARCHAR(255) NOT NULL,

    -- Nombre del contacto
    contact_name VARCHAR(255) NOT NULL,

    -- Email del contacto (único para prevenir duplicados)
    email VARCHAR(255) NOT NULL UNIQUE,

    -- Tipo de negocio (del select del formulario)
    business_type VARCHAR(100) NOT NULL,

    -- Timestamp de creación
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- ÍNDICES
-- ============================================
-- Índice para búsquedas por email (ya creado por UNIQUE)
-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at
    ON public.waitlist (created_at DESC);

-- Índice para filtrar por tipo de negocio
CREATE INDEX IF NOT EXISTS idx_waitlist_business_type
    ON public.waitlist (business_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Habilitar RLS en la tabla
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT público (anónimo)
-- Los usuarios pueden registrarse sin autenticación
CREATE POLICY "Permitir inserciones públicas en waitlist"
    ON public.waitlist
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Política para permitir SELECT solo a usuarios autenticados
-- (para el dashboard de admin en el futuro)
CREATE POLICY "Permitir lectura solo a autenticados"
    ON public.waitlist
    FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================
COMMENT ON TABLE public.waitlist IS 'Tabla de leads del waitlist del landing page';
COMMENT ON COLUMN public.waitlist.id IS 'Identificador único del registro';
COMMENT ON COLUMN public.waitlist.company_name IS 'Nombre de la empresa';
COMMENT ON COLUMN public.waitlist.contact_name IS 'Nombre del contacto principal';
COMMENT ON COLUMN public.waitlist.email IS 'Email corporativo (único)';
COMMENT ON COLUMN public.waitlist.business_type IS 'Tipo/categoría del negocio';
COMMENT ON COLUMN public.waitlist.created_at IS 'Fecha y hora de registro';

-- ============================================
-- FUNCIÓN PARA CONTAR REGISTROS (opcional)
-- ============================================
-- Función útil para mostrar el contador en el landing

CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT COUNT(*)::INTEGER FROM public.waitlist;
$$;

-- Permitir que cualquiera ejecute la función
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon, authenticated;

-- ============================================
-- DATOS DE PRUEBA (opcional - comentar en producción)
-- ============================================
-- Descomenta estas líneas para insertar datos de prueba

-- INSERT INTO public.waitlist (company_name, contact_name, email, business_type)
-- VALUES
--     ('Empresa Demo SRL', 'Juan Pérez', 'demo@empresa.com', 'retail'),
--     ('Tech Solutions', 'María García', 'maria@tech.com', 'tecnologia'),
--     ('Restaurante El Sabor', 'Carlos López', 'carlos@elsabor.com', 'restaurante');

-- ============================================
-- MVP CORE (Onboarding, cuentas) - República Dominicana / DOP
-- ============================================

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'onboarding_status') THEN
    CREATE TYPE onboarding_status AS ENUM ('collecting', 'pending_review', 'approved', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
    CREATE TYPE account_status AS ENUM ('active', 'blocked', 'pending_activation');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
    CREATE TYPE transaction_status AS ENUM ('pending', 'settled', 'reversed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_severity') THEN
    CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high');
  END IF;
END$$;

-- Personas (propietarios/UBO)
CREATE TABLE IF NOT EXISTS public.persons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  document_number TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'cedula',
  nationality TEXT NOT NULL DEFAULT 'DO',
  pep BOOLEAN NOT NULL DEFAULT false,
  liveness_status TEXT DEFAULT 'pending',
  liveness_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sesiones de prueba de vida
CREATE TABLE IF NOT EXISTS public.liveness_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES public.persons(id),
  provider TEXT DEFAULT 'socure',
  provider_session_id TEXT,
  score NUMERIC(5,2),
  verdict TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Empresas
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rnc TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'DO',
  phone TEXT,
  industry TEXT,
  risk_level TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Propietarios / UBO
CREATE TABLE IF NOT EXISTS public.owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  person_id UUID NOT NULL REFERENCES public.persons(id),
  ownership_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  is_ubo BOOLEAN NOT NULL DEFAULT true,
  liveness_session_id UUID REFERENCES public.liveness_sessions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Casos de onboarding
CREATE TABLE IF NOT EXISTS public.onboarding_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  status onboarding_status NOT NULL DEFAULT 'collecting',
  reviewer TEXT,
  decision_reason TEXT,
  risk_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documentos
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id),
  person_id UUID REFERENCES public.persons(id),
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catálogo de tipos de documento (opcional)
CREATE TABLE IF NOT EXISTS public.catalog_doc_types (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

INSERT INTO public.catalog_doc_types (code, name)
VALUES
  ('constitutivo', 'Acta constitutiva / Registro mercantil'),
  ('rnc', 'Comprobante RNC / DGII'),
  ('ubo', 'Declaración de beneficiarios finales'),
  ('address', 'Comprobante de dirección')
ON CONFLICT (code) DO NOTHING;

-- Dirección de empresa (onboarding)
CREATE TABLE IF NOT EXISTS public.company_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'DO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Actividad esperada (onboarding)
CREATE TABLE IF NOT EXISTS public.expected_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  monthly_volume TEXT,
  countries TEXT,
  funding_source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Depósitos iniciales / activación de cuenta
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id),
  account_id UUID REFERENCES public.accounts(id),
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DOP',
  status TEXT NOT NULL DEFAULT 'pending',
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cuentas
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  type TEXT NOT NULL DEFAULT 'checking',
  currency TEXT NOT NULL DEFAULT 'DOP',
  number TEXT NOT NULL,
  alias TEXT,
  balance NUMERIC(18,2) NOT NULL DEFAULT 0,
  status account_status NOT NULL DEFAULT 'pending_activation',
  limits_daily NUMERIC(18,2) DEFAULT 0,
  limits_monthly NUMERIC(18,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transacciones
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  type TEXT NOT NULL, -- debit/credit
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DOP',
  counterparty TEXT,
  description TEXT,
  status transaction_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alertas AML/operativas
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- aml/transaction/liveness
  severity alert_severity NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  entity_type TEXT NOT NULL, -- company/person/transaction
  entity_id UUID NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auditoría simple
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT,
  action TEXT,
  entity_type TEXT,
  entity_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ÍNDICES básicos
-- ============================================
CREATE INDEX IF NOT EXISTS idx_persons_document ON public.persons(document_number);
CREATE INDEX IF NOT EXISTS idx_companies_rnc ON public.companies(rnc);
CREATE INDEX IF NOT EXISTS idx_accounts_company ON public.accounts(company_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_alerts_entity ON public.alerts(entity_id);
CREATE INDEX IF NOT EXISTS idx_company_addresses_company ON public.company_addresses(company_id);
CREATE INDEX IF NOT EXISTS idx_expected_activity_company ON public.expected_activity(company_id);
CREATE INDEX IF NOT EXISTS idx_deposits_company ON public.deposits(company_id);

-- Unicidad de RNC
DO $$
BEGIN
  ALTER TABLE public.companies ADD CONSTRAINT companies_rnc_unique UNIQUE (rnc);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liveness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_doc_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expected_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Políticas mínimas (abrir para mock/ingesta pública; ajustar en prod)
CREATE POLICY "auth insert persons" ON public.persons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert liveness" ON public.liveness_sessions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert owners" ON public.owners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert onboarding_cases" ON public.onboarding_cases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert company_addresses" ON public.company_addresses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert expected_activity" ON public.expected_activity FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert deposits" ON public.deposits FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert accounts" ON public.accounts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth select persons" ON public.persons FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select liveness" ON public.liveness_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select companies" ON public.companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select owners" ON public.owners FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select onboarding_cases" ON public.onboarding_cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select company_addresses" ON public.company_addresses FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select expected_activity" ON public.expected_activity FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select deposits" ON public.deposits FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select catalog_doc_types" ON public.catalog_doc_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select accounts" ON public.accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select transactions" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select alerts" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth select audit" ON public.audit_log FOR SELECT TO authenticated USING (true);

-- Nota: endurecer RLS en producción (asignar a 'authenticated' y roles específicos).

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
