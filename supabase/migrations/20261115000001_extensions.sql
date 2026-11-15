-- BloodRadar Migration 01: Core Extensions
-- Enables PostGIS for spatial geography queries, pg_cron for scheduled cascading, and pgcrypto for UUIDs

-- PostGIS: Provides geography type and ST_DWithin spatial functions
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";

-- pgcrypto: Provides gen_random_uuid() and hashing functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

-- pg_cron: Scheduled cron engine inside PostgreSQL (Supabase provides this on the 'extensions' schema)
CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";
