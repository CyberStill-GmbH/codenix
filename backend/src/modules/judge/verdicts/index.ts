export type VerdictValue =
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "time_limit_exceeded"
  | "memory_limit_exceeded"
  | "compilation_error"
  | "internal_error";

export const getVerdict = (
  isTLE: boolean,
  isOOM: boolean,
  isOutputLimitExceeded: boolean,
  exitCode: number | null,
  isCorrect: boolean
): VerdictValue => {
  if (isTLE) return "time_limit_exceeded";
  if (isOOM) return "memory_limit_exceeded";
  if (isOutputLimitExceeded) return "runtime_error";
  if (exitCode !== 0) return "runtime_error";
  if (!isCorrect) return "wrong_answer";
  return "accepted";
};
