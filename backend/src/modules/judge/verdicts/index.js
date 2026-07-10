export const getVerdict = (isTLE, isOOM, isOutputLimitExceeded, exitCode, isCorrect) => {
    if (isTLE)
        return "time_limit_exceeded";
    if (isOOM)
        return "memory_limit_exceeded";
    if (isOutputLimitExceeded)
        return "runtime_error";
    if (exitCode !== 0)
        return "runtime_error";
    if (!isCorrect)
        return "wrong_answer";
    return "accepted";
};
//# sourceMappingURL=index.js.map