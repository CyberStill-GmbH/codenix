import fs from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { BaseRunner, RunnerConfig, CompileError } from "./base.runner";
import { runDockerContainer, type DockerExecutionResult } from "../docker-runner";

export class CRunner extends BaseRunner {
  private tempDir: string;
  private sourceFile: string;

  constructor(config: RunnerConfig) {
    super(config);
    this.tempDir = path.join(os.tmpdir(), `codenix-judge-${randomUUID()}`);
    this.sourceFile = path.join(this.tempDir, "solution.c");
  }

  async prepare(): Promise<{ compileOutput?: string }> {
    await fs.mkdir(this.tempDir, { recursive: true });
    await fs.chmod(this.tempDir, 0o777); 
    await fs.writeFile(this.sourceFile, this.config.sourceCode, "utf-8");
    await fs.chmod(this.sourceFile, 0o666);

    const compileResult = await runDockerContainer({
      image: "gcc:13",
      command: ["gcc", "-Wall", "-Wextra", "-O2", "solution.c", "-o", "solution"],
      workdir: "/usr/src/app",
      bindMounts: [
        { hostPath: this.tempDir, containerPath: "/usr/src/app", readOnly: false }
      ],
      memoryLimitMb: 512,
      timeLimitMs: 10000,
      networkNone: true,
      dropCapabilities: true,
      user: "1000:1000"
    });

    if (compileResult.exitCode !== 0 || compileResult.isTLE || compileResult.isOOM) {
      throw new CompileError(compileResult.stderr || compileResult.stdout || "Compilation failed/timeout");
    }

    return { compileOutput: compileResult.stderr || compileResult.stdout };
  }

  async run(input: string): Promise<DockerExecutionResult> {
    return runDockerContainer({
      image: "debian:bookworm-slim",
      command: ["./solution"],
      workdir: "/usr/src/app",
      bindMounts: [
        { hostPath: this.tempDir, containerPath: "/usr/src/app", readOnly: true }
      ],
      memoryLimitMb: this.config.memoryLimitMb,
      timeLimitMs: this.config.timeLimitMs,
      input,
      networkNone: true,
      dropCapabilities: true,
      readOnlyRootfs: true,
      user: "1000:1000"
    });
  }

  async cleanup(): Promise<void> {
    try {
      await fs.rm(this.tempDir, { recursive: true, force: true });
    } catch (e) {
      console.error("Failed to cleanup C sandbox", e);
    }
  }
}
