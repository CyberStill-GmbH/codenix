import { defineConfig } from "vitest/config";
export default defineConfig({
    test: {
        fileParallelism: false,
        hookTimeout: 120_000,
        setupFiles: ["src/tests/env.setup.ts"],
        testTimeout: 120_000
    }
});
//# sourceMappingURL=vitest.config.js.map