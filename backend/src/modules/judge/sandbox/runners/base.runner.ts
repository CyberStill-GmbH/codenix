import type { DockerExecutionResult } from "../docker-runner";

export interface RunnerConfig {
  sourceCode: string;
  timeLimitMs: number;
  memoryLimitMb: number;
}

export class CompileError extends Error {
  constructor(public compileOutput: string) {
    super("Compilation failed");
    this.name = "CompileError";
  }
}

export abstract class BaseRunner {
  protected config: RunnerConfig;

  constructor(config: RunnerConfig) {
    this.config = config;
  }

  /**
   * Prepares the execution environment.
   * If compilation is required, it must be done here.
   * Throws CompileError if compilation fails.
   */
  abstract prepare(): Promise<{ compileOutput?: string }>;

  /**
   * Executes the code with the given standard input.
   */
  abstract run(input: string): Promise<DockerExecutionResult>;

  /**
   * Cleans up any resources (like temporary directories).
   */
  abstract cleanup(): Promise<void>;
}
