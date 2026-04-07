-- Add missing user preference columns for existing PostgreSQL deployments.
-- This resolves runtime failures when Prisma schema expects these fields.
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "defaultFrequency" TEXT NOT NULL DEFAULT 'daily';

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true;
