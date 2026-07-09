import { CRunner } from "./runners/c.runner";
import { JavascriptRunner } from "./runners/javascript.runner";
import { PythonRunner } from "./runners/python.runner";
import { RustRunner } from "./runners/rust.runner";
import { TypescriptRunner } from "./runners/typescript.runner";
import type { BaseRunner, RunnerConfig } from "./runners/base.runner";
import type { SupportedJudgeLanguage } from "../supported-languages";
import { DockerSandbox } from "./docker-sandbox";
import type { Sandbox } from "./types";

export function createRunner(
  language: SupportedJudgeLanguage,
  config: RunnerConfig,
  sandbox: Sandbox = new DockerSandbox(),
): BaseRunner {
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
