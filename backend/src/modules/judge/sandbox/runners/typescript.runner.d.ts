import { BaseRunner } from "./base.runner";
import type { RunnerConfig, CompileResult, ExecutionResult } from "./base.runner";
import type { Sandbox } from "../types";
import { Workspace } from "../workspace";
export declare class TypescriptRunner extends BaseRunner {
    private readonly typescriptDir;
    constructor(config: RunnerConfig, sandbox: Sandbox, workspace?: Workspace);
    private baseDockerOptions;
    prepare(): Promise<void>;
    compile(): Promise<CompileResult>;
    execute(input: string): Promise<ExecutionResult>;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=typescript.runner.d.ts.map