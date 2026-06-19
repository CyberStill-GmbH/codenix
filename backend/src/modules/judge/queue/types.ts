import { SupportedLanguage } from "../../../generated/prisma/client";

export interface TestcasePayload {
  id: string;
  input: string;
  expectedOutput?: string | null;
}

export interface JudgeJobPayload {
  runId?: string;
  submissionId?: string;
  problemId: string;
  language: SupportedLanguage;
  sourceCode: string;
  testcases: TestcasePayload[];
  timeLimitMs: number;
  memoryLimitMb: number;
}
