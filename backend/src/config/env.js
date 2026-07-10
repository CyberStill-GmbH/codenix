import "dotenv/config";
import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
    REDIS_URL: z.string().url().default("redis://localhost:6379"),
    JUDGE_MODE: z.enum(["docker", "mock"]).default("docker"),
    JUDGE_QUEUE_ENABLED: z.preprocess((val) => {
        if (typeof val === "string") {
            if (val.toLowerCase() === "true" || val === "1")
                return true;
            if (val.toLowerCase() === "false" || val === "0")
                return false;
        }
        return val;
    }, z.boolean().default(true)),
    FRONTEND_URL: z.string().url().default("http://localhost:5173"),
    JWT_ACCESS_SECRET: z
        .string()
        .min(32, "JWT_ACCESS_SECRET must be at least 32 characters."),
    JWT_ACCESS_EXPIRES_IN: z.string().default("1d"),
    JWT_ACCESS_ISSUER: z.string().default("codenix-api"),
    JWT_ACCESS_AUDIENCE: z.string().default("codenix-web"),
    GOOGLE_CLIENT_ID: z.string().optional().default(""),
    GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
    GOOGLE_CALLBACK_URL: z
        .string()
        .url()
        .default("http://localhost:4000/api/auth/google/callback"),
    GITHUB_CLIENT_ID: z.string().optional().default(""),
    GITHUB_CLIENT_SECRET: z.string().optional().default(""),
    GITHUB_CALLBACK_URL: z
        .string()
        .url()
        .default("http://localhost:4000/api/auth/github/callback"),
    FRONTEND_AUTH_CALLBACK_URL: z
        .string()
        .url()
        .default("http://localhost:5173/auth/callback")
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error("Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
}
export const env = result.data;
//# sourceMappingURL=env.js.map