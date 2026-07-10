import "dotenv/config";
export declare const env: {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    JUDGE_MODE: "docker" | "mock";
    JUDGE_QUEUE_ENABLED: boolean;
    FRONTEND_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_ACCESS_ISSUER: string;
    JWT_ACCESS_AUDIENCE: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CALLBACK_URL: string;
    FRONTEND_AUTH_CALLBACK_URL: string;
};
//# sourceMappingURL=env.d.ts.map