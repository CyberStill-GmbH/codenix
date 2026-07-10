import type { SandboxBindMount } from "./types";
interface WriteFileOptions {
    mode?: number;
}
export declare class Workspace {
    readonly hostPath: string;
    constructor(prefix?: string, rootDir?: string);
    filePath(filename: string): string;
    prepare(mode?: number): Promise<void>;
    writeFile(filename: string, contents: string, options?: WriteFileOptions): Promise<void>;
    mount(containerPath: string, readOnly: boolean): SandboxBindMount;
    cleanup(): Promise<void>;
}
export {};
//# sourceMappingURL=workspace.d.ts.map