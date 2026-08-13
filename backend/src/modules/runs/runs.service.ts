import { prisma } from "../../db/prisma";
import type {
  CodeRunTestcaseResult,
  TestcaseVisibility,
} from "../../generated/prisma/client";
import { AppError } from "../../shared/errors/app-error";

type CodeRunTestcaseResultWithVisibility = CodeRunTestcaseResult & {
  testcase: {
    visibility: TestcaseVisibility;
  } | null;
};

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
        testcaseResults: {
          include: {
            testcase: {
              select: {
                visibility: true,
              },
            },
          },
        },
      },
    });

    if (!run) {
      throw new AppError(404, "RUN_NOT_FOUND", "Code run not found");
    }

    if (run.userId !== userId) {
      throw new AppError(404, "RUN_NOT_FOUND", "Code run not found");
    }

    const containsHiddenTestcase = run.testcaseResults.some(
      (testcase: CodeRunTestcaseResultWithVisibility) =>
        testcase.testcase?.visibility === "hidden",
    );

    const testcaseResults = run.testcaseResults.map(
      (testcase: CodeRunTestcaseResultWithVisibility, index: number) => {
        const isHidden = testcase.testcase?.visibility === "hidden";

        return {
          id: testcase.id,
          index: index + 1,
          testcaseId: isHidden ? null : testcase.testcaseId,
          input: isHidden ? null : testcase.input,
          expectedOutput: isHidden ? null : testcase.expectedOutput,
          actualOutput: isHidden ? null : testcase.actualOutput,
          stdout: isHidden ? null : testcase.actualOutput,
          stderr: isHidden ? null : testcase.error,
          error: isHidden ? null : testcase.error,
          passed: testcase.passed,
          executionTimeMs: testcase.executionTimeMs ?? undefined,
          memoryKb: testcase.memoryKb ?? undefined,
        };
      },
    );

    return {
      id: run.id,
      problemId: run.problemId,
      problemTitle: run.problem.title,
      problemSlug: run.problem.slug,
      language: run.language,
      status: run.status,
      stdout: containsHiddenTestcase ? null : run.stdout,
      stderr: containsHiddenTestcase ? null : run.stderr,
      error:
        !containsHiddenTestcase && run.error
          ? { message: run.error, stderr: run.stderr ?? undefined }
          : undefined,
      executionTimeMs: run.executionTimeMs,
      memoryKb: run.memoryKb,
      createdAt: run.createdAt.toISOString(),
      updatedAt: run.updatedAt.toISOString(),
      testcases: testcaseResults,
      testcaseResults,
    };
  }
}

export const runsService = new RunsService();
