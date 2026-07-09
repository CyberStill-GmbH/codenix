import type { Sandbox, SandboxExecutionResult } from "../types";
import type { Workspace } from "../workspace";

export interface RunnerConfig {
  sourceCode: string;
  timeLimitMs: number;
  memoryLimitMb: number;
}

export interface CompileResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
}

export type ExecutionResult = SandboxExecutionResult;

export class CompileError extends Error {
  constructor(public readonly result: CompileResult) {
    super("Compilation failed");
    this.name = "CompileError";
  }

  get compileOutput(): string {
    return this.result.stderr || this.result.stdout;
  }
}

export abstract class BaseRunner {
  protected readonly config: RunnerConfig;

  constructor(
    config: RunnerConfig,
    protected readonly sandbox: Sandbox,
    protected readonly workspace: Workspace,
  ) {
    this.config = config;
  }

  /**
   * Prepares local files required by the runner.
   */
  abstract prepare(): Promise<void>;

  abstract compile(): Promise<CompileResult>;
  /**
   * Executes the code with the given standard input.
   */
  abstract execute(input: string): Promise<ExecutionResult>;

  run(input: string): Promise<ExecutionResult> {
    return this.execute(input);
  }

  /**
   * Cleans up any resources (like temporary directories).
   */
  abstract cleanup(): Promise<void>;
}
