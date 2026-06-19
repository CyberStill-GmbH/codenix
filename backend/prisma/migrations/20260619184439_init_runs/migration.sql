-- CreateEnum
CREATE TYPE "CodeRunStatus" AS ENUM ('pending', 'running', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'compilation_error', 'internal_error');

-- CreateTable
CREATE TABLE "code_runs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "language" "SupportedLanguage" NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "status" "CodeRunStatus" NOT NULL DEFAULT 'pending',
    "stdout" TEXT,
    "stderr" TEXT,
    "error" TEXT,
    "executionTimeMs" INTEGER,
    "memoryKb" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_run_testcase_results" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "testcaseId" TEXT,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT,
    "actualOutput" TEXT,
    "error" TEXT,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "executionTimeMs" INTEGER,
    "memoryKb" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_run_testcase_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "code_runs_userId_idx" ON "code_runs"("userId");

-- CreateIndex
CREATE INDEX "code_runs_problemId_idx" ON "code_runs"("problemId");

-- CreateIndex
CREATE INDEX "code_runs_status_idx" ON "code_runs"("status");

-- CreateIndex
CREATE INDEX "code_run_testcase_results_runId_idx" ON "code_run_testcase_results"("runId");

-- CreateIndex
CREATE INDEX "code_run_testcase_results_testcaseId_idx" ON "code_run_testcase_results"("testcaseId");

-- AddForeignKey
ALTER TABLE "code_runs" ADD CONSTRAINT "code_runs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_runs" ADD CONSTRAINT "code_runs_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_run_testcase_results" ADD CONSTRAINT "code_run_testcase_results_runId_fkey" FOREIGN KEY ("runId") REFERENCES "code_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_run_testcase_results" ADD CONSTRAINT "code_run_testcase_results_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "testcases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
