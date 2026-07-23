-- AlterTable
ALTER TABLE "night_planners" ADD COLUMN IF NOT EXISTS "completed_tasks" BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[];
