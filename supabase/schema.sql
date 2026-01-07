-- ============================================
-- FACIL.DO - ESQUEMA BASE SUPABASE (RECREACIÓN)
-- República Dominicana / DOP
-- ============================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
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
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE document_status AS ENUM ('pending_upload','uploaded','pending_review','approved','rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_status_ext') THEN
    CREATE TYPE alert_status_ext AS ENUM ('open','in_progress','resolved','dismissed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type_ext') THEN
    CREATE TYPE alert_type_ext AS ENUM ('aml','transaction','liveness','kyc');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'company_role') THEN
    CREATE TYPE company_role AS ENUM ('admin','aprobador','visor');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'company_user_status') THEN
    CREATE TYPE company_user_status AS ENUM ('pending','active','disabled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('inbox','need_approval','scheduled','paid','failed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'beneficiary_status') THEN
    CREATE TYPE beneficiary_status AS ENUM ('active','pending','blocked');
  END IF;
END$$;

-- ============================================
-- TABLAS CORE
-- ============================================

-- Waitlist (landing)
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  business_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sesiones de prueba de vida
CREATE TABLE IF NOT EXISTS public.liveness_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT companies_rnc_unique UNIQUE (rnc)
);

-- Propietarios / UBO
CREATE TABLE IF NOT EXISTS public.owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  ownership_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  is_ubo BOOLEAN NOT NULL DEFAULT true,
  liveness_session_id UUID REFERENCES public.liveness_sessions(id),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT owners_company_person_unique UNIQUE (company_id, person_id),
  CONSTRAINT owners_pct_check CHECK (ownership_pct >= 0 AND ownership_pct <= 100)
);

-- Casos de onboarding
CREATE TABLE IF NOT EXISTS public.onboarding_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
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
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.persons(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'pending_upload',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catálogo de tipos de documento
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

-- Dirección de empresa
CREATE TABLE IF NOT EXISTS public.company_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'DO',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Actividad esperada
CREATE TABLE IF NOT EXISTS public.expected_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  monthly_volume TEXT,
  countries TEXT,
  funding_source TEXT,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Settings de empresa
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'es-DO',
  timezone TEXT NOT NULL DEFAULT 'America/Santo_Domingo',
  notifications_email BOOLEAN NOT NULL DEFAULT true,
  notifications_webhooks JSONB,
  security_2fa_required BOOLEAN NOT NULL DEFAULT false,
  statement_day SMALLINT DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_settings_unique UNIQUE (company_id)
);

-- Perfil de empresa (datos públicos/básicos)
CREATE TABLE IF NOT EXISTS public.company_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  mission TEXT,
  vision TEXT,
  address TEXT,
  social_links JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_profile_unique UNIQUE (company_id)
);

-- Settings de usuario
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  language TEXT NOT NULL DEFAULT 'es-DO',
  timezone TEXT NOT NULL DEFAULT 'America/Santo_Domingo',
  theme TEXT DEFAULT 'light',
  notifications_email BOOLEAN NOT NULL DEFAULT true,
  notifications_push BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_settings_unique UNIQUE (user_id)
);

-- Usuarios de empresa (roles)
CREATE TABLE IF NOT EXISTS public.company_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role company_role NOT NULL DEFAULT 'visor',
  status company_user_status NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT company_users_unique UNIQUE (company_id, email)
);

-- Cuentas
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'checking',
  currency TEXT NOT NULL DEFAULT 'DOP',
  number TEXT NOT NULL,
  alias TEXT,
  balance NUMERIC(18,2) NOT NULL DEFAULT 0,
  status account_status NOT NULL DEFAULT 'pending_activation',
  limits_daily NUMERIC(18,2) DEFAULT 0,
  limits_monthly NUMERIC(18,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT accounts_number_unique UNIQUE (company_id, number)
);

-- Depósitos (requiere accounts)
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id),
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DOP',
  status TEXT NOT NULL DEFAULT 'pending',
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT deposits_amount_check CHECK (amount > 0)
);

-- Transacciones
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- debit/credit
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DOP',
  counterparty TEXT,
  description TEXT,
  status transaction_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT transactions_amount_check CHECK (amount > 0),
  CONSTRAINT transactions_type_check CHECK (type IN ('debit','credit'))
);

-- Alertas
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type alert_type_ext NOT NULL DEFAULT 'transaction',
  severity alert_severity NOT NULL DEFAULT 'medium',
  status alert_status_ext NOT NULL DEFAULT 'open',
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Beneficiarios
CREATE TABLE IF NOT EXISTS public.beneficiaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  bank_name TEXT,
  account_number TEXT,
  account_type TEXT,
  currency TEXT NOT NULL DEFAULT 'DOP',
  document_type TEXT DEFAULT 'rnc',
  document_number TEXT,
  alias TEXT,
  status beneficiary_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT beneficiaries_unique UNIQUE (company_id, account_number, bank_name)
);

-- Pagos (órdenes de pago)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id),
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DOP',
  counterparty TEXT,
  description TEXT,
  status payment_status NOT NULL DEFAULT 'inbox',
  scheduled_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payments_amount_check CHECK (amount > 0)
);

-- Auditoría
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor UUID REFERENCES auth.users(id),
  action TEXT,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_persons_document ON public.persons(document_number);
CREATE INDEX IF NOT EXISTS idx_companies_rnc ON public.companies(rnc);
CREATE INDEX IF NOT EXISTS idx_accounts_company ON public.accounts(company_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_created ON public.transactions(account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_entity ON public.alerts(entity_id);
CREATE INDEX IF NOT EXISTS idx_company_addresses_company ON public.company_addresses(company_id);
CREATE INDEX IF NOT EXISTS idx_expected_activity_company ON public.expected_activity(company_id);
CREATE INDEX IF NOT EXISTS idx_deposits_company ON public.deposits(company_id);
CREATE INDEX IF NOT EXISTS idx_accounts_company_status ON public.accounts(company_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_company_status ON public.documents(company_id, status);
CREATE INDEX IF NOT EXISTS idx_onboarding_cases_company_status ON public.onboarding_cases(company_id, status);
CREATE INDEX IF NOT EXISTS idx_company_settings_company ON public.company_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_company_profile_company ON public.company_profile(company_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_company_users_company ON public.company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_company_status ON public.payments(company_id, status);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_company ON public.beneficiaries(company_id);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;

-- Waitlist: insert público, lectura autenticada
DROP POLICY IF EXISTS "waitlist insert anon" ON public.waitlist;
CREATE POLICY "waitlist insert anon" ON public.waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "waitlist select auth" ON public.waitlist;
CREATE POLICY "waitlist select auth" ON public.waitlist FOR SELECT TO authenticated USING (true);

-- Personas
DROP POLICY IF EXISTS "person select" ON public.persons;
CREATE POLICY "person select" ON public.persons FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "person insert" ON public.persons;
CREATE POLICY "person insert" ON public.persons FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Empresas
DROP POLICY IF EXISTS "company select" ON public.companies;
CREATE POLICY "company select" ON public.companies FOR SELECT USING (created_by = auth.uid());
DROP POLICY IF EXISTS "company insert" ON public.companies;
CREATE POLICY "company insert" ON public.companies FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

-- Owners
DROP POLICY IF EXISTS "owners select" ON public.owners;
CREATE POLICY "owners select" ON public.owners FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "owners insert" ON public.owners;
CREATE POLICY "owners insert" ON public.owners FOR INSERT TO authenticated WITH CHECK (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Onboarding cases
DROP POLICY IF EXISTS "cases select" ON public.onboarding_cases;
CREATE POLICY "cases select" ON public.onboarding_cases FOR SELECT USING (
  user_id = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "cases insert" ON public.onboarding_cases;
CREATE POLICY "cases insert" ON public.onboarding_cases FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Direcciones
DROP POLICY IF EXISTS "addresses select" ON public.company_addresses;
CREATE POLICY "addresses select" ON public.company_addresses FOR SELECT USING (
  user_id = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "addresses insert" ON public.company_addresses;
CREATE POLICY "addresses insert" ON public.company_addresses FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Expected activity
DROP POLICY IF EXISTS "activity select" ON public.expected_activity;
CREATE POLICY "activity select" ON public.expected_activity FOR SELECT USING (
  user_id = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "activity insert" ON public.expected_activity;
CREATE POLICY "activity insert" ON public.expected_activity FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Documents
DROP POLICY IF EXISTS "documents select" ON public.documents;
CREATE POLICY "documents select" ON public.documents FOR SELECT USING (
  created_by = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "documents insert" ON public.documents;
CREATE POLICY "documents insert" ON public.documents FOR INSERT TO authenticated WITH CHECK (
  created_by = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Accounts
DROP POLICY IF EXISTS "accounts select" ON public.accounts;
CREATE POLICY "accounts select" ON public.accounts FOR SELECT USING (
  created_by = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "accounts insert" ON public.accounts;
CREATE POLICY "accounts insert" ON public.accounts FOR INSERT TO authenticated WITH CHECK (
  created_by = auth.uid() OR company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Transactions
DROP POLICY IF EXISTS "transactions select" ON public.transactions;
CREATE POLICY "transactions select" ON public.transactions FOR SELECT USING (
  created_by = auth.uid() OR account_id IN (SELECT id FROM public.accounts WHERE company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid()))
);
DROP POLICY IF EXISTS "transactions insert" ON public.transactions;
CREATE POLICY "transactions insert" ON public.transactions FOR INSERT TO authenticated WITH CHECK (
  created_by = auth.uid() OR account_id IN (SELECT id FROM public.accounts WHERE company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid()))
);

-- Alerts
DROP POLICY IF EXISTS "alerts select" ON public.alerts;
CREATE POLICY "alerts select" ON public.alerts FOR SELECT USING (created_by = auth.uid());
DROP POLICY IF EXISTS "alerts insert" ON public.alerts;
CREATE POLICY "alerts insert" ON public.alerts FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

-- Company settings
DROP POLICY IF EXISTS "company_settings select" ON public.company_settings;
CREATE POLICY "company_settings select" ON public.company_settings FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "company_settings insert" ON public.company_settings;
CREATE POLICY "company_settings insert" ON public.company_settings FOR INSERT TO authenticated WITH CHECK (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "company_settings update" ON public.company_settings;
CREATE POLICY "company_settings update" ON public.company_settings FOR UPDATE TO authenticated USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Company profile
DROP POLICY IF EXISTS "company_profile select" ON public.company_profile;
CREATE POLICY "company_profile select" ON public.company_profile FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "company_profile insert" ON public.company_profile;
CREATE POLICY "company_profile insert" ON public.company_profile FOR INSERT TO authenticated WITH CHECK (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "company_profile update" ON public.company_profile;
CREATE POLICY "company_profile update" ON public.company_profile FOR UPDATE TO authenticated USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- User settings
DROP POLICY IF EXISTS "user_settings select" ON public.user_settings;
CREATE POLICY "user_settings select" ON public.user_settings FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "user_settings insert" ON public.user_settings;
CREATE POLICY "user_settings insert" ON public.user_settings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "user_settings update" ON public.user_settings;
CREATE POLICY "user_settings update" ON public.user_settings FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Company users
DROP POLICY IF EXISTS "company_users select" ON public.company_users;
CREATE POLICY "company_users select" ON public.company_users FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "company_users insert" ON public.company_users;
CREATE POLICY "company_users insert" ON public.company_users FOR INSERT TO authenticated WITH CHECK (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "company_users update" ON public.company_users;
CREATE POLICY "company_users update" ON public.company_users FOR UPDATE TO authenticated USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Beneficiaries
DROP POLICY IF EXISTS "beneficiaries select" ON public.beneficiaries;
CREATE POLICY "beneficiaries select" ON public.beneficiaries FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "beneficiaries insert" ON public.beneficiaries;
CREATE POLICY "beneficiaries insert" ON public.beneficiaries FOR INSERT TO authenticated WITH CHECK (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "beneficiaries update" ON public.beneficiaries;
CREATE POLICY "beneficiaries update" ON public.beneficiaries FOR UPDATE TO authenticated USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Payments
DROP POLICY IF EXISTS "payments select" ON public.payments;
CREATE POLICY "payments select" ON public.payments FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "payments insert" ON public.payments;
CREATE POLICY "payments insert" ON public.payments FOR INSERT TO authenticated WITH CHECK (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);
DROP POLICY IF EXISTS "payments update" ON public.payments;
CREATE POLICY "payments update" ON public.payments FOR UPDATE TO authenticated USING (
  company_id IN (SELECT id FROM public.companies WHERE created_by = auth.uid())
);

-- Audit log (solo lectura por defecto)
DROP POLICY IF EXISTS "audit select" ON public.audit_log;
CREATE POLICY "audit select" ON public.audit_log FOR SELECT TO authenticated USING (true);

-- Catálogo doc types (solo lectura)
DROP POLICY IF EXISTS "catalog select" ON public.catalog_doc_types;
CREATE POLICY "catalog select" ON public.catalog_doc_types FOR SELECT USING (true);

-- Nota: Si cambias el schema en producción, refresca el cache de PostgREST:
-- SELECT pg_notify('pgrst', 'reload schema');
