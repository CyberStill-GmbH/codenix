import { CRunner } from "./runners/c.runner";
import { JavascriptRunner } from "./runners/javascript.runner";
import { PythonRunner } from "./runners/python.runner";
import { RustRunner } from "./runners/rust.runner";
import { TypescriptRunner } from "./runners/typescript.runner";
import { DockerSandbox } from "./docker-sandbox";
export function createRunner(language, config, sandbox = new DockerSandbox()) {
    switch (language) {
        case "python":
            return new PythonRunner(config, sandbox);
        case "javascript":
            return new JavascriptRunner(config, sandbox);
        case "typescript":
            return new TypescriptRunner(config, sandbox);
        case "c":
            return new CRunner(config, sandbox);
        case "rust":
            return new RustRunner(config, sandbox);
    }
}
//# sourceMappingURL=runner-factory.js.map