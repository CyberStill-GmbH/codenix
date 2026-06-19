import type { SupportedJudgeLanguage } from "../supported-languages";

export const JUDGE_QUEUE_NAME = "judge-queue";

export interface TestcasePayload {
  id?: string;
  input: string;
  expectedOutput?: string | null;
}

export interface JudgeJobPayload {
  runId?: string;
  submissionId?: string;
  problemId: string;
  language: SupportedJudgeLanguage;
  sourceCode: string;
  testcases: TestcasePayload[];
  timeLimitMs: number;
  memoryLimitMb: number;
}
