import { spawn } from "child_process";

export interface DockerExecutionResult {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb: number;
  isTLE: boolean;
  isOOM: boolean;
  exitCode: number | null;
}

export interface DockerRunOptions {
  image: string;
  command: string[];
  workdir: string;
  bindMounts?: { hostPath: string; containerPath: string; readOnly: boolean }[];
  memoryLimitMb: number;
  timeLimitMs: number;
  input?: string;
  networkNone?: boolean;
  dropCapabilities?: boolean;
  readOnlyRootfs?: boolean;
  user?: string;
}

export async function runDockerContainer(options: DockerRunOptions): Promise<DockerExecutionResult> {
  const args = ["run", "--rm", "-i"];

  if (options.networkNone) args.push("--network", "none");
  if (options.dropCapabilities) args.push("--cap-drop", "ALL", "--security-opt", "no-new-privileges");
  if (options.readOnlyRootfs) args.push("--read-only", "--tmpfs", "/tmp:rw,size=50m,mode=1777");
  if (options.user) args.push("--user", options.user);
  
  args.push(`--memory=${options.memoryLimitMb}m`);
  args.push(`--cpus=1`);
  args.push(`--pids-limit=64`);
  
  if (options.bindMounts) {
    for (const mount of options.bindMounts) {
      args.push("-v", `${mount.hostPath}:${mount.containerPath}${mount.readOnly ? ":ro" : ""}`);
    }
  }

  args.push("-w", options.workdir);
  args.push(options.image);
  args.push(...options.command);

  return new Promise((resolve) => {
    const startTime = Date.now();
    const child = spawn("docker", args);

    let stdout = "";
    let stderr = "";
    let isTLE = false;
    let isOOM = false;

    // Limit output to prevent memory exhaustion
    const MAX_OUTPUT_SIZE = 10 * 1024 * 1024; // 10MB

    const wallClockTimeoutMs = options.timeLimitMs + 2000;
    
    const timeout = setTimeout(() => {
      isTLE = true;
      child.kill("SIGKILL");
    }, wallClockTimeoutMs);

    if (options.input) {
      child.stdin.write(options.input);
      child.stdin.end();
    } else {
      child.stdin.end();
    }

    child.stdout.on("data", (data) => {
      stdout += data.toString();
      if (stdout.length > MAX_OUTPUT_SIZE) {
        child.kill("SIGKILL");
      }
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
      if (stderr.length > MAX_OUTPUT_SIZE) {
        child.kill("SIGKILL");
      }
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      const executionTimeMs = Date.now() - startTime;
      
      if (code === 137 && !isTLE) {
        isOOM = true;
      }

      resolve({
        stdout,
        stderr,
        executionTimeMs,
        memoryKb: 0,
        isTLE,
        isOOM,
        exitCode: code
      });
    });
  });
}
