import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import { cleanDatabase } from "../helpers/db.helper";
describe("Auth API", () => {
    beforeEach(async () => {
        await cleanDatabase();
    });
    it("registers a user and returns session", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
            name: "Cesar",
            email: "cesar@test.com",
            password: "Password123"
        });
        expect(res.status).toBe(201);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.user.email).toBe("cesar@test.com");
    });
    it("rejects invalid credentials", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
            email: "missing@test.com",
            password: "wrong"
        });
        expect(res.status).toBe(401);
        expect(res.body.code).toBe("INVALID_CREDENTIALS");
    });
});
//# sourceMappingURL=auth.test.js.map