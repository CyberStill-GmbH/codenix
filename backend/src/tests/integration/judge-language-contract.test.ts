import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import { prisma } from "../../db/prisma";
import { judgeQueue } from "../../modules/judge/queue/producer";
import { SUPPORTED_JUDGE_LANGUAGES } from "../../modules/judge/supported-languages";
import { registerAndLoginTestUser } from "../helpers/auth.helper";
import { cleanDatabase } from "../helpers/db.helper";

async function createProblemWithEveryJudgeLanguage() {
  return prisma.problem.create({
    data: {
      title: "Language contract",
      slug: "language-contract",
      difficulty: "easy",
      status: "published",
      statement: "Validate every enabled language.",
      inputFormat: "A number.",
      outputFormat: "A number.",
      constraints: "1 <= n <= 10",
      acceptance: 0,
      codeTemplates: {
        create: SUPPORTED_JUDGE_LANGUAGES.map((language) => ({
          language,
          starterCode: "Write your solution here."
        }))
      },
      testcases: {
        create: [
          {
            input: "1",
            expectedOutput: "1",
            visibility: "sample",
            weight: 1,
            orderIndex: 1
          },
          {
            input: "2",
            expectedOutput: "2",
            visibility: "hidden",
            weight: 1,
            orderIndex: 2
          }
        ]
      }
    }
  });
}

describe("Judge language contract", () => {
  beforeEach(async () => {
    await cleanDatabase();
    await judgeQueue.drain();
  });

  it("accepts every language advertised by problem detail", async () => {
    const { accessToken } = await registerAndLoginTestUser();
    const problem = await createProblemWithEveryJudgeLanguage();

    const detail = await request(app).get(`/api/problems/${problem.slug}`);
    const advertisedLanguages = detail.body.codeTemplates.map(
      (template: { language: string }) => template.language
    );

    expect(advertisedLanguages).toEqual(expect.arrayContaining([
      ...SUPPORTED_JUDGE_LANGUAGES
    ]));

    for (const language of advertisedLanguages) {
      const runResponse = await request(app)
        .post(`/api/problems/${problem.slug}/run`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ language, sourceCode: "placeholder" });
      const submissionResponse = await request(app)
        .post(`/api/problems/${problem.slug}/submissions`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ language, sourceCode: "placeholder" });

      expect(runResponse.status, `Run rejected ${language}`).toBe(202);
      expect(submissionResponse.status, `Submit rejected ${language}`).toBe(202);
    }
  });
});
