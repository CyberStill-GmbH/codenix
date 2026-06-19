import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

const MAX_OUTPUT_BYTES = 1024 * 1024;

export interface DockerExecutionResult {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb: number;
  isTLE: boolean;
  isOOM: boolean;
  isOutputLimitExceeded: boolean;
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

function runDockerCommand(args: string[]): Promise<{ stdout: string; exitCode: number | null }> {
  return new Promise((resolve) => {
    const child = spawn("docker", args, { windowsHide: true });
    let stdout = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.on("error", () => resolve({ stdout: "", exitCode: null }));
    child.on("close", (exitCode) => resolve({ stdout, exitCode }));
  });
}

export function buildDockerArgs(
  options: DockerRunOptions,
  containerName: string
): string[] {
  const args = [
    "run",
    "--name",
    containerName,
    "--pull",
    "never",
    "--log-driver",
    "none",
    "--ipc",
    "none",
    "--pids-limit",
    "64",
    "--ulimit",
    "nofile=64:64",
    "--memory",
    `${options.memoryLimitMb}m`,
    "--memory-swap",
    `${options.memoryLimitMb}m`,
    "--cpus",
    "1",
    "-i"
  ];

  if (options.networkNone) args.push("--network", "none");
  if (options.dropCapabilities) {
    args.push("--cap-drop", "ALL", "--security-opt", "no-new-privileges");
  }
  if (options.readOnlyRootfs) {
    args.push(
      "--read-only",
      "--tmpfs",
      "/tmp:rw,noexec,nosuid,nodev,size=50m,mode=1777"
    );
  }
  if (options.user) args.push("--user", options.user);

  for (const mount of options.bindMounts ?? []) {
    args.push(
      "--mount",
      `type=bind,src=${mount.hostPath},dst=${mount.containerPath}${mount.readOnly ? ",readonly" : ""}`
    );
  }

  args.push("-w", options.workdir, options.image, ...options.command);
  return args;
}

export async function runDockerContainer(
  options: DockerRunOptions
): Promise<DockerExecutionResult> {
  const containerName = `codenix-judge-${randomUUID()}`;
  const args = buildDockerArgs(options, containerName);
  const startTime = Date.now();
  let stdout = "";
  let stderr = "";
  let outputBytes = 0;
  let isTLE = false;
  let isOutputLimitExceeded = false;
  let killRequested = false;

  const killContainer = () => {
    if (killRequested) return;
    killRequested = true;
    void runDockerCommand(["kill", containerName]);
  };

  const exitCode = await new Promise<number | null>((resolve, reject) => {
    const child = spawn("docker", args, {
      windowsHide: true,
      env: { PATH: process.env.PATH ?? "" }
    });

    const capture = (chunk: Buffer, stream: "stdout" | "stderr") => {
      const remaining = Math.max(0, MAX_OUTPUT_BYTES - outputBytes);
      const accepted = chunk.subarray(0, remaining);
      outputBytes += chunk.length;

      if (stream === "stdout") stdout += accepted.toString("utf8");
      else stderr += accepted.toString("utf8");

      if (outputBytes > MAX_OUTPUT_BYTES) {
        isOutputLimitExceeded = true;
        killContainer();
      }
    };

    child.stdout.on("data", (chunk: Buffer) => capture(chunk, "stdout"));
    child.stderr.on("data", (chunk: Buffer) => capture(chunk, "stderr"));
    child.on("error", reject);
    child.on("close", resolve);

    child.stdin.end(options.input ?? "");

    const timeout = setTimeout(() => {
      isTLE = true;
      killContainer();
    }, options.timeLimitMs + 1000);
    timeout.unref();
    child.once("close", () => clearTimeout(timeout));
  }).catch(async (error: unknown) => {
    await runDockerCommand(["rm", "--force", containerName]);
    throw error;
  });

  const inspect = await runDockerCommand([
    "inspect",
    "--format",
    "{{.State.OOMKilled}}",
    containerName
  ]);
  const isOOM = inspect.stdout.trim().toLowerCase() === "true";
  await runDockerCommand(["rm", "--force", containerName]);

  return {
    stdout,
    stderr: isOutputLimitExceeded
      ? `${stderr}\nOutput limit exceeded (1 MiB).`.trim()
      : stderr,
    executionTimeMs: Date.now() - startTime,
    memoryKb: 0,
    isTLE,
    isOOM,
    isOutputLimitExceeded,
    exitCode
  };
}
