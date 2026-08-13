import { describe, expect, it } from "vitest";
import {
  createOAuthState,
  verifyOAuthState,
} from "../modules/auth/oauth.state";
import { runCodeRequestSchema } from "../modules/problems/problems.schema";
import { toSubmissionDetail } from "../modules/submissions/submissions.mapper";

describe("security regressions", () => {
  it("rejects an OAuth state that was not issued to the current browser", () => {
    const attackerState = createOAuthState("google", "/problems");
    const victimState = createOAuthState("google", "/profile");

    expect(() =>
      verifyOAuthState(attackerState, "google", victimState),
    ).toThrowError("Invalid OAuth state.");
  });

  it("accepts an OAuth state bound to the current browser", () => {
    const state = createOAuthState("github", "/problems");

    expect(verifyOAuthState(state, "github", state)).toEqual({
      provider: "github",
      returnTo: "/problems",
    });
  });

  it("rejects user-selected testcase IDs in run requests", () => {
    const result = runCodeRequestSchema.safeParse({
      language: "python",
      sourceCode: "print('hello')",
      testcaseIds: ["123e4567-e89b-12d3-a456-426614174000"],
    });

    expect(result.success).toBe(false);
  });

  it("masks hidden testcase output and errors from submission details", () => {
    const now = new Date();
    const submission = {
      id: "submission-id",
      userId: "user-id",
      problemId: "problem-id",
      language: "python",
      sourceCode: "print(input())",
      result: "wrong_answer",
      compileOutput: null,
      executionTimeMs: 10,
      memoryKb: 128,
      submittedAt: now,
      updatedAt: now,
      problem: {
        title: "Secret Problem",
        slug: "secret-problem",
        difficulty: "hard",
        acceptance: 0,
        topics: [],
      },
    } as Parameters<typeof toSubmissionDetail>[0];
    const hiddenResult = {
      id: "result-id",
      submissionId: submission.id,
      testcaseId: "hidden-testcase-id",
      passed: false,
      actualOutput: "secret input",
      error: "secret input",
      executionTimeMs: 10,
      memoryKb: 128,
      createdAt: now,
      testcase: {
        id: "hidden-testcase-id",
        problemId: submission.problemId,
        input: "secret input",
        expectedOutput: "secret output",
        visibility: "hidden",
        weight: 1,
        orderIndex: 0,
        createdAt: now,
        updatedAt: now,
      },
    } as Parameters<typeof toSubmissionDetail>[1][number];

    const detail = toSubmissionDetail(submission, [hiddenResult]);

    expect(detail.testcaseResults[0]).toMatchObject({
      testcaseId: null,
      input: null,
      expectedOutput: null,
      actualOutput: null,
      error: null,
    });
  });
});
