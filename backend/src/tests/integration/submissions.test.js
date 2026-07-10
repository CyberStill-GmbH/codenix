import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import { cleanDatabase } from "../helpers/db.helper";
import { registerAndLoginTestUser } from "../helpers/auth.helper";
describe("Submissions API", () => {
    beforeEach(async () => {
        await cleanDatabase();
    });
    it("rejects unauthenticated requests", async () => {
        const res = await request(app).get("/api/submissions");
        expect(res.status).toBe(401);
    });
    it("returns authenticated user submissions response shape", async () => {
        const { accessToken } = await registerAndLoginTestUser();
        const res = await request(app)
            .get("/api/submissions")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.meta).toBeDefined();
    });
});
//# sourceMappingURL=submissions.test.js.map