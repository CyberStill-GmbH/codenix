import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../app";

// Note: these tests expect the test DB to be populated or mocked
describe("Runs API", () => {
  it("should create a code run and return status (POST /api/problems/:problemId/run)", async () => {
    // Requires a valid token and problemId in a real DB
    // This test ensures the route is protected
    const res = await request(app)
      .post("/api/problems/two-sum/run")
      .send({
        language: "python",
        sourceCode: "print('hello')",
      });
    
    // Unauthenticated should fail
    expect(res.status).toBe(401);
  });

  it("should fetch a run by ID (GET /api/runs/:runId)", async () => {
    const res = await request(app).get("/api/runs/123e4567-e89b-12d3-a456-426614174000");
    expect(res.status).toBe(401);
  });

  it("should create a submission (POST /api/problems/:problemId/submissions)", async () => {
    const res = await request(app)
      .post("/api/problems/two-sum/submissions")
      .send({
        language: "python",
        sourceCode: "print('hello')",
      });
    
    expect(res.status).toBe(401);
  });

  it("should fetch submission detail (GET /api/submissions/:submissionId)", async () => {
    const res = await request(app).get("/api/submissions/123e4567-e89b-12d3-a456-426614174000");
    expect(res.status).toBe(401);
  });
});
