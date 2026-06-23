import { prisma } from "../../db/prisma";
import type { CodeRunTestcaseResult } from "../../generated/prisma/client";
import { AppError } from "../../shared/errors/app-error";

export class RunsService {
  async getRunById(runId: string, userId: string) {
    const run = await prisma.codeRun.findUnique({
      where: { id: runId },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
          },
        },
        testcaseResults: true,
      },
    });

    if (!run) {
      throw new AppError(404, "RUN_NOT_FOUND", "Code run not found");
    }

    if (run.userId !== userId) {
      throw new AppError(404, "RUN_NOT_FOUND", "Code run not found");
    }

    const testcaseResults = run.testcaseResults.map(
      (testcase: CodeRunTestcaseResult, index: number) => ({
      id: testcase.id,
      index: index + 1,
      testcaseId: testcase.testcaseId,
      input: testcase.input,
      expectedOutput: testcase.expectedOutput ?? undefined,
      actualOutput: testcase.actualOutput ?? undefined,
      stdout: testcase.actualOutput ?? undefined,
      stderr: testcase.error ?? undefined,
      error: testcase.error ?? undefined,
      passed: testcase.passed,
      executionTimeMs: testcase.executionTimeMs ?? undefined,
      memoryKb: testcase.memoryKb ?? undefined
    }));

    return {
      id: run.id,
      problemId: run.problemId,
      problemTitle: run.problem.title,
      problemSlug: run.problem.slug,
      language: run.language,
      status: run.status,
      stdout: run.stdout,
      stderr: run.stderr,
      error: run.error
        ? { message: run.error, stderr: run.stderr ?? undefined }
        : undefined,
      executionTimeMs: run.executionTimeMs,
      memoryKb: run.memoryKb,
      createdAt: run.createdAt.toISOString(),
      updatedAt: run.updatedAt.toISOString(),
      testcases: testcaseResults,
      testcaseResults
    };
  }
}

export const runsService = new RunsService();
