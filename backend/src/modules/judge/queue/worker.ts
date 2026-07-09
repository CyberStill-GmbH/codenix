import { Worker, type Job } from "bullmq";
import type { SubmissionResult } from "../../../generated/prisma/client";
import { env } from "../../../config/env";
import { prisma } from "../../../db/prisma";
import { compareOutput } from "../comparators";
import { getVerdict } from "../verdicts";
import { CompileError } from "../sandbox/runners/base.runner";
import { createRunner } from "../sandbox/runner-factory";
import { JUDGE_QUEUE_NAME, type JudgeJobPayload } from "./types";

type FinalVerdict = Exclude<SubmissionResult, "pending">;

interface TestcaseResultData {
  testcaseId?: string;
  input: string;
  expectedOutput: string | null;
  actualOutput: string;
  error: string;
  passed: boolean;
  executionTimeMs: number;
  memoryKb: number;
}

async function persistInternalError(payload: JudgeJobPayload, message: string) {
  if (payload.submissionId) {
    await prisma.submission.updateMany({
      where: { id: payload.submissionId, result: "pending" },
      data: { result: "internal_error", compileOutput: message },
    });
  } else if (payload.runId) {
    await prisma.codeRun.updateMany({
      where: { id: payload.runId, status: { in: ["pending", "running"] } },
      data: { status: "internal_error", error: message },
    });
  }
}

async function persistResult(
  payload: JudgeJobPayload,
  verdict: FinalVerdict,
  compileOutput: string,
  results: TestcaseResultData[],
  totalTimeMs: number,
  maxMemoryKb: number,
) {
  if (payload.submissionId) {
    const submissionId = payload.submissionId;
    await prisma.$transaction(async (tx) => {
      await tx.submission.update({
        where: { id: submissionId },
        data: {
          result: verdict,
          compileOutput: compileOutput || null,
          executionTimeMs: totalTimeMs,
          memoryKb: maxMemoryKb,
        },
      });
      await tx.submissionTestcaseResult.deleteMany({ where: { submissionId } });
      if (results.length > 0) {
        await tx.submissionTestcaseResult.createMany({
          data: results.map((result) => ({
            submissionId,
            testcaseId: result.testcaseId!,
            actualOutput: result.actualOutput || null,
            error: result.error || null,
            passed: result.passed,
            executionTimeMs: result.executionTimeMs,
            memoryKb: result.memoryKb,
          })),
        });
      }
    });
    return;
  }

  const runId = payload.runId!;
  await prisma.$transaction(async (tx) => {
    await tx.codeRun.update({
      where: { id: runId },
      data: {
        status: verdict,
        compileOutput: compileOutput || null,
        stdout: results.map((result) => result.actualOutput).join("\n") || null,
        stderr:
          results
            .map((result) => result.error)
            .filter(Boolean)
            .join("\n") || null,
        executionTimeMs: totalTimeMs,
        memoryKb: maxMemoryKb,
      },
    });
    await tx.codeRunTestcaseResult.deleteMany({ where: { runId } });
    if (results.length > 0) {
      await tx.codeRunTestcaseResult.createMany({
        data: results.map((result) => ({
          runId,
          ...(result.testcaseId ? { testcaseId: result.testcaseId } : {}),
          input: result.input,
          expectedOutput: result.expectedOutput,
          actualOutput: result.actualOutput || null,
          error: result.error || null,
          passed: result.passed,
          executionTimeMs: result.executionTimeMs,
          memoryKb: result.memoryKb,
        })),
      });
    }
  });
}

export async function processJudgeJob(job: Job<JudgeJobPayload>) {
  const payload = job.data;
  if ((payload.runId ? 1 : 0) + (payload.submissionId ? 1 : 0) !== 1) {
    throw new Error("A judge job must identify exactly one run or submission.");
  }

  const runner = createRunner(payload.language, {
    sourceCode: payload.sourceCode,
    timeLimitMs: payload.timeLimitMs,
    memoryLimitMb: payload.memoryLimitMb,
  });
  let compileOutput = "";
  const results: TestcaseResultData[] = [];
  let overallVerdict: FinalVerdict = "accepted";
  let totalTimeMs = 0;
  let maxMemoryKb = 0;

  try {
    if (payload.runId) {
      await prisma.codeRun.update({
        where: { id: payload.runId },
        data: { status: "running" },
      });
    }

    try {
      await runner.prepare();

      const compile = await runner.compile();
      compileOutput = compile.stderr || compile.stdout;
    } catch (error) {
      if (error instanceof CompileError) {
        overallVerdict = "compilation_error";
        compileOutput = error.result.stderr || error.result.stdout;
      } else {
        throw error;
      }
    }

    if (overallVerdict !== "compilation_error") {
      for (const testcase of payload.testcases) {
        const execution = await runner.execute(testcase.input);
        const isCorrect =
          testcase.expectedOutput == null ||
          compareOutput(execution.stdout, testcase.expectedOutput);
        const verdict = getVerdict(
          execution.isTLE,
          execution.isOOM,
          execution.isOutputLimitExceeded,
          execution.exitCode,
          isCorrect,
        );

        totalTimeMs += execution.executionTimeMs;
        maxMemoryKb = Math.max(maxMemoryKb, execution.memoryKb);
        results.push({
          ...(testcase.id ? { testcaseId: testcase.id } : {}),
          input: testcase.input,
          expectedOutput: testcase.expectedOutput ?? null,
          actualOutput: execution.stdout,
          error: execution.stderr,
          passed: verdict === "accepted",
          executionTimeMs: execution.executionTimeMs,
          memoryKb: execution.memoryKb,
        });

        if (overallVerdict === "accepted" && verdict !== "accepted") {
          overallVerdict = verdict;
        }
      }
    }

    await persistResult(
      payload,
      overallVerdict,
      compileOutput,
      results,
      totalTimeMs,
      maxMemoryKb,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown judge error";
    await persistInternalError(payload, message);
    throw error;
  } finally {
    try {
      await runner.cleanup();
    } catch (error) {
      console.error("Judge sandbox cleanup failed", error);
    }
  }
}

export function createJudgeWorker() {
  return new Worker<JudgeJobPayload>(JUDGE_QUEUE_NAME, processJudgeJob, {
    connection: { url: env.REDIS_URL },
    concurrency: 5,
  });
}
