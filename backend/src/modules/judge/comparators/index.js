/**
 * Compares the actual output with the expected output.
 * Normalizes trailing whitespaces on each line and removes trailing newlines.
 */
export function compareOutput(actual, expected) {
    const actualNorm = normalize(actual || "");
    const expectedNorm = normalize(expected || "");
    return actualNorm === expectedNorm;
}
function normalize(s) {
    return s
        .trim()
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n');
}
//# sourceMappingURL=index.js.map