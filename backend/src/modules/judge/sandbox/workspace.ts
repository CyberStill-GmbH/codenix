import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { SandboxBindMount } from "./types";

interface WriteFileOptions {
  mode?: number;
}

export class Workspace {
  readonly hostPath: string;

  constructor(prefix = "codenix-judge", rootDir = os.tmpdir()) {
    this.hostPath = path.join(rootDir, `${prefix}-${randomUUID()}`);
  }

  filePath(filename: string): string {
    return path.join(this.hostPath, filename);
  }

  async prepare(mode?: number): Promise<void> {
    await fs.mkdir(this.hostPath, { recursive: true });
    if (mode !== undefined) {
      await fs.chmod(this.hostPath, mode);
    }
  }

  async writeFile(
    filename: string,
    contents: string,
    options: WriteFileOptions = {},
  ): Promise<void> {
    const targetPath = this.filePath(filename);
    await fs.writeFile(targetPath, contents, "utf8");
    if (options.mode !== undefined) {
      await fs.chmod(targetPath, options.mode);
    }
  }

  mount(containerPath: string, readOnly: boolean): SandboxBindMount {
    return { hostPath: this.hostPath, containerPath, readOnly };
  }

  async cleanup(): Promise<void> {
    await fs.rm(this.hostPath, { recursive: true, force: true });
  }
}
