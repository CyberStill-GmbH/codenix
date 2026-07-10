import { BaseRunner } from "./base.runner";
import type { CompileResult, ExecutionResult, RunnerConfig } from "./base.runner";
import type { Sandbox } from "../types";
import { Workspace } from "../workspace";
export declare class PythonRunner extends BaseRunner {
    constructor(config: RunnerConfig, sandbox: Sandbox, workspace?: Workspace);
    prepare(): Promise<void>;
    compile(): Promise<CompileResult>;
    execute(input: string): Promise<ExecutionResult>;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=python.runner.d.ts.map