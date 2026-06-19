import fs from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { BaseRunner } from "./base.runner";
import type { RunnerConfig } from "./base.runner";
import { runDockerContainer, type DockerExecutionResult } from "../docker-runner";

export class JavascriptRunner extends BaseRunner {
  private tempDir: string;
  private sourceFile: string;

  constructor(config: RunnerConfig) {
    super(config);
    this.tempDir = path.join(os.tmpdir(), `codenix-judge-${randomUUID()}`);
    this.sourceFile = path.join(this.tempDir, "solution.js");
  }

  async prepare(): Promise<{ compileOutput?: string }> {
    await fs.mkdir(this.tempDir, { recursive: true });
    await fs.writeFile(this.sourceFile, this.config.sourceCode, "utf-8");
    return {};
  }

  async run(input: string): Promise<DockerExecutionResult> {
    return runDockerContainer({
      image: "node:20-alpine",
      command: ["node", "/usr/src/app/solution.js"],
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
      console.error("Failed to cleanup JS sandbox", e);
    }
  }
}
