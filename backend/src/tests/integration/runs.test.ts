import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../db/prisma";
import { registerAndLoginTestUser } from "../helpers/auth.helper";
import { cleanDatabase } from "../helpers/db.helper";
import { processJudgeJob } from "../../modules/judge/queue/worker";
import { judgeQueue } from "../../modules/judge/queue/producer";

type JudgeJob = Parameters<typeof processJudgeJob>[0];

async function createTestProblem() {
  return prisma.problem.create({
    data: {
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "easy",
      status: "published",
      statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      inputFormat: "nums and target",
      outputFormat: "indices",
      constraints: "None",
      timeLimitMs: 10000, // generous for Docker startup in test env
      memoryLimitMb: 256,
      codeTemplates: {
        create: {
          language: "python",
          starterCode: "def twoSum(nums, target):\n    pass"
        }
      },
      testcases: {
        create: [
          {
            input: "[2,7,11,15]\n9",
            expectedOutput: "[0,1]",
            visibility: "sample",
            weight: 1.0,
            orderIndex: 0
          },
          {
            input: "[3,2,4]\n6",
            expectedOutput: "[1,2]",
            visibility: "hidden",
            weight: 1.0,
            orderIndex: 1
          }
        ]
      }
    },
    include: {
      testcases: true
    }
  });
}

function createInlineJudgeJob(
  data: JudgeJob["data"]
): JudgeJob {
  return { data } as JudgeJob;
}

describe("Runs & Submissions Queue & Judge Flow", () => {
  beforeEach(async () => {
    await cleanDatabase();
    // Clear BullMQ queue to avoid side effects
    await judgeQueue.drain();
  });

  describe("POST /api/problems/:problemId/run", () => {
    it("returns 401 if unauthenticated", async () => {
      const res = await request(app)
        .post("/api/problems/two-sum/run")
        .send({
          language: "python",
          sourceCode: "print('hello')"
        });
      expect(res.status).toBe(401);
    });

    it("creates a pending code run and enqueues job", async () => {
      const { accessToken } = await registerAndLoginTestUser();
      const problem = await createTestProblem();

      const res = await request(app)
        .post(`/api/problems/${problem.slug}/run`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          language: "python",
          sourceCode: "print('hello')"
        });

      expect(res.status).toBe(202);
      expect(res.body.id).toBeDefined();
      expect(res.body.status).toBe("pending");

      // Verify record is in database
      const run = await prisma.codeRun.findUnique({
        where: { id: res.body.id }
      });
      expect(run).toBeDefined();
      expect(run?.status).toBe("pending");

      // Check if BullMQ job was added
      const jobs = await judgeQueue.getJobs(["waiting", "active"]);
      expect(jobs.length).toBe(1);
      expect(jobs[0]!.data.runId).toBe(run?.id);
    });
  });

  describe("GET /api/runs/:runId", () => {
    it("returns 401 if unauthenticated", async () => {
      const res = await request(app).get("/api/runs/123e4567-e89b-12d3-a456-426614174000");
      expect(res.status).toBe(401);
    });

    it("returns 404 if not found", async () => {
      const { accessToken } = await registerAndLoginTestUser();
      const res = await request(app)
        .get("/api/runs/123e4567-e89b-12d3-a456-426614174000")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(res.status).toBe(404);
    });

    it("returns 404 if run belongs to another user", async () => {
      const userA = await registerAndLoginTestUser();
      // Register user B
      const resReg = await request(app)
        .post("/api/auth/register")
        .send({
          name: "User B",
          email: "userB@test.com",
          password: "Password123"
        });
      const tokenB = resReg.body.accessToken;

      const problem = await createTestProblem();
      const run = await prisma.codeRun.create({
        data: {
          userId: userA.user.id,
          problemId: problem.id,
          language: "python",
          sourceCode: "print('hello')"
        }
      });

      const res = await request(app)
        .get(`/api/runs/${run.id}`)
        .set("Authorization", `Bearer ${tokenB}`);
      expect(res.status).toBe(404);
    });
  });

  describe("Integration: Worker execution and polling", () => {
    it("processes a code run and updates status to accepted", async () => {
      const { accessToken } = await registerAndLoginTestUser();
      const problem = await createTestProblem();

      const res = await request(app)
        .post(`/api/problems/${problem.slug}/run`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          language: "python",
          sourceCode: "import sys\ndata = sys.stdin.read()\nprint('[0,1]')\n"
        });

      const runId = res.body.id;

      await judgeQueue.drain();
      await processJudgeJob(
        createInlineJudgeJob({
          runId,
          problemId: problem.id,
          language: "python",
          sourceCode: "import sys\ndata = sys.stdin.read()\nprint('[0,1]')\n",
          testcases: problem.testcases
            .filter((testcase) => testcase.visibility === "sample")
            .map((testcase) => ({
              id: testcase.id,
              input: testcase.input,
              expectedOutput: testcase.expectedOutput
            })),
          timeLimitMs: problem.timeLimitMs,
          memoryLimitMb: problem.memoryLimitMb
        })
      );

      // Poll to check result
      const pollRes = await request(app)
        .get(`/api/runs/${runId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(pollRes.status).toBe(200);
      expect(pollRes.body.status).toBe("accepted");
      expect(pollRes.body.testcaseResults.length).toBe(1); // Runs only execute sample testcases
      expect(pollRes.body.testcaseResults[0].passed).toBe(true);
    });

    it("processes a code run with compilation / syntax error", async () => {
      const { accessToken } = await registerAndLoginTestUser();
      const problem = await createTestProblem();

      const res = await request(app)
        .post(`/api/problems/${problem.slug}/run`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          language: "python",
          sourceCode: "invalid code syntax error =="
        });

      const runId = res.body.id;
      await judgeQueue.drain();
      await processJudgeJob(
        createInlineJudgeJob({
          runId,
          problemId: problem.id,
          language: "python",
          sourceCode: "invalid code syntax error ==",
          testcases: problem.testcases
            .filter((testcase) => testcase.visibility === "sample")
            .map((testcase) => ({
              id: testcase.id,
              input: testcase.input,
              expectedOutput: testcase.expectedOutput
            })),
          timeLimitMs: problem.timeLimitMs,
          memoryLimitMb: problem.memoryLimitMb
        })
      );

      const pollRes = await request(app)
        .get(`/api/runs/${runId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(pollRes.status).toBe(200);
      expect(pollRes.body.status).toBe("runtime_error"); // python syntax error is runtime_error in execution, since it interprets
    });

    it("processes a submission and updates result to accepted", async () => {
      const { accessToken } = await registerAndLoginTestUser();
      const problem = await createTestProblem();

      const res = await request(app)
        .post(`/api/problems/${problem.slug}/submissions`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          language: "python",
          sourceCode: `
import sys, ast
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if lines:
    nums = ast.literal_eval(lines[0])
    target = int(lines[1])
    seen = {}
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            print(f"[{seen[comp]},{i}]")
            sys.exit(0)
        seen[n] = i
`
        });

      const submissionId = res.body.id;
      await judgeQueue.drain();
      await processJudgeJob(
        createInlineJudgeJob({
          submissionId,
          problemId: problem.id,
          language: "python",
          sourceCode: `
import sys, ast
lines = [l.strip() for l in sys.stdin.read().splitlines() if l.strip()]
if lines:
    nums = ast.literal_eval(lines[0])
    target = int(lines[1])
    seen = {}
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            print(f"[{seen[comp]},{i}]")
            sys.exit(0)
        seen[n] = i
`,
          testcases: problem.testcases.map((testcase) => ({
            id: testcase.id,
            input: testcase.input,
            expectedOutput: testcase.expectedOutput
          })),
          timeLimitMs: problem.timeLimitMs,
          memoryLimitMb: problem.memoryLimitMb
        })
      );

      // Poll submission detail
      const pollRes = await request(app)
        .get(`/api/submissions/${submissionId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(pollRes.status).toBe(200);
      expect(pollRes.body.result).toBe("Accepted");
      expect(pollRes.body.resultCode).toBe("accepted");
      expect(pollRes.body.testcaseResults.length).toBe(2); // Submissions run all testcases
      expect(pollRes.body.testcaseResults[0].passed).toBe(true);
      expect(pollRes.body.testcaseResults[1].passed).toBe(true);

      // Verify hidden testcase fields are not exposed
      const hiddenResult = pollRes.body.testcaseResults.find(
        (testcase: { visibility?: string }) =>
          testcase.visibility === "hidden",
      );
      expect(hiddenResult.input).toBeNull();
      expect(hiddenResult.expectedOutput).toBeNull();
      expect(hiddenResult.actualOutput).toBeNull();
      expect(hiddenResult.error).toBeNull();
      expect(hiddenResult.testcaseId).toBeNull();
    });
  });
});
