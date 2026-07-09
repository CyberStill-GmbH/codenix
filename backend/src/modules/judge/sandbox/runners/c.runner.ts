import { BaseRunner, CompileError } from "./base.runner";
import type {
  RunnerConfig,
  CompileResult,
  ExecutionResult,
} from "./base.runner";
import type { Sandbox } from "../types";
import { Workspace } from "../workspace";

const COMPILE_IMAGE = "gcc:13";
const RUNTIME_IMAGE = "debian:bookworm-slim";
const CONTAINER_WORKDIR = "/usr/src/app";
const COMPILE_TIMEOUT_MS = 10_000;
const COMPILE_MEMORY_MB = 512;
const SOURCE_FILE = "solution.c";
const BINARY_FILE = "solution";

interface SandboxSecurityOptions {
  workdir: string;
  networkNone: boolean;
  dropCapabilities: boolean;
  readOnlyRootfs: boolean;
  user: string;
}

export class CRunner extends BaseRunner {
  constructor(
    config: RunnerConfig,
    sandbox: Sandbox,
    workspace = new Workspace(),
  ) {
    super(config, sandbox, workspace);
  }

  private baseDockerOptions(): SandboxSecurityOptions {
    return {
      workdir: CONTAINER_WORKDIR,
      networkNone: true,
      dropCapabilities: true,
      readOnlyRootfs: true,
      user: "1000:1000",
    };
  }

  async prepare(): Promise<void> {
    await this.workspace.prepare(0o777);
    await this.workspace.writeFile(SOURCE_FILE, this.config.sourceCode, {
      mode: 0o666,
    });
  }

  async compile(): Promise<CompileResult> {
    const raw = await this.sandbox.run({
      ...this.baseDockerOptions(),
      image: COMPILE_IMAGE,
      command: [
        "gcc",
        "-Wall",
        "-Wextra",
        "-O2",
        SOURCE_FILE,
        "-o",
        BINARY_FILE,
      ],
      bindMounts: [this.workspace.mount(CONTAINER_WORKDIR, false)],
      memoryLimitMb: COMPILE_MEMORY_MB,
      timeLimitMs: COMPILE_TIMEOUT_MS,
    });

    const result: CompileResult = {
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

  async execute(input: string): Promise<ExecutionResult> {
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

  async cleanup(): Promise<void> {
    try {
      await this.workspace.cleanup();
    } catch (e) {
      console.error("Failed to cleanup C sandbox", e);
    }
  }
}
