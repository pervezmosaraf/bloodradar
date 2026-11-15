# Supabase Migrations for BloodRadar

This directory contains modular PostgreSQL migrations for BloodRadar:

1. `20261115000001_extensions.sql` - PostGIS, pg_cron, pgcrypto
2. `20261115000002_core_schema.sql` - profiles, donors, blood_requests, donor_responses
3. `20261115000003_notifications_logs.sql` - notifications, donation_history, admin_logs
4. `20261115000004_spatial_indexes.sql` - GIST spatial index on geography points
5. `20261115000005_rls_policies.sql` - Row Level Security for all tables
6. `20261115000006_rpc_functions.sql` - notify_stage, accept_request (SELECT FOR UPDATE), confirm_donation
7. `20261115000007_cron_jobs.sql` - pg_cron automated schedule for radius expansion and deadline expiration
