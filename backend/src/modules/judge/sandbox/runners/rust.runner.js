import { BaseRunner, CompileError } from "./base.runner";
import { Workspace } from "../workspace";
const COMPILE_IMAGE = "rust:1.75";
const RUNTIME_IMAGE = "debian:bookworm-slim";
const CONTAINER_WORKDIR = "/usr/src/app";
const COMPILE_TIMEOUT_MS = 15_000;
const COMPILE_MEMORY_MB = 512;
const SOURCE_FILE = "solution.rs";
const BINARY_FILE = "solution";
export class RustRunner extends BaseRunner {
    constructor(config, sandbox, workspace = new Workspace()) {
        super(config, sandbox, workspace);
    }
    baseDockerOptions() {
        return {
            workdir: CONTAINER_WORKDIR,
            networkNone: true,
            dropCapabilities: true,
            readOnlyRootfs: true,
            user: "1000:1000",
        };
    }
    async prepare() {
        await this.workspace.prepare(0o777);
        await this.workspace.writeFile(SOURCE_FILE, this.config.sourceCode, {
            mode: 0o666,
        });
    }
    async compile() {
        const raw = await this.sandbox.run({
            ...this.baseDockerOptions(),
            image: COMPILE_IMAGE,
            command: ["rustc", "-O", SOURCE_FILE, "-o", BINARY_FILE],
            bindMounts: [this.workspace.mount(CONTAINER_WORKDIR, false)],
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
            image: RUNTIME_IMAGE,
            command: [`./${BINARY_FILE}`],
            bindMounts: [this.workspace.mount(CONTAINER_WORKDIR, true)],
            memoryLimitMb: this.config.memoryLimitMb,
            timeLimitMs: this.config.timeLimitMs,
            input,
        });
    }
    async cleanup() {
        try {
            await this.workspace.cleanup();
        }
        catch (e) {
            console.error("Failed to cleanup Rust sandbox", e);
        }
    }
}
//# sourceMappingURL=rust.runner.js.map