import path from "node:path";
import { BaseRunner, CompileError } from "./base.runner";
import { Workspace } from "../workspace";
const DOCKER_IMAGE = "node:20-alpine";
const CONTAINER_WORKDIR = "/usr/src/app";
const CONTAINER_TS_DIR = "/opt/typescript";
const COMPILE_TIMEOUT_MS = 10_000;
const COMPILE_MEMORY_MB = 512;
const SOURCE_FILE = "solution.ts";
const OUTPUT_FILE = "solution.js";
export class TypescriptRunner extends BaseRunner {
    typescriptDir = path.resolve(process.cwd(), "node_modules", "typescript");
    constructor(config, sandbox, workspace = new Workspace()) {
        super(config, sandbox, workspace);
    }
    baseDockerOptions() {
        return {
            image: DOCKER_IMAGE,
            workdir: CONTAINER_WORKDIR,
            networkNone: true,
            dropCapabilities: true,
            readOnlyRootfs: true,
            user: "1000:1000",
        };
    }
    async prepare() {
        await this.workspace.prepare();
        await this.workspace.writeFile(SOURCE_FILE, this.config.sourceCode);
    }
    async compile() {
        const raw = await this.sandbox.run({
            ...this.baseDockerOptions(),
            command: [
                "node",
                `${CONTAINER_TS_DIR}/bin/tsc`,
                SOURCE_FILE,
                "--target",
                "ES2022",
                "--module",
                "CommonJS",
                "--skipLibCheck",
            ],
            bindMounts: [
                this.workspace.mount(CONTAINER_WORKDIR, false),
                {
                    hostPath: this.typescriptDir,
                    containerPath: CONTAINER_TS_DIR,
                    readOnly: true,
                },
            ],
            memoryLimitMb: COMPILE_MEMORY_MB,
            timeLimitMs: COMPILE_TIMEOUT_MS,
        });
        const result = {
            success: raw.exitCode === 0 && !raw.isTLE && !raw.isOOM,
            stdout: raw.stdout,
            stderr: raw.stderr,
            exitCode: raw.exitCode,
            executionTimeMs: raw.executionTimeMs,
        };
        if (!result.success) {
            throw new CompileError(result);
        }
        return result;
    }
    async execute(input) {
        return this.sandbox.run({
            ...this.baseDockerOptions(),
            command: ["node", `${CONTAINER_WORKDIR}/${OUTPUT_FILE}`],
            bindMounts: [this.workspace.mount(CONTAINER_WORKDIR, true)],
            memoryLimitMb: this.config.memoryLimitMb,
            timeLimitMs: this.config.timeLimitMs,
            input,
        });
    }
    async cleanup() {
        await this.workspace.cleanup();
    }
}
//# sourceMappingURL=typescript.runner.js.map