import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { SandboxExecutionResult, SandboxRunOptions } from "./types";

const MAX_OUTPUT_BYTES = 1024 * 1024;
const MEMORY_MARKER = "__CODENIX_MEMORY_KB__:";

export type DockerExecutionResult = SandboxExecutionResult;
export type DockerRunOptions = SandboxRunOptions;

function runDockerCommand(
  args: string[],
): Promise<{ stdout: string; exitCode: number | null }> {
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

const CGROUP_MEMORY_SCRIPT = `
"$@"
exit_code=$?
peak_bytes=""
if [ -r /sys/fs/cgroup/memory.peak ]; then
  peak_bytes=$(cat /sys/fs/cgroup/memory.peak)
elif [ -r /sys/fs/cgroup/memory/memory.max_usage_in_bytes ]; then
  peak_bytes=$(cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes)
fi
case "$peak_bytes" in
  ""|"max") ;;
  *[!0-9]*) ;;
  *) printf "\\n${MEMORY_MARKER}%s\\n" $(((peak_bytes + 1023) / 1024)) >&2 ;;
esac
exit "$exit_code"
`.trim();

export function wrapCommandWithMetrics(command: string[]): string[] {
  return ["sh", "-c", CGROUP_MEMORY_SCRIPT, "codenix-metrics", ...command];
}

export function extractMemoryMetric(stderr: string): {
  stderr: string;
  memoryKb: number;
} {
  const markerPattern = new RegExp(`^${MEMORY_MARKER}(\\d+)$`);
  let memoryKb = 0;
  const lines = stderr.split(/\r?\n/);
  const cleanedLines: string[] = [];

  for (const line of lines) {
    const match = line.match(markerPattern);
    if (!match) {
      cleanedLines.push(line);
      continue;
    }

    memoryKb = Math.max(memoryKb, Number.parseInt(match[1]!, 10));
  }

  const penultimateLine = lines.at(-2);
  if (
    lines.at(-1) === "" &&
    penultimateLine !== undefined &&
    markerPattern.test(penultimateLine) &&
    cleanedLines.at(-1) === ""
  ) {
    cleanedLines.pop();
  }

  return { stderr: memoryKb > 0 ? cleanedLines.join("\n") : stderr, memoryKb };
}

export function buildDockerArgs(
  options: DockerRunOptions,
  containerName: string,
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
    "-i",
  ];

  if (options.networkNone) args.push("--network", "none");
  if (options.dropCapabilities) {
    args.push("--cap-drop", "ALL", "--security-opt", "no-new-privileges");
  }
  if (options.readOnlyRootfs) {
    args.push(
      "--read-only",
      "--tmpfs",
      "/tmp:rw,noexec,nosuid,nodev,size=50m,mode=1777",
    );
  }
  if (options.user) args.push("--user", options.user);

  for (const mount of options.bindMounts ?? []) {
    args.push(
      "--mount",
      `type=bind,src=${mount.hostPath},dst=${mount.containerPath}${mount.readOnly ? ",readonly" : ""}`,
    );
  }

  args.push(
    "-w",
    options.workdir,
    options.image,
    ...wrapCommandWithMetrics(options.command),
  );
  return args;
}

export async function runDockerContainer(
  options: DockerRunOptions,
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
      env: { PATH: process.env.PATH ?? "" },
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
    containerName,
  ]);
  const isOOM = inspect.stdout.trim().toLowerCase() === "true";
  await runDockerCommand(["rm", "--force", containerName]);
  const memoryMetric = extractMemoryMetric(stderr);

  return {
    stdout,
    stderr: isOutputLimitExceeded
      ? `${memoryMetric.stderr}\nOutput limit exceeded (1 MiB).`.trim()
      : memoryMetric.stderr,
    executionTimeMs: Date.now() - startTime,
    memoryKb: memoryMetric.memoryKb,
    isTLE,
    isOOM,
    isOutputLimitExceeded,
    exitCode,
  };
}
