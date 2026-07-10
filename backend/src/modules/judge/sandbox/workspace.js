import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
export class Workspace {
    hostPath;
    constructor(prefix = "codenix-judge", rootDir = os.tmpdir()) {
        this.hostPath = path.join(rootDir, `${prefix}-${randomUUID()}`);
    }
    filePath(filename) {
        return path.join(this.hostPath, filename);
    }
    async prepare(mode) {
        await fs.mkdir(this.hostPath, { recursive: true });
        if (mode !== undefined) {
            await fs.chmod(this.hostPath, mode);
        }
    }
    async writeFile(filename, contents, options = {}) {
        const targetPath = this.filePath(filename);
        await fs.writeFile(targetPath, contents, "utf8");
        if (options.mode !== undefined) {
            await fs.chmod(targetPath, options.mode);
        }
    }
    mount(containerPath, readOnly) {
        return { hostPath: this.hostPath, containerPath, readOnly };
    }
    async cleanup() {
        await fs.rm(this.hostPath, { recursive: true, force: true });
    }
}
//# sourceMappingURL=workspace.js.map