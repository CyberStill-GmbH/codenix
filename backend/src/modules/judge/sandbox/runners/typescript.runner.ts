import fs from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { BaseRunner, RunnerConfig, CompileError } from "./base.runner";
import { runDockerContainer, type DockerExecutionResult } from "../docker-runner";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class TypescriptRunner extends BaseRunner {
  private tempDir: string;
  private sourceFile: string;

  constructor(config: RunnerConfig) {
    super(config);
    this.tempDir = path.join(os.tmpdir(), `codenix-judge-${randomUUID()}`);
    this.sourceFile = path.join(this.tempDir, "solution.ts");
  }

  async prepare(): Promise<{ compileOutput?: string }> {
    await fs.mkdir(this.tempDir, { recursive: true });
    await fs.chmod(this.tempDir, 0o777); 
    await fs.writeFile(this.sourceFile, this.config.sourceCode, "utf-8");
    await fs.chmod(this.sourceFile, 0o666);

    try {
      // Compile using the host's tsc (which is in the project's node_modules)
      // This is a trade-off: compiling on the host avoids custom images but consumes host resources.
      const { stdout, stderr } = await execAsync(`npx tsc solution.ts --target ES2022 --module CommonJS`, { cwd: this.tempDir });
      return { compileOutput: stdout || stderr };
    } catch (e: any) {
      throw new CompileError(e.stdout || e.stderr || e.message);
    }
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
      console.error("Failed to cleanup TS sandbox", e);
    }
  }
}
