export interface SandboxBindMount {
  hostPath: string;
  containerPath: string;
  readOnly: boolean;
}

export interface SandboxRunOptions {
  image: string;
  command: string[];
  workdir: string;
  bindMounts?: SandboxBindMount[];
  memoryLimitMb: number;
  timeLimitMs: number;
  input?: string;
  networkNone?: boolean;
  dropCapabilities?: boolean;
  readOnlyRootfs?: boolean;
  user?: string;
}

export interface SandboxExecutionResult {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb: number;
  isTLE: boolean;
  isOOM: boolean;
  isOutputLimitExceeded: boolean;
  exitCode: number | null;
}

export interface Sandbox {
  run(options: SandboxRunOptions): Promise<SandboxExecutionResult>;
}
