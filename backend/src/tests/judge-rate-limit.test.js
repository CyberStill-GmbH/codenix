import { ipKeyGenerator } from "express-rate-limit";
import { describe, expect, it } from "vitest";
import { getJudgeRateLimitKey } from "../modules/judge/judge.rate-limit";
function createRequest(ip, userId) {
    return {
        ip,
        ...(userId ? { user: { id: userId, role: "user" } } : {})
    };
}
describe("judge rate limit key", () => {
    it("normalizes IPv4 through ipKeyGenerator", () => {
        const ip = "127.0.0.1";
        expect(getJudgeRateLimitKey(createRequest(ip))).toBe(ipKeyGenerator(ip));
    });
    it("normalizes IPv4-mapped IPv6 through ipKeyGenerator", () => {
        const ip = "::ffff:127.0.0.1";
        expect(getJudgeRateLimitKey(createRequest(ip))).toBe(ipKeyGenerator(ip));
    });
    it("groups native IPv6 addresses through ipKeyGenerator", () => {
        const ip = "2001:db8:85a3:1234:5678:8a2e:370:7334";
        expect(getJudgeRateLimitKey(createRequest(ip))).toBe(ipKeyGenerator(ip));
    });
    it("uses the authenticated user id instead of the request IP", () => {
        expect(getJudgeRateLimitKey(createRequest("2001:db8::1", "user-123"))).toBe("user-123");
    });
});
//# sourceMappingURL=judge-rate-limit.test.js.map