-- Extend existing enums for the languages and verdicts supported by the judge.
ALTER TYPE "SupportedLanguage" ADD VALUE IF NOT EXISTS 'c';
ALTER TYPE "SupportedLanguage" ADD VALUE IF NOT EXISTS 'rust';
ALTER TYPE "SubmissionResult" ADD VALUE IF NOT EXISTS 'memory_limit_exceeded';
ALTER TYPE "SubmissionResult" ADD VALUE IF NOT EXISTS 'internal_error';
ALTER TYPE "CodeRunStatus" ADD VALUE IF NOT EXISTS 'memory_limit_exceeded';

-- Keep compiler diagnostics separate from execution stderr.
ALTER TABLE "submissions" ADD COLUMN IF NOT EXISTS "compileOutput" TEXT;
ALTER TABLE "code_runs" ADD COLUMN IF NOT EXISTS "compileOutput" TEXT;
