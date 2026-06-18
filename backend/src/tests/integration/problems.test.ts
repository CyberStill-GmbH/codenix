import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app";

describe("Problems API", () => {
  it("returns paginated problems response shape", async () => {
    const res = await request(app).get("/api/problems?page=1&pageSize=10");

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.meta).toBeDefined();
  });
});
