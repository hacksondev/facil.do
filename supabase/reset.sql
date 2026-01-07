-- WARNING: This script drops all objects in the public schema (tables, views, functions, types)
-- Use only in development. It will cascade-delete all data.
BEGIN;

-- Drop functions
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT routine_schema, routine_name
            FROM information_schema.routines
            WHERE routine_schema = 'public') LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %I.%I CASCADE;', r.routine_schema, r.routine_name);
  END LOOP;
END$$;

-- Drop views/materialized views
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = 'public') LOOP
    EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE;', r.table_name);
  END LOOP;
END$$;

-- Drop tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', r.tablename);
  END LOOP;
END$$;

-- Drop types (enums)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT t.typname FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
            WHERE n.nspname = 'public' AND t.typtype = 'e') LOOP
    EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE;', r.typname);
  END LOOP;
END$$;

COMMIT;

-- Optional: notify PostgREST to reload schema
-- SELECT pg_notify('pgrst', 'reload schema');
