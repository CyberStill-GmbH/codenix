import { CRunner } from "./runners/c.runner";
import { JavascriptRunner } from "./runners/javascript.runner";
import { PythonRunner } from "./runners/python.runner";
import { RustRunner } from "./runners/rust.runner";
import { TypescriptRunner } from "./runners/typescript.runner";
import type { BaseRunner, RunnerConfig } from "./runners/base.runner";
import type { SupportedJudgeLanguage } from "../supported-languages";

export function createRunner(
  language: SupportedJudgeLanguage,
  config: RunnerConfig
): BaseRunner {
  switch (language) {
    case "python":
      return new PythonRunner(config);
    case "javascript":
      return new JavascriptRunner(config);
    case "typescript":
      return new TypescriptRunner(config);
    case "c":
      return new CRunner(config);
    case "rust":
      return new RustRunner(config);
  }
}
