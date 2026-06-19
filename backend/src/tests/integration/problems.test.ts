import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import { prisma } from "../../db/prisma";
import { registerAndLoginTestUser } from "../helpers/auth.helper";
import { cleanDatabase } from "../helpers/db.helper";

async function createPublishedProblem(slug: string, title: string) {
  return prisma.problem.create({
    data: {
      title,
      slug,
      difficulty: "easy",
      status: "published",
      statement: "Solve it.",
      inputFormat: "Input.",
      outputFormat: "Output.",
      constraints: "Constraints.",
      acceptance: 0
    }
  });
}

describe("Problems API", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("returns paginated problems response shape", async () => {
    await createPublishedProblem("sum", "Sum");

    const res = await request(app).get("/api/problems?page=1&pageSize=10");

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.meta).toBeDefined();
  });

  it("marks accepted problems as solved for authenticated users", async () => {
    const { accessToken, user } = await registerAndLoginTestUser();
    const problem = await createPublishedProblem("accepted-problem", "Accepted");

    await prisma.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        language: "typescript",
        sourceCode: "return true;",
        result: "accepted"
      }
    });

    const res = await request(app)
      .get("/api/problems?page=1&pageSize=10")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data[0].solved).toBe(true);
  });

  it("does not mark problems as solved without accepted submissions", async () => {
    const { accessToken } = await registerAndLoginTestUser();
    await createPublishedProblem("unsolved-problem", "Unsolved");

    const res = await request(app)
      .get("/api/problems?page=1&pageSize=10")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data[0].solved).toBe(false);
  });

  it("does not mark failed submissions as solved", async () => {
    const { accessToken, user } = await registerAndLoginTestUser();
    const problem = await createPublishedProblem("failed-problem", "Failed");

    await prisma.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        language: "typescript",
        sourceCode: "throw new Error();",
        result: "wrong_answer"
      }
    });

    const res = await request(app)
      .get("/api/problems?page=1&pageSize=10")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data[0].solved).toBe(false);
  });

  it("does not expose solved state for unauthenticated users", async () => {
    const { user } = await registerAndLoginTestUser();
    const problem = await createPublishedProblem("private-solved", "Private Solved");

    await prisma.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        language: "typescript",
        sourceCode: "return true;",
        result: "accepted"
      }
    });

    const res = await request(app).get("/api/problems?page=1&pageSize=10");

    expect(res.status).toBe(200);
    expect(res.body.data[0].solved).toBe(false);
  });

  it("returns solved state in problem detail for authenticated users", async () => {
    const { accessToken, user } = await registerAndLoginTestUser();
    const problem = await createPublishedProblem("detail-solved", "Detail Solved");

    await prisma.submission.create({
      data: {
        userId: user.id,
        problemId: problem.id,
        language: "typescript",
        sourceCode: "return true;",
        result: "accepted"
      }
    });

    const res = await request(app)
      .get("/api/problems/detail-solved")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.solved).toBe(true);
  });
});
