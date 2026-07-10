import { BaseRunner } from "./base.runner";
import { Workspace } from "../workspace";
const DOCKER_IMAGE = "node:20-alpine";
const CONTAINER_WORKDIR = "/usr/src/app";
const SOURCE_FILE = "solution.js";
export class JavascriptRunner extends BaseRunner {
    constructor(config, sandbox, workspace = new Workspace()) {
        super(config, sandbox, workspace);
    }
    async prepare() {
        await this.workspace.prepare();
        await this.workspace.writeFile(SOURCE_FILE, this.config.sourceCode);
    }
    async compile() {
        return {
            success: true,
            stdout: "",
            stderr: "",
            exitCode: 0,
            executionTimeMs: 0,
        };
    }
    async execute(input) {
        return this.sandbox.run({
            image: DOCKER_IMAGE,
            command: ["node", `${CONTAINER_WORKDIR}/${SOURCE_FILE}`],
            workdir: CONTAINER_WORKDIR,
            bindMounts: [this.workspace.mount(CONTAINER_WORKDIR, true)],
            memoryLimitMb: this.config.memoryLimitMb,
            timeLimitMs: this.config.timeLimitMs,
            input,
            networkNone: true,
            dropCapabilities: true,
            readOnlyRootfs: true,
            user: "1000:1000",
        });
    }
    async cleanup() {
        try {
            await this.workspace.cleanup();
        }
        catch (e) {
            console.error("Failed to cleanup JS sandbox", e);
        }
    }
}
//# sourceMappingURL=javascript.runner.js.map