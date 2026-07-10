import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app";
import { prisma } from "../../db/prisma";
import { registerAndLoginTestUser } from "../helpers/auth.helper";
import { cleanDatabase } from "../helpers/db.helper";
function createAdminProblemPayload(language) {
    return {
        title: "Admin problem",
        slug: "admin-problem",
        difficulty: "EASY",
        tags: ["Arrays"],
        description_markdown: "Solve the problem.",
        examples: [{ input: "1", output: "1" }],
        constraints: ["1 <= n <= 10"],
        parameters: [{ name: "n", type: "number" }],
        output_type: "number",
        testcases: [
            { input: 1, expected_output: 1, is_sample: true, weight: 1 },
            { input: 2, expected_output: 2, is_sample: false, weight: 1 }
        ],
        supported_languages: [language],
        starter_code: { [language]: "Write your solution here." },
        time_limit_ms: 2000,
        memory_limit_mb: 256,
        status: "DRAFT"
    };
}
function createIncompleteProblemPayload() {
    return {
        ...createAdminProblemPayload("python"),
        slug: "incomplete-problem",
        testcases: []
    };
}
async function registerAdmin() {
    const session = await registerAndLoginTestUser();
    await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "admin" }
    });
    return session;
}
describe("Admin problems API", () => {
    beforeEach(async () => {
        await cleanDatabase();
    });
    it("rejects a language without a judge runner", async () => {
        const { accessToken } = await registerAdmin();
        const response = await request(app)
            .post("/api/admin/problems")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(createAdminProblemPayload("java"));
        expect(response.status).toBe(422);
        expect(response.body).toMatchObject({
            code: "UNSUPPORTED_LANGUAGE",
            details: {
                unsupportedLanguages: ["java"]
            }
        });
    });
    it("accepts a language backed by a judge runner", async () => {
        const { accessToken } = await registerAdmin();
        const response = await request(app)
            .post("/api/admin/problems")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(createAdminProblemPayload("python"));
        expect(response.status).toBe(201);
        expect(response.body.supportedLanguages).toEqual(["python"]);
    });
    it("rejects publishing an incomplete problem with explicit missing fields", async () => {
        const { accessToken } = await registerAdmin();
        const created = await request(app)
            .post("/api/admin/problems")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(createIncompleteProblemPayload());
        const response = await request(app)
            .patch(`/api/admin/problems/${created.body.id}/publish`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(422);
        expect(response.body).toMatchObject({
            code: "INCOMPLETE_PROBLEM",
            details: {
                missing: expect.arrayContaining(["sampleTestcases", "testcases"])
            }
        });
    });
    it("publishes a complete problem", async () => {
        const { accessToken } = await registerAdmin();
        const created = await request(app)
            .post("/api/admin/problems")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(createAdminProblemPayload("python"));
        const response = await request(app)
            .patch(`/api/admin/problems/${created.body.id}/publish`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("published");
    });
});
//# sourceMappingURL=admin-problems.test.js.map