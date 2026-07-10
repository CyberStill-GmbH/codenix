import fs from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { buildDockerArgs, extractMemoryMetric, wrapCommandWithMetrics, } from "../modules/judge/sandbox/docker-runner";
import { Workspace } from "../modules/judge/sandbox/workspace";
import { PythonRunner } from "../modules/judge/sandbox/runners/python.runner";
import { CRunner } from "../modules/judge/sandbox/runners/c.runner";
import { CompileError } from "../modules/judge/sandbox/runners/base.runner";
import { createRunner } from "../modules/judge/sandbox/runner-factory";
const baseExecutionResult = {
    stdout: "",
    stderr: "",
    executionTimeMs: 7,
    memoryKb: 1234,
    isTLE: false,
    isOOM: false,
    isOutputLimitExceeded: false,
    exitCode: 0,
};
class RecordingSandbox {
    results;
    calls = [];
    constructor(results = []) {
        this.results = results;
    }
    async run(options) {
        this.calls.push(options);
        return this.results.shift() ?? baseExecutionResult;
    }
}
describe("judge sandbox metrics", () => {
    it("extracts peak memory in KB and removes the internal marker from stderr", () => {
        const result = extractMemoryMetric("warning\n__CODENIX_MEMORY_KB__:4096\nuser stderr");
        expect(result.memoryKb).toBe(4096);
        expect(result.stderr).toBe("warning\nuser stderr");
    });
    it("uses the largest memory marker when stderr contains more than one", () => {
        const result = extractMemoryMetric("__CODENIX_MEMORY_KB__:128\nerr\n__CODENIX_MEMORY_KB__:512\n");
        expect(result.memoryKb).toBe(512);
        expect(result.stderr).toBe("err");
    });
    it("wraps Docker commands with cgroup memory collection and keeps sandbox hardening", () => {
        const args = buildDockerArgs({
            image: "python:3.12-alpine",
            command: ["python", "/usr/src/app/solution.py"],
            workdir: "/usr/src/app",
            bindMounts: [
                {
                    hostPath: "C:\\tmp\\judge",
                    containerPath: "/usr/src/app",
                    readOnly: true,
                },
            ],
            memoryLimitMb: 64,
            timeLimitMs: 500,
            networkNone: true,
            dropCapabilities: true,
            readOnlyRootfs: true,
            user: "1000:1000",
        }, "container-name");
        expect(args).toContain("--network");
        expect(args).toContain("none");
        expect(args).toContain("--cap-drop");
        expect(args).toContain("ALL");
        expect(args).toContain("--read-only");
        expect(args).toContain("--memory");
        expect(args).toContain("64m");
        expect(args.slice(-6)).toEqual([
            "sh",
            "-c",
            expect.stringContaining("/sys/fs/cgroup/memory.peak"),
            "codenix-metrics",
            "python",
            "/usr/src/app/solution.py",
        ]);
    });
    it("keeps command arguments separate when adding the metrics wrapper", () => {
        expect(wrapCommandWithMetrics(["node", "file with spaces.js"])).toEqual([
            "sh",
            "-c",
            expect.stringContaining("__CODENIX_MEMORY_KB__:"),
            "codenix-metrics",
            "node",
            "file with spaces.js",
        ]);
    });
});
describe("judge workspace", () => {
    it("owns temporary file creation, mounts, and cleanup", async () => {
        const workspace = new Workspace("codenix-test");
        await workspace.prepare();
        await workspace.writeFile("solution.py", "print('ok')");
        await expect(fs.readFile(workspace.filePath("solution.py"), "utf8")).resolves.toBe("print('ok')");
        expect(workspace.mount("/usr/src/app", true)).toEqual({
            hostPath: workspace.hostPath,
            containerPath: "/usr/src/app",
            readOnly: true,
        });
        await workspace.cleanup();
        await expect(fs.stat(workspace.hostPath)).rejects.toMatchObject({
            code: "ENOENT",
        });
    });
});
describe("judge runners sandbox abstraction", () => {
    it("Python runner delegates execution metrics to the injected sandbox", async () => {
        const sandbox = new RecordingSandbox([
            { ...baseExecutionResult, stdout: "42\n", memoryKb: 2048 },
        ]);
        const runner = new PythonRunner({ sourceCode: "print(42)", timeLimitMs: 1000, memoryLimitMb: 128 }, sandbox);
        await runner.prepare();
        const compile = await runner.compile();
        const execution = await runner.execute("input");
        await runner.cleanup();
        expect(compile.success).toBe(true);
        expect(execution.memoryKb).toBe(2048);
        expect(sandbox.calls).toHaveLength(1);
        expect(sandbox.calls[0]).toMatchObject({
            image: "python:3.12-alpine",
            command: ["python", "/usr/src/app/solution.py"],
            input: "input",
            networkNone: true,
            dropCapabilities: true,
            readOnlyRootfs: true,
            user: "1000:1000",
        });
        expect(sandbox.calls[0]?.bindMounts?.[0]?.readOnly).toBe(true);
    });
    it("compiled runners report compilation errors from sandbox metrics", async () => {
        const sandbox = new RecordingSandbox([
            {
                ...baseExecutionResult,
                stderr: "solution.c:1: error",
                executionTimeMs: 33,
                exitCode: 1,
            },
        ]);
        const runner = new CRunner({ sourceCode: "not c", timeLimitMs: 1000, memoryLimitMb: 128 }, sandbox);
        await runner.prepare();
        await expect(runner.compile()).rejects.toBeInstanceOf(CompileError);
        await runner.cleanup();
        expect(sandbox.calls[0]).toMatchObject({
            image: "gcc:13",
            command: [
                "gcc",
                "-Wall",
                "-Wextra",
                "-O2",
                "solution.c",
                "-o",
                "solution",
            ],
            memoryLimitMb: 512,
            timeLimitMs: 10_000,
        });
        expect(sandbox.calls[0]?.bindMounts?.[0]?.readOnly).toBe(false);
    });
    it("runner factory injects the same sandbox without exposing Docker to runners", async () => {
        const sandbox = new RecordingSandbox();
        const runner = createRunner("javascript", { sourceCode: "console.log(1)", timeLimitMs: 1000, memoryLimitMb: 64 }, sandbox);
        await runner.prepare();
        await runner.execute("");
        await runner.cleanup();
        expect(sandbox.calls).toHaveLength(1);
        expect(sandbox.calls[0]).toMatchObject({
            image: "node:20-alpine",
            command: ["node", "/usr/src/app/solution.js"],
        });
    });
});
//# sourceMappingURL=judge-sandbox-performance.test.js.map