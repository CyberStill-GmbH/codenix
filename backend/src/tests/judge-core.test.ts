import { describe, expect, it } from "vitest";
import { compareOutput } from "../modules/judge/comparators/index";
import {
  MockJudgeService,
  type JudgeRunInput,
} from "../modules/judge/judge.service";
import { getVerdict } from "../modules/judge/verdicts/index";

const testcases: JudgeRunInput["testcases"] = [
  { id: "first", input: "1", expectedOutput: "one" },
  { id: "second", input: "2", expectedOutput: "two" },
];

function createJudgeInput(sourceCode: string): JudgeRunInput {
  return {
    language: "python",
    sourceCode,
    testcases,
    timeLimitMs: 1000,
    memoryLimitMb: 128,
  };
}

describe("judge output comparison", () => {
  it("ignores surrounding whitespace and trailing whitespace on each line", () => {
    expect(compareOutput(" one  \ntwo\t\n", "one\ntwo")).toBe(true);
  });

  it("treats nullish expected output as empty text", () => {
    expect(compareOutput("", null)).toBe(true);
    expect(compareOutput("result", undefined)).toBe(false);
  });

  it("preserves meaningful whitespace within a line", () => {
    expect(compareOutput("hello world", "hello  world")).toBe(false);
  });
});

describe("judge verdict selection", () => {
  it.each([
    {
      conditions: [true, true, true, 1, false] as const,
      verdict: "time_limit_exceeded",
    },
    {
      conditions: [false, true, true, 1, false] as const,
      verdict: "memory_limit_exceeded",
    },
    {
      conditions: [false, false, true, 0, true] as const,
      verdict: "runtime_error",
    },
    {
      conditions: [false, false, false, 1, true] as const,
      verdict: "runtime_error",
    },
    {
      conditions: [false, false, false, 0, false] as const,
      verdict: "wrong_answer",
    },
    {
      conditions: [false, false, false, 0, true] as const,
      verdict: "accepted",
    },
  ])(
    "returns $verdict with the expected precedence",
    ({ conditions, verdict }) => {
      expect(
        getVerdict(
          conditions[0],
          conditions[1],
          conditions[2],
          conditions[3],
          conditions[4],
        ),
      ).toBe(verdict);
    },
  );
});

describe("mock judge service", () => {
  const service = new MockJudgeService();

  it.each([
    {
      marker: "__CE_FAIL_COMPILE__",
      status: "compilation_error",
      error: "Compilation failed simulated",
      testcaseError: "Compilation failed",
    },
    {
      marker: "__CE_RUNTIME_ERROR__",
      status: "runtime_error",
      error: "Runtime error simulated",
      testcaseError: "Runtime error simulated",
    },
    {
      marker: "__CE_TLE__",
      status: "time_limit_exceeded",
      error: "Time limit exceeded simulated",
      testcaseError: "Time limit exceeded simulated",
    },
  ] as const)(
    "returns $status for the $marker marker",
    async ({ marker, status, error, testcaseError }) => {
      const result = await service.run(createJudgeInput(marker));

      expect(result).toMatchObject({
        status,
        error,
        testcaseResults: testcases.map((testcase) => ({
          testcaseId: testcase.id,
          passed: false,
          error: testcaseError,
        })),
      });
    },
  );

  it("returns mixed testcase results for a simulated wrong answer", async () => {
    const result = await service.run(createJudgeInput("__CE_WA__"));

    expect(result.status).toBe("wrong_answer");
    expect(result.testcaseResults).toEqual([
      {
        testcaseId: "first",
        passed: true,
        actualOutput: "one",
      },
      {
        testcaseId: "second",
        passed: false,
        actualOutput: "wrong output",
      },
    ]);
  });

  it("returns accepted metrics and expected output by default", async () => {
    const result = await service.run(createJudgeInput("print('ok')"));

    expect(result).toEqual({
      status: "accepted",
      executionTimeMs: 15,
      memoryKb: 1024,
      testcaseResults: [
        {
          testcaseId: "first",
          passed: true,
          actualOutput: "one",
          executionTimeMs: 15,
          memoryKb: 1024,
        },
        {
          testcaseId: "second",
          passed: true,
          actualOutput: "two",
          executionTimeMs: 15,
          memoryKb: 1024,
        },
      ],
    });
  });
});
