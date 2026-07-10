import { config } from "dotenv";
config({ path: ".env.test", override: true });
process.env.NODE_ENV = "test";
process.env.PORT ??= "4001";
process.env.DATABASE_URL ??=
    "postgresql://codenix:codenix@localhost:5433/codenix_test?schema=public";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET.length >= 32
        ? process.env.JWT_ACCESS_SECRET
        : "test_access_secret_32_chars_minimum";
process.env.JWT_ACCESS_EXPIRES_IN ??= "1d";
process.env.FRONTEND_URL ??= "http://localhost:5173";
//# sourceMappingURL=env.setup.js.map