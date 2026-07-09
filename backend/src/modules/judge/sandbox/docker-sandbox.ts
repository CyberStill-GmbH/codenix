import { runDockerContainer } from "./docker-runner";
import type {
  Sandbox,
  SandboxExecutionResult,
  SandboxRunOptions,
} from "./types";

export class DockerSandbox implements Sandbox {
  run(options: SandboxRunOptions): Promise<SandboxExecutionResult> {
    return runDockerContainer(options);
  }
}
