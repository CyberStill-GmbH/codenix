export type VerdictValue = "accepted" | "wrong_answer" | "runtime_error" | "time_limit_exceeded" | "memory_limit_exceeded" | "compilation_error" | "internal_error";
export declare const getVerdict: (isTLE: boolean, isOOM: boolean, isOutputLimitExceeded: boolean, exitCode: number | null, isCorrect: boolean) => VerdictValue;
//# sourceMappingURL=index.d.ts.map