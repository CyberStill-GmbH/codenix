import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import { prisma } from "../../db/prisma";
import { signAccessToken } from "../../modules/auth/jwt.service";
import { cleanDatabase } from "../helpers/db.helper";

async function createUser(index: number) {
  return prisma.user.create({
    data: {
      name: `User ${index}`,
      username: `user-${index}`,
      email: `user-${index}@test.com`,
      passwordHash: "hashed-password"
    }
  });
}

async function createProblem(index: number) {
  return prisma.problem.create({
    data: {
      title: `Problem ${index}`,
      slug: `problem-${index}`,
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

async function createSubmission(
  userId: string,
  problemId: string,
  result: "accepted" | "wrong_answer" = "accepted"
) {
  return prisma.submission.create({
    data: {
      userId,
      problemId,
      language: "typescript",
      sourceCode: "return true;",
      result
    }
  });
}

describe("Users API", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("rejects unauthenticated stats requests", async () => {
    const res = await request(app).get("/api/users/me/stats");

    expect(res.status).toBe(401);
  });

  it("returns percentile and aggregate ranking distribution", async () => {
    const [currentUser, userTwo, userThree, userFour] = await Promise.all([
      createUser(1),
      createUser(2),
      createUser(3),
      createUser(4)
    ]);
    const [problemOne, problemTwo, problemThree] = await Promise.all([
      createProblem(1),
      createProblem(2),
      createProblem(3)
    ]);

    await Promise.all([
      createSubmission(currentUser.id, problemOne.id),
      createSubmission(currentUser.id, problemTwo.id),
      createSubmission(userTwo.id, problemOne.id),
      createSubmission(userThree.id, problemOne.id),
      createSubmission(userThree.id, problemTwo.id),
      createSubmission(userThree.id, problemThree.id),
      createSubmission(userFour.id, problemOne.id, "wrong_answer")
    ]);

    const res = await request(app)
      .get("/api/users/me/stats")
      .set("Authorization", `Bearer ${signAccessToken(currentUser.id)}`);

    expect(res.status).toBe(200);
    expect(res.body.rank).toBe(2);
    expect(res.body.percentile).toBe(75);
    expect(res.body.totalUsers).toBe(4);
    expect(res.body.distribution).toEqual([
      {
        bucket: "0",
        count: 1
      },
      {
        bucket: "1-5",
        count: 3
      }
    ]);
    expect(
      res.body.distribution.reduce(
        (sum: number, item: { count: number }) => sum + item.count,
        0
      )
    ).toBe(res.body.totalUsers);
  });
});
