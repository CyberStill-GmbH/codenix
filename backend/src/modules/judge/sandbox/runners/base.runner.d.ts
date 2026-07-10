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
export declare class CompileError extends Error {
    readonly result: CompileResult;
    constructor(result: CompileResult);
    get compileOutput(): string;
}
export declare abstract class BaseRunner {
    protected readonly sandbox: Sandbox;
    protected readonly workspace: Workspace;
    protected readonly config: RunnerConfig;
    constructor(config: RunnerConfig, sandbox: Sandbox, workspace: Workspace);
    /**
     * Prepares local files required by the runner.
     */
    abstract prepare(): Promise<void>;
    abstract compile(): Promise<CompileResult>;
    /**
     * Executes the code with the given standard input.
     */
    abstract execute(input: string): Promise<ExecutionResult>;
    run(input: string): Promise<ExecutionResult>;
    /**
     * Cleans up any resources (like temporary directories).
     */
    abstract cleanup(): Promise<void>;
}
//# sourceMappingURL=base.runner.d.ts.map