import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false,
    hookTimeout: 120_000,
    include: ["src/tests/**/*.test.ts"],
    setupFiles: ["src/tests/env.setup.ts"],
    testTimeout: 120_000,
    coverage: {
      include: ["src/**/*.js"],
      exclude: [
        "src/generated/**",
        "src/tests/**",
        "src/server.js",
        "src/worker.js",
      ],
    },
  },
});
