export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details?: Record<string, unknown> | undefined;
    constructor(statusCode: number, code: string, message: string, details?: Record<string, unknown>);
}
//# sourceMappingURL=app-error.d.ts.map