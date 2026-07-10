import type { SandboxExecutionResult, SandboxRunOptions } from "./types";
export type DockerExecutionResult = SandboxExecutionResult;
export type DockerRunOptions = SandboxRunOptions;
export declare function wrapCommandWithMetrics(command: string[]): string[];
export declare function extractMemoryMetric(stderr: string): {
    stderr: string;
    memoryKb: number;
};
export declare function buildDockerArgs(options: DockerRunOptions, containerName: string): string[];
export declare function runDockerContainer(options: DockerRunOptions): Promise<DockerExecutionResult>;
//# sourceMappingURL=docker-runner.d.ts.map