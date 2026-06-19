import { prisma } from "../../db/prisma";
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
      throw new AppError(403, "FORBIDDEN", "You don't have permission to view this run");
    }

    return {
      id: run.id,
      problemId: run.problemId,
      problemTitle: run.problem.title,
      problemSlug: run.problem.slug,
      language: run.language,
      sourceCode: run.sourceCode,
      status: run.status,
      stdout: run.stdout,
      stderr: run.stderr,
      error: run.error,
      executionTimeMs: run.executionTimeMs,
      memoryKb: run.memoryKb,
      createdAt: run.createdAt.toISOString(),
      updatedAt: run.updatedAt.toISOString(),
      testcaseResults: run.testcaseResults.map((tc) => ({
        id: tc.id,
        testcaseId: tc.testcaseId,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: tc.actualOutput,
        error: tc.error,
        passed: tc.passed,
        executionTimeMs: tc.executionTimeMs,
        memoryKb: tc.memoryKb,
      })),
    };
  }
}

export const runsService = new RunsService();
