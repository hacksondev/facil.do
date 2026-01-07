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
-- FIN DEL SCRIPT
-- ============================================
