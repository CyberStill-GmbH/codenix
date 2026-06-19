import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { BaseRunner, CompileError } from "./base.runner";
import type { RunnerConfig } from "./base.runner";
import {
  runDockerContainer,
  type DockerExecutionResult
} from "../docker-runner";

export class TypescriptRunner extends BaseRunner {
  private readonly tempDir: string;
  private readonly sourceFile: string;
  private readonly typescriptDir = path.resolve(
    process.cwd(),
    "node_modules",
    "typescript"
  );

  constructor(config: RunnerConfig) {
    super(config);
    this.tempDir = path.join(os.tmpdir(), `codenix-judge-${randomUUID()}`);
    this.sourceFile = path.join(this.tempDir, "solution.ts");
  }

  async prepare(): Promise<{ compileOutput?: string }> {
    await fs.mkdir(this.tempDir, { recursive: true });
    await fs.writeFile(this.sourceFile, this.config.sourceCode, "utf8");

    const compileResult = await runDockerContainer({
      image: "node:20-alpine",
      command: [
        "node",
        "/opt/typescript/bin/tsc",
        "solution.ts",
        "--target",
        "ES2022",
        "--module",
        "CommonJS",
        "--skipLibCheck"
      ],
      workdir: "/usr/src/app",
      bindMounts: [
        { hostPath: this.tempDir, containerPath: "/usr/src/app", readOnly: false },
        { hostPath: this.typescriptDir, containerPath: "/opt/typescript", readOnly: true }
      ],
      memoryLimitMb: 512,
      timeLimitMs: 10_000,
      networkNone: true,
      dropCapabilities: true,
      readOnlyRootfs: true,
      user: "1000:1000"
    });

    if (
      compileResult.exitCode !== 0 ||
      compileResult.isTLE ||
      compileResult.isOOM
    ) {
      throw new CompileError(
        compileResult.stderr || compileResult.stdout || "TypeScript compilation failed."
      );
    }

    return { compileOutput: compileResult.stderr || compileResult.stdout };
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
    await fs.rm(this.tempDir, { recursive: true, force: true });
  }
}
