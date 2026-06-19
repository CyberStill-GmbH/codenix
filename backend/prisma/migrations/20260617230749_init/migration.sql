-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "ProblemDifficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "ProblemStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "TestcaseVisibility" AS ENUM ('sample', 'hidden');

-- CreateEnum
CREATE TYPE "SubmissionResult" AS ENUM ('accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'compilation_error', 'pending');

-- CreateEnum
CREATE TYPE "SupportedLanguage" AS ENUM ('python', 'java', 'cpp', 'typescript', 'javascript');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "degree" TEXT NOT NULL DEFAULT '',
    "githubUrl" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems" (
    "id" TEXT NOT NULL,
    "numericId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "difficulty" "ProblemDifficulty" NOT NULL,
    "status" "ProblemStatus" NOT NULL DEFAULT 'draft',
    "statement" TEXT NOT NULL,
    "inputFormat" TEXT NOT NULL,
    "outputFormat" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "acceptance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_examples" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "explanation" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "problem_examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_code_templates" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "language" "SupportedLanguage" NOT NULL,
    "starterCode" TEXT NOT NULL,

    CONSTRAINT "problem_code_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_topics" (
    "problemId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "problem_topics_pkey" PRIMARY KEY ("problemId","topicId")
);

-- CreateTable
CREATE TABLE "testcases" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "visibility" "TestcaseVisibility" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testcases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "language" "SupportedLanguage" NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "result" "SubmissionResult" NOT NULL DEFAULT 'pending',
    "executionTimeMs" INTEGER,
    "memoryKb" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_testcase_results" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "testcaseId" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "actualOutput" TEXT,
    "error" TEXT,
    "executionTimeMs" INTEGER,
    "memoryKb" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_testcase_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "problems_numericId_key" ON "problems"("numericId");

-- CreateIndex
CREATE UNIQUE INDEX "problems_slug_key" ON "problems"("slug");

-- CreateIndex
CREATE INDEX "problems_status_idx" ON "problems"("status");

-- CreateIndex
CREATE INDEX "problems_difficulty_idx" ON "problems"("difficulty");

-- CreateIndex
CREATE INDEX "problems_status_difficulty_idx" ON "problems"("status", "difficulty");

-- CreateIndex
CREATE INDEX "problems_numericId_idx" ON "problems"("numericId");

-- CreateIndex
CREATE INDEX "problem_examples_problemId_idx" ON "problem_examples"("problemId");

-- CreateIndex
CREATE INDEX "problem_code_templates_problemId_idx" ON "problem_code_templates"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "problem_code_templates_problemId_language_key" ON "problem_code_templates"("problemId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "topics_name_key" ON "topics"("name");

-- CreateIndex
CREATE UNIQUE INDEX "topics_slug_key" ON "topics"("slug");

-- CreateIndex
CREATE INDEX "problem_topics_topicId_idx" ON "problem_topics"("topicId");

-- CreateIndex
CREATE INDEX "testcases_problemId_idx" ON "testcases"("problemId");

-- CreateIndex
CREATE INDEX "testcases_problemId_visibility_idx" ON "testcases"("problemId", "visibility");

-- CreateIndex
CREATE INDEX "submissions_userId_idx" ON "submissions"("userId");

-- CreateIndex
CREATE INDEX "submissions_problemId_idx" ON "submissions"("problemId");

-- CreateIndex
CREATE INDEX "submissions_result_idx" ON "submissions"("result");

-- CreateIndex
CREATE INDEX "submissions_submittedAt_idx" ON "submissions"("submittedAt");

-- CreateIndex
CREATE INDEX "submissions_userId_submittedAt_idx" ON "submissions"("userId", "submittedAt");

-- CreateIndex
CREATE INDEX "submissions_userId_problemId_idx" ON "submissions"("userId", "problemId");

-- CreateIndex
CREATE INDEX "submission_testcase_results_submissionId_idx" ON "submission_testcase_results"("submissionId");

-- CreateIndex
CREATE INDEX "submission_testcase_results_testcaseId_idx" ON "submission_testcase_results"("testcaseId");

-- CreateIndex
CREATE UNIQUE INDEX "submission_testcase_results_submissionId_testcaseId_key" ON "submission_testcase_results"("submissionId", "testcaseId");

-- AddForeignKey
ALTER TABLE "problem_examples" ADD CONSTRAINT "problem_examples_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_code_templates" ADD CONSTRAINT "problem_code_templates_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_topics" ADD CONSTRAINT "problem_topics_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_topics" ADD CONSTRAINT "problem_topics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testcases" ADD CONSTRAINT "testcases_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_testcase_results" ADD CONSTRAINT "submission_testcase_results_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_testcase_results" ADD CONSTRAINT "submission_testcase_results_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "testcases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
