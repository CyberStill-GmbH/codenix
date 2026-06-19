import { describe, expect, it } from "vitest";
import { PROBLEM_CATALOG } from "../../prisma/problem-catalog";
import { REFERENCE_SOLUTIONS } from "../../prisma/reference-solutions";
import { compareOutput } from "../modules/judge/comparators";
import { createRunner } from "../modules/judge/sandbox/runner-factory";
import { CompileError } from "../modules/judge/sandbox/runners/base.runner";
import { SUPPORTED_JUDGE_LANGUAGES } from "../modules/judge/supported-languages";

const verificationCases = PROBLEM_CATALOG.flatMap((problem) =>
  SUPPORTED_JUDGE_LANGUAGES.map((language) => ({ problem, language }))
);

describe("seeded problem reference solutions", () => {
  it.each(verificationCases)(
    "$problem.slug accepts the $language reference solution",
    async ({ problem, language }) => {
      const sourceCode = REFERENCE_SOLUTIONS[problem.slug][language];
      const runner = createRunner(language, {
        sourceCode,
        timeLimitMs: 3000,
        memoryLimitMb: 256
      });

      try {
        await runner.prepare();

        for (const testcase of problem.testcases) {
          const result = await runner.run(testcase.input);
          expect(result.exitCode, result.stderr).toBe(0);
          expect(result.isTLE).toBe(false);
          expect(result.isOOM).toBe(false);
          expect(
            compareOutput(result.stdout, testcase.expectedOutput),
            `${problem.slug}/${language} failed for input ${testcase.input}: ${result.stdout}`
          ).toBe(true);
        }
      } catch (error) {
        if (error instanceof CompileError) {
          throw new Error(`${problem.slug}/${language}: ${error.compileOutput}`);
        }
        throw error;
      } finally {
        await runner.cleanup();
      }
    },
    120_000
  );
});
