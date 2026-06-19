import { Worker, type Job } from "bullmq";
import { env } from "../../../config/env";
import { JUDGE_QUEUE_NAME } from "./producer";
import type { JudgeJobPayload } from "./types";
import { CompileError } from "../sandbox/runners/base.runner";
import { PythonRunner } from "../sandbox/runners/python.runner";
import { JavascriptRunner } from "../sandbox/runners/javascript.runner";
import { TypescriptRunner } from "../sandbox/runners/typescript.runner";
import { CRunner } from "../sandbox/runners/c.runner";
import { RustRunner } from "../sandbox/runners/rust.runner";
import { compareOutput } from "../comparators";
import { getVerdict } from "../verdicts";
import { prisma } from "../../../db/prisma";
import type { BaseRunner } from "../sandbox/runners/base.runner";

function getRunner(payload: JudgeJobPayload): BaseRunner {
  const config = {
    sourceCode: payload.sourceCode,
    timeLimitMs: payload.timeLimitMs,
    memoryLimitMb: payload.memoryLimitMb
  };

  switch (payload.language) {
    case "python": return new PythonRunner(config);
    case "javascript": return new JavascriptRunner(config);
    case "typescript": return new TypescriptRunner(config);
    case "c": return new CRunner(config);
    case "rust": return new RustRunner(config);
    default: throw new Error(`Unsupported language: ${String(payload.language)}`);
  }
}

export const judgeWorker = new Worker<JudgeJobPayload>(JUDGE_QUEUE_NAME, async (job: Job<JudgeJobPayload>) => {
  const payload = job.data;
  const isSubmission = !!payload.submissionId;
  const recordId = payload.submissionId || payload.runId;
  
  if (!recordId) throw new Error("No runId or submissionId provided");

  const runner = getRunner(payload);
  
  // Set initial status to RUNNING
  if (isSubmission) {
    await prisma.submission.update({
      where: { id: payload.submissionId! },
      data: { status: "running" }
    });
  } else {
    await prisma.codeRun.update({
      where: { id: payload.runId! },
      data: { status: "running" }
    });
  }

  let compileOutput = "";
  let compileError = false;
  
  try {
    const prepResult = await runner.prepare();
    if (prepResult.compileOutput) {
      compileOutput = prepResult.compileOutput;
    }
  } catch (error) {
    compileError = true;
    compileOutput = error instanceof CompileError ? error.compileOutput : String(error);
  }

  interface TestcaseResultData {
    testcaseId: string;
    testcaseInput: string;
    expectedOutput: string | null;
    verdict: "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded" | "memory_limit_exceeded" | "compilation_error" | "internal_error" | "pending";
    actualOutput: string;
    error: string;
    passed: boolean;
    executionTimeMs: number;
    memoryKb: number;
  }

  const results: TestcaseResultData[] = [];
  let overallVerdict: "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded" | "memory_limit_exceeded" | "compilation_error" | "internal_error" | "pending" = "accepted";
  let totalTimeMs = 0;
  let maxMemoryKb = 0;
  
  if (compileError) {
    overallVerdict = "compilation_error";
  } else {
    for (const tc of payload.testcases) {
      const execResult = await runner.run(tc.input);
      
      const isCorrect = tc.expectedOutput != null ? compareOutput(execResult.stdout, tc.expectedOutput) : true;
      const verdict = getVerdict(execResult.isTLE, execResult.isOOM, execResult.exitCode, isCorrect);
      
      totalTimeMs += execResult.executionTimeMs;
      maxMemoryKb = Math.max(maxMemoryKb, execResult.memoryKb);
      
      results.push({
        testcaseId: tc.id,
        testcaseInput: tc.input,
        expectedOutput: tc.expectedOutput ?? null,
        verdict,
        actualOutput: execResult.stdout,
        error: execResult.stderr,
        passed: verdict === "accepted",
        executionTimeMs: execResult.executionTimeMs,
        memoryKb: execResult.memoryKb
      });
      
      if (verdict !== "accepted" && overallVerdict === "accepted") {
        overallVerdict = verdict;
      }
    }
  }

  await runner.cleanup();

  if (isSubmission) {
    await prisma.$transaction(async (tx) => {
      await tx.submission.update({
        where: { id: payload.submissionId! },
        data: {
          status: "completed",
          result: overallVerdict,
          compileOutput: compileOutput || null,
          executionTimeMs: totalTimeMs,
          memoryKb: maxMemoryKb,
        }
      });
      
      for (const res of results) {
        await tx.submissionTestcaseResult.create({
          data: {
            submissionId: payload.submissionId!,
            testcaseId: res.testcaseId,
            actualOutput: res.actualOutput || null,
            error: res.error || null,
            passed: res.passed,
            executionTimeMs: res.executionTimeMs,
            memoryKb: res.memoryKb
          }
        });
      }

      if (overallVerdict === "accepted") {
        const sub = await tx.submission.findUnique({ where: { id: payload.submissionId! }, select: { userId: true, problemId: true } });
        if (sub) {
          await tx.userProblem.upsert({
            where: { userId_problemId: { userId: sub.userId, problemId: sub.problemId } },
            create: { userId: sub.userId, problemId: sub.problemId, isSolved: true },
            update: { isSolved: true }
          });
        }
      }
    });
  } else {
    await prisma.$transaction(async (tx) => {
      await tx.codeRun.update({
        where: { id: payload.runId! },
        data: {
          status: "completed",
          compileOutput: compileOutput || null,
          executionTimeMs: totalTimeMs,
          memoryKb: maxMemoryKb,
        }
      });

      for (const res of results) {
        await tx.codeRunTestcaseResult.create({
          data: {
            runId: payload.runId!,
            testcaseId: res.testcaseId,
            input: res.testcaseInput,
            expectedOutput: res.expectedOutput,
            actualOutput: res.actualOutput || null,
            error: res.error || null,
            passed: res.passed,
            executionTimeMs: res.executionTimeMs,
            memoryKb: res.memoryKb
          }
        });
      }
    });
  }
}, {
  connection: {
    url: env.REDIS_URL
  },
  concurrency: 5
});
