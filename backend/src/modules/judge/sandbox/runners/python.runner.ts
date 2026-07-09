import { BaseRunner } from "./base.runner";
import type {
  CompileResult,
  ExecutionResult,
  RunnerConfig,
} from "./base.runner";
import type { Sandbox } from "../types";
import { Workspace } from "../workspace";

const DOCKER_IMAGE = "python:3.12-alpine";
const CONTAINER_WORKDIR = "/usr/src/app";
const SOURCE_FILE = "solution.py";

export class PythonRunner extends BaseRunner {
  constructor(
    config: RunnerConfig,
    sandbox: Sandbox,
    workspace = new Workspace(),
  ) {
    super(config, sandbox, workspace);
  }

  async prepare(): Promise<void> {
    await this.workspace.prepare();
    await this.workspace.writeFile(SOURCE_FILE, this.config.sourceCode);
  }

  async compile(): Promise<CompileResult> {
    return {
      success: true,
      stdout: "",
      stderr: "",
      exitCode: 0,
      executionTimeMs: 0,
    };
  }

  async execute(input: string): Promise<ExecutionResult> {
    return this.sandbox.run({
      image: DOCKER_IMAGE,
      command: ["python", `${CONTAINER_WORKDIR}/${SOURCE_FILE}`],
      workdir: CONTAINER_WORKDIR,
      bindMounts: [this.workspace.mount(CONTAINER_WORKDIR, true)],
      memoryLimitMb: this.config.memoryLimitMb,
      timeLimitMs: this.config.timeLimitMs,
      input,
      networkNone: true,
      dropCapabilities: true,
      readOnlyRootfs: true,
      user: "1000:1000",
    });
  }

  async cleanup(): Promise<void> {
    try {
      await this.workspace.cleanup();
    } catch (e) {
      console.error("Failed to cleanup Python sandbox", e);
    }
  }
}
