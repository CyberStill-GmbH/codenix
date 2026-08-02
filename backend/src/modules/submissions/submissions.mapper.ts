import type {
  Prisma,
  Submission,
  SubmissionResult,
  SubmissionTestcaseResult,
  Testcase,
} from "../../generated/prisma/client";

type SubmissionListItemModel = Prisma.SubmissionGetPayload<{
  include: {
    problem: {
      include: {
        topics: {
          include: {
            topic: true;
          };
        };
      };
    };
  };
}>;

type SubmissionDetailModel = Prisma.SubmissionGetPayload<{
  include: {
    problem: {
      include: {
        topics: {
          include: {
            topic: true;
          };
        };
      };
    };
  };
}>;

type SubmissionWithOptionalRuntimeFields = Submission & {
  sourceCode?: string | null;
  stdout?: string | null;
  stderr?: string | null;
  error?: string | null;
  stackTrace?: string | null;
  compileOutput?: string | null;
};

type TestcaseResultWithTestcase = SubmissionTestcaseResult & {
  testcase: Testcase;
};

const resultLabels: Record<SubmissionResult, string> = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  runtime_error: "Runtime Error",
  time_limit_exceeded: "Time Limit Exceeded",
  memory_limit_exceeded: "Memory Limit Exceeded",
  compilation_error: "Compilation Error",
  internal_error: "Internal Error",
  pending: "Pending",
};

function mapTopics(
  submission: SubmissionListItemModel | SubmissionDetailModel,
) {
  return submission.problem.topics.map((item) => item.topic.name);
}

export function toSubmissionListItem(submission: SubmissionListItemModel) {
  return {
    id: submission.id,
    problemId: submission.problemId,
    problemTitle: submission.problem.title,
    problemSlug: submission.problem.slug,
    difficulty: submission.problem.difficulty,
    result: resultLabels[submission.result],
    language: submission.language,
    submittedAt: submission.submittedAt.toISOString(),
    executionTimeMs: submission.executionTimeMs,
    memoryKb: submission.memoryKb,
    submissionsCount: 1,
    acceptance: submission.problem.acceptance,
    topics: mapTopics(submission),
  };
}

export function toSubmissionDetail(
  submission: SubmissionDetailModel,
  testcaseResults: TestcaseResultWithTestcase[],
) {
  const runtimeSubmission = submission as SubmissionWithOptionalRuntimeFields;
  const passedCases = testcaseResults.filter((result) => result.passed).length;
  const failedResult = testcaseResults.find((result) => !result.passed);

  const mapTestcase = (result: TestcaseResultWithTestcase, index: number) => {
    const isSample = result.testcase.visibility === "sample";

    return {
      id: result.id,
      index: index + 1,
      testcaseId: isSample ? result.testcaseId : null,
      visibility: result.testcase.visibility,
      input: isSample ? result.testcase.input : null,
      expectedOutput: isSample ? result.testcase.expectedOutput : null,
      actualOutput: isSample ? result.actualOutput : null,
      error: isSample ? result.error : null,
      passed: result.passed,
      executionTimeMs: result.executionTimeMs,
      memoryKb: result.memoryKb,
    };
  };

  return {
    id: submission.id,
    problemId: submission.problemId,
    problemTitle: submission.problem.title,
    problemSlug: submission.problem.slug,
    difficulty: submission.problem.difficulty,
    topics: mapTopics(submission),

    result: resultLabels[submission.result],
    resultCode: submission.result,
    status: submission.result,
    language: submission.language,
    submittedAt: submission.submittedAt.toISOString(),

    sourceCode: runtimeSubmission.sourceCode ?? "",
    stdout: runtimeSubmission.stdout ?? null,
    stderr: runtimeSubmission.stderr ?? null,
    error:
      (runtimeSubmission.error ?? runtimeSubmission.compileOutput)
        ? {
            message:
              runtimeSubmission.error ??
              runtimeSubmission.compileOutput ??
              "Judge execution failed.",
          }
        : null,
    stackTrace: runtimeSubmission.stackTrace ?? null,

    executionTimeMs: submission.executionTimeMs,
    memoryKb: submission.memoryKb,

    passedCases,
    totalCases: testcaseResults.length,
    failedCase: failedResult
      ? mapTestcase(failedResult, testcaseResults.indexOf(failedResult))
      : undefined,
    testcaseResults: testcaseResults.map(mapTestcase),
  };
}
