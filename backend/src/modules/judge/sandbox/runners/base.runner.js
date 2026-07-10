export class CompileError extends Error {
    result;
    constructor(result) {
        super("Compilation failed");
        this.result = result;
        this.name = "CompileError";
    }
    get compileOutput() {
        return this.result.stderr || this.result.stdout;
    }
}
export class BaseRunner {
    sandbox;
    workspace;
    config;
    constructor(config, sandbox, workspace) {
        this.sandbox = sandbox;
        this.workspace = workspace;
        this.config = config;
    }
    run(input) {
        return this.execute(input);
    }
}
//# sourceMappingURL=base.runner.js.map